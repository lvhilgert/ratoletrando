import * as Phaser from 'phaser';
import { audioJogo } from '../sistemas/SistemaAudio';
import { NivelSomaTrilha, NIVEIS_SOMA_TRILHA } from '../dados/configuracaoSomaTrilha';
import { servicoVoz } from '../../services/ServicoVoz';

interface Conta {a:number;b:number;resultado:number;simbolo:'+'|'−'}

export class SomaTrilha extends Phaser.Scene {
    private static contasRecentes:Partial<Record<NivelSomaTrilha,Set<string>>>={};
    private nivel:NivelSomaTrilha='somaFacil';
    private indice=0;
    private conta!:Conta;
    private personagem!:Phaser.GameObjects.Image;
    private alternativas:Phaser.GameObjects.Container[]=[];
    private textoOperacao!:Phaser.GameObjects.Text;
    private textoProgresso!:Phaser.GameObjects.Text;
    private feedback!:Phaser.GameObjects.Container;
    private pontosTrilha:Array<{x:number;y:number}>=[];
    private respondendo=false;
    private errosRodada=0;
    private representacao!:Phaser.GameObjects.Container;

    constructor(){super('SomaTrilha');}
    init(dados:{nivel?:NivelSomaTrilha}):void {this.nivel=dados.nivel??'somaFacil';}

    create():void {
        this.indice=0;this.respondendo=false;this.alternativas=[];
        const config=NIVEIS_SOMA_TRILHA[this.nivel];
        const tema=config.operacao==='soma'?[0xdff4f4,0xbfdca5]:[0xeee8f8,0xc7d7ee];this.add.graphics().fillGradientStyle(tema[0],tema[0],tema[1],tema[1],1).fillRect(0,0,960,640);
        const paisagem=this.add.graphics();paisagem.fillStyle(0xffffff,.5).fillEllipse(120,125,170,45).fillEllipse(805,145,190,48);paisagem.fillStyle(0x8fc878,.65).fillEllipse(140,555,390,180).fillEllipse(770,560,470,210);
        const voltar=this.botao(76,26,124,36,'‹  EDUCAPP',0x4e7c52,12);voltar.on('pointerdown',()=>this.scene.start('EducApp'));
        this.add.text(480,32,'SomaTrilha',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'32px',fontStyle:'bold',color:'#365d43'}).setOrigin(.5);
        this.textoProgresso=this.add.text(886,32,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#53715b'}).setOrigin(1,.5);
        this.criarSeletorNivel();

        this.add.graphics().fillStyle(0x31583f,.14).fillRoundedRect(300,111,360,91,25).fillStyle(0xfffdf2,1).fillRoundedRect(300,104,360,91,25).lineStyle(3,0xd0b877,.75).strokeRoundedRect(300,104,360,91,25);
        this.add.text(480,122,'RESOLVA PARA AVANÇAR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#88754b',letterSpacing:1}).setOrigin(.5);
        this.textoOperacao=this.add.text(480,163,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'38px',fontStyle:'bold',color:'#4c683f'}).setOrigin(.5);
        this.representacao=this.add.container(480,217);

        this.pontosTrilha=[{x:100,y:523},{x:190,y:487},{x:280,y:525},{x:370,y:482},{x:460,y:520},{x:550,y:478},{x:640,y:515},{x:730,y:474},{x:820,y:509}].slice(0,config.quantidadeDesafios+1);
        this.desenharTrilha();
        const ramos=this.add.graphics().setDepth(2).lineStyle(12,0xe4c982,.9);[300,480,660].forEach(x=>ramos.lineBetween(480,410,x,346));
        this.personagem=this.add.image(this.pontosTrilha[0].x,this.pontosTrilha[0].y-28,'rato',1).setDisplaySize(72,72).setDepth(6);
        this.feedback=this.add.container(480,588).setDepth(12).setAlpha(0);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>servicoVoz.parar());
        this.novaConta();
    }

    private criarSeletorNivel():void {
        const entradas=Object.entries(NIVEIS_SOMA_TRILHA) as [NivelSomaTrilha,typeof NIVEIS_SOMA_TRILHA[NivelSomaTrilha]][];
        entradas.forEach(([chave,config],i)=>{const ativo=chave===this.nivel,b=this.botao(298+i*122,77,112,31,config.rotulo,ativo?0x5f965f:0x9eb59f,10);b.setAlpha(ativo?1:.72);b.on('pointerdown',()=>{if(chave!==this.nivel)this.scene.restart({nivel:chave});});});
    }

    private desenharTrilha():void {
        const g=this.add.graphics().setDepth(1);g.lineStyle(58,0xb48955,1).beginPath().moveTo(this.pontosTrilha[0].x,this.pontosTrilha[0].y);this.pontosTrilha.slice(1).forEach(p=>g.lineTo(p.x,p.y));g.strokePath();g.lineStyle(42,0xe4c982,1).beginPath().moveTo(this.pontosTrilha[0].x,this.pontosTrilha[0].y);this.pontosTrilha.slice(1).forEach(p=>g.lineTo(p.x,p.y));g.strokePath();this.pontosTrilha.forEach((p,i)=>{g.fillStyle(i===0?0x77b56e:0xffefb0,1).fillCircle(p.x,p.y,13).lineStyle(3,0xffffff,.8).strokeCircle(p.x,p.y,13);if(i>0&&i%2===0)g.fillStyle(0xd96655,1).fillTriangle(p.x,p.y-48,p.x+21,p.y-39,p.x,p.y-30).lineStyle(3,0x6c5434,1).lineBetween(p.x,p.y-50,p.x,p.y-14);});
    }

    private novaConta():void {
        const config=NIVEIS_SOMA_TRILHA[this.nivel];this.respondendo=false;this.errosRodada=0;this.feedback.setAlpha(0);this.alternativas.forEach(a=>a.destroy(true));this.alternativas=[];this.conta=this.gerarConta();this.textoOperacao.setText(`${this.conta.a}  ${this.conta.simbolo}  ${this.conta.b}  =  ?`);this.textoProgresso.setText(`${this.indice+1} / ${config.quantidadeDesafios}`);this.desenharRepresentacao();this.criarAlternativas();this.time.delayedCall(280,()=>servicoVoz.falar(`${this.conta.a} ${config.operacao==='soma'?'mais':'menos'} ${this.conta.b}. Quanto é?`));
    }

    private gerarConta():Conta {
        const c=NIVEIS_SOMA_TRILHA[this.nivel];
        let conta:Conta,chave:string,tentativas=0;const usadas=SomaTrilha.contasRecentes[this.nivel]??=new Set<string>();do{if(c.operacao==='soma'){const resultado=Phaser.Math.Between(Math.max(2,c.valorMinimo+1),c.resultadoMaximo),a=Phaser.Math.Between(c.valorMinimo,Math.min(c.valorMaximo,Math.max(c.valorMinimo,resultado-1))),b=resultado-a;conta={a,b,resultado,simbolo:'+'};}else{const a=Phaser.Math.Between(Math.max(1,c.valorMinimo),c.valorMaximo),b=Phaser.Math.Between(0,a),resultado=a-b;conta={a,b,resultado,simbolo:'−'};}chave=`${conta.a}${conta.simbolo}${conta.b}`;tentativas++;}while(usadas.has(chave)&&tentativas<30);usadas.add(chave);if(usadas.size>c.quantidadeDesafios*2)usadas.clear();return conta;
    }

    private desenharRepresentacao():void {this.representacao.removeAll(true);const g=this.add.graphics(),desenhar=(q:number,x0:number,cor:number,riscados=0)=>{for(let i=0;i<Math.min(q,10);i++){const x=x0+(i%5)*14,y=Math.floor(i/5)*14-7;g.fillStyle(cor,1).fillCircle(x,y,5);if(i>=q-riscados)g.lineStyle(2,0xb85b52,1).lineBetween(x-5,y-5,x+5,y+5);}};if(this.conta.simbolo==='+'){desenhar(this.conta.a,-110,0x5b9dc8);desenhar(this.conta.b,35,0xe09b54);this.representacao.add([g,this.add.text(0,0,'+',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',color:'#75684d'}).setOrigin(.5)]);}else{desenhar(this.conta.a,-35,0x65a77a,this.conta.b);this.representacao.add(g);}}

    private criarAlternativas():void {
        const valores=new Set<number>([this.conta.resultado]),offsets=Phaser.Utils.Array.Shuffle([-2,-1,1,2,3,-3]);for(const offset of offsets){if(valores.size===3)break;const v=this.conta.resultado+offset;if(v>=0)valores.add(v);}for(let v=0;valores.size<3;v++)valores.add(v);
        Phaser.Utils.Array.Shuffle([...valores]).forEach((valor,i)=>{const x=300+i*180,c=this.add.container(x,302).setSize(122,104).setInteractive({useHandCursor:true}).setDepth(5),g=this.add.graphics();g.fillStyle(0x35523d,.16).fillEllipse(0,9,122,78).fillStyle(0xf5e5b6,1).fillEllipse(0,0,122,78).lineStyle(4,0xb99b62,.8).strokeEllipse(0,0,122,78);const t=this.add.text(0,-2,`${valor}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'33px',fontStyle:'bold',color:'#4d673e'}).setOrigin(.5);c.add([g,t]);c.setData({valor,g,t});c.on('pointerover',()=>this.tweens.add({targets:c,y:296,scale:1.04,duration:100}));c.on('pointerout',()=>this.tweens.add({targets:c,y:302,scale:1,duration:100}));c.on('pointerdown',()=>this.responder(c,valor));this.alternativas.push(c);});
    }

    private responder(botao:Phaser.GameObjects.Container,valor:number):void {
        if(this.respondendo||!botao.input?.enabled)return;
        if(valor!==this.conta.resultado){this.errosRodada++;audioJogo.efeito('erro');botao.disableInteractive().setAlpha(.58);this.tweens.add({targets:botao,x:botao.x-7,yoyo:true,repeat:3,duration:45});this.mostrarFeedback(this.errosRodada>=2?'DICA: CONTE OS PONTINHOS':'TENTE OUTRO CAMINHO',0xb96d51,false);if(this.errosRodada>=2)this.tweens.add({targets:this.representacao,scale:1.18,yoyo:true,repeat:2,duration:180});return;}
        this.respondendo=true;audioJogo.efeito('letra');this.alternativas.forEach(a=>a.disableInteractive().setAlpha(a===botao?1:.48));const g=botao.getData('g') as Phaser.GameObjects.Graphics;g.clear().fillStyle(0x3b7250,.16).fillEllipse(0,9,122,78).fillStyle(0xcceacb,1).fillEllipse(0,0,122,78).lineStyle(4,0x55a16a,1).strokeEllipse(0,0,122,78);this.mostrarFeedback('CAMINHO CERTO!',0x3d9060,false);
        const destino=this.pontosTrilha[this.indice+1],meioY=Math.min(this.personagem.y,destino.y-28)-52;this.tweens.add({targets:this.personagem,x:destino.x,y:meioY,duration:280,ease:'Sine.Out',onComplete:()=>this.tweens.add({targets:this.personagem,y:destino.y-28,duration:280,ease:'Bounce.Out',onComplete:()=>{this.indice++;if(this.indice>=NIVEIS_SOMA_TRILHA[this.nivel].quantidadeDesafios)this.concluirTrilha();else this.time.delayedCall(350,()=>this.novaConta());}})});
    }

    private concluirTrilha():void {audioJogo.efeito('vitoria');this.criarConfetes();this.tweens.add({targets:this.personagem,y:this.personagem.y-35,yoyo:true,repeat:3,duration:190,ease:'Sine.Out'});this.feedback.removeAll(true);this.feedback.add([this.add.graphics().fillStyle(0xffffff,.98).fillRoundedRect(-280,-38,560,76,24).lineStyle(3,0x4e9a66,.65).strokeRoundedRect(-280,-38,560,76,24),this.add.text(-75,0,'TRILHA CONCLUÍDA!',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'21px',fontStyle:'bold',color:'#39764e'}).setOrigin(.5)]);const novamente=this.botao(185,0,150,44,'JOGAR DE NOVO',0x4f9664,12);this.feedback.add(novamente);novamente.on('pointerdown',()=>this.scene.restart({nivel:this.nivel}));this.feedback.setAlpha(0).setScale(.9);this.tweens.add({targets:this.feedback,alpha:1,scale:1,duration:200,ease:'Back.Out'});}
    private criarConfetes():void {const cores=[0xffcf4b,0x66bc78,0x5e9ed2,0xe97668];for(let i=0;i<28;i++){const p=this.add.rectangle(Phaser.Math.Between(80,880),Phaser.Math.Between(-40,20),7,12,Phaser.Utils.Array.GetRandom(cores)).setDepth(10);this.tweens.add({targets:p,y:650,angle:Phaser.Math.Between(-360,360),duration:Phaser.Math.Between(1300,2400),delay:i*25});}}
    private mostrarFeedback(texto:string,cor:number,persistente:boolean):void {this.feedback.removeAll(true);this.feedback.add([this.add.graphics().fillStyle(0xffffff,.96).fillRoundedRect(-145,-22,290,44,17).lineStyle(2,cor,.5).strokeRoundedRect(-145,-22,290,44,17),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',fontStyle:'bold',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5)]);this.feedback.setAlpha(1);if(!persistente)this.time.delayedCall(850,()=>this.feedback.setAlpha(0));}
    private botao(x:number,y:number,w:number,h:number,texto:string,cor:number,tamanho:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setSize(w,h).setInteractive({useHandCursor:true});c.add([this.add.graphics().fillStyle(0x36513b,.16).fillRoundedRect(-w/2,-h/2+4,w,h,h/2).fillStyle(cor,1).fillRoundedRect(-w/2,-h/2,w,h,h/2),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:`${tamanho}px`,color:'#ffffff'}).setOrigin(.5)]);c.on('pointerover',()=>this.tweens.add({targets:c,scale:1.035,duration:90}));c.on('pointerout',()=>this.tweens.add({targets:c,scale:1,duration:90}));return c;}
}
