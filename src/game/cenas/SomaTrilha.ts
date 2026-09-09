import * as Phaser from 'phaser';
import { audioJogo } from '../sistemas/SistemaAudio';
import { NivelSomaTrilha, NIVEIS_SOMA_TRILHA } from '../dados/configuracaoSomaTrilha';
import { servicoVoz } from '../../services/ServicoVoz';
import { confirmarSaidaParaEducApp } from '../sistemas/ConfirmacaoSaida';
import { mostrarModalConclusao } from '../sistemas/ModalConclusao';
import { botaoRaster, circuloRaster, linhaRaster, painelRaster } from '../sistemas/ArteRaster';

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
        this.add.image(480,320,'minijogos-fundo').setDisplaySize(960,640);
        circuloRaster(this,120,125,90,0xffffff,.18).setScale(1.9,.5);circuloRaster(this,805,145,96,0xffffff,.18).setScale(2,.5);
        const voltar=this.botao(76,26,124,36,'‹  EDUCAPP',0x4e7c52,12);voltar.on('pointerdown',()=>confirmarSaidaParaEducApp(this));
        this.add.text(480,32,'SomaTrilha',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'32px',fontStyle:'bold',color:'#365d43'}).setOrigin(.5);
        this.textoProgresso=this.add.text(886,32,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#53715b'}).setOrigin(1,.5);
        this.criarSeletorNivel();

        painelRaster(this,480,157,360,91,0x31583f,.14);painelRaster(this,480,150,366,97,0xd0b877,.75);painelRaster(this,480,150,360,91,0xfffdf2);
        this.add.text(480,122,'RESOLVA PARA AVANÇAR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#88754b',letterSpacing:1}).setOrigin(.5);
        this.textoOperacao=this.add.text(480,163,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'38px',fontStyle:'bold',color:'#4c683f'}).setOrigin(.5);
        this.representacao=this.add.container(480,217);

        this.pontosTrilha=[{x:100,y:523},{x:190,y:487},{x:280,y:525},{x:370,y:482},{x:460,y:520},{x:550,y:478},{x:640,y:515},{x:730,y:474},{x:820,y:509}].slice(0,config.quantidadeDesafios+1);
        this.desenharTrilha();
        [300,480,660].forEach(x=>linhaRaster(this,480,410,x,346,12,0xe4c982,.9).setDepth(2));
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
        this.pontosTrilha.slice(1).forEach((p,i)=>{const anterior=this.pontosTrilha[i];linhaRaster(this,anterior.x,anterior.y,p.x,p.y,58,0xb48955).setDepth(1);linhaRaster(this,anterior.x,anterior.y,p.x,p.y,42,0xe4c982).setDepth(1);});this.pontosTrilha.forEach((p,i)=>{circuloRaster(this,p.x,p.y,32,0xffffff,.8).setDepth(2);circuloRaster(this,p.x,p.y,26,i===0?0x77b56e:0xffefb0).setDepth(2);if(i>0&&i%2===0)this.add.image(p.x,p.y-42,'estrela-0').setDisplaySize(30,30).setTint(0xd96655).setDepth(2);});
    }

    private novaConta():void {
        const config=NIVEIS_SOMA_TRILHA[this.nivel];this.respondendo=false;this.errosRodada=0;this.feedback.setAlpha(0);this.alternativas.forEach(a=>a.destroy(true));this.alternativas=[];this.conta=this.gerarConta();this.textoOperacao.setText(`${this.conta.a}  ${this.conta.simbolo}  ${this.conta.b}  =  ?`);this.textoProgresso.setText(`${this.indice+1} / ${config.quantidadeDesafios}`);this.desenharRepresentacao();this.criarAlternativas();this.time.delayedCall(280,()=>servicoVoz.falar(`${this.conta.a} ${config.operacao==='soma'?'mais':'menos'} ${this.conta.b}. Quanto é?`));
    }

    private gerarConta():Conta {
        const c=NIVEIS_SOMA_TRILHA[this.nivel];
        let conta:Conta,chave:string,tentativas=0;const usadas=SomaTrilha.contasRecentes[this.nivel]??=new Set<string>();do{if(c.operacao==='soma'){const resultado=Phaser.Math.Between(Math.max(2,c.valorMinimo+1),c.resultadoMaximo),a=Phaser.Math.Between(c.valorMinimo,Math.min(c.valorMaximo,Math.max(c.valorMinimo,resultado-1))),b=resultado-a;conta={a,b,resultado,simbolo:'+'};}else{const a=Phaser.Math.Between(Math.max(1,c.valorMinimo),c.valorMaximo),b=Phaser.Math.Between(0,a),resultado=a-b;conta={a,b,resultado,simbolo:'−'};}chave=`${conta.a}${conta.simbolo}${conta.b}`;tentativas++;}while(usadas.has(chave)&&tentativas<30);usadas.add(chave);if(usadas.size>c.quantidadeDesafios*2)usadas.clear();return conta;
    }

    private desenharRepresentacao():void {this.representacao.removeAll(true);const desenhar=(q:number,x0:number,cor:number,riscados=0)=>{for(let i=0;i<Math.min(q,10);i++){const x=x0+(i%5)*14,y=Math.floor(i/5)*14-7;this.representacao.add(circuloRaster(this,x,y,10,cor));if(i>=q-riscados)this.representacao.add(linhaRaster(this,x-5,y-5,x+5,y+5,2,0xb85b52));}};if(this.conta.simbolo==='+'){desenhar(this.conta.a,-110,0x5b9dc8);desenhar(this.conta.b,35,0xe09b54);this.representacao.add(this.add.image(0,0,'ui-plus').setDisplaySize(18,18).setTint(0x75684d));}else desenhar(this.conta.a,-35,0x65a77a,this.conta.b);}

    private criarAlternativas():void {
        const valores=new Set<number>([this.conta.resultado]),offsets=Phaser.Utils.Array.Shuffle([-2,-1,1,2,3,-3]);for(const offset of offsets){if(valores.size===3)break;const v=this.conta.resultado+offset;if(v>=0)valores.add(v);}for(let v=0;valores.size<3;v++)valores.add(v);
        Phaser.Utils.Array.Shuffle([...valores]).forEach((valor,i)=>{const x=300+i*180,c=this.add.container(x,302).setSize(122,104).setInteractive({useHandCursor:true}).setDepth(5),sombra=botaoRaster(this,0,9,122,78,0x35523d,.16),borda=botaoRaster(this,0,0,130,86,0xb99b62,.8),fundo=botaoRaster(this,0,0,122,78,0xf5e5b6),t=this.add.text(0,-2,`${valor}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'33px',fontStyle:'bold',color:'#4d673e'}).setOrigin(.5);c.add([sombra,borda,fundo,t]);c.setData({valor,borda,fundo,t});c.on('pointerover',()=>this.tweens.add({targets:c,y:296,scale:1.04,duration:100}));c.on('pointerout',()=>this.tweens.add({targets:c,y:302,scale:1,duration:100}));c.on('pointerdown',()=>this.responder(c,valor));this.alternativas.push(c);});
    }

    private responder(botao:Phaser.GameObjects.Container,valor:number):void {
        if(this.respondendo||!botao.input?.enabled)return;
        if(valor!==this.conta.resultado){this.errosRodada++;audioJogo.efeito('erro');botao.disableInteractive().setAlpha(.58);this.tweens.add({targets:botao,x:botao.x-7,yoyo:true,repeat:3,duration:45});this.mostrarFeedback(this.errosRodada>=2?'DICA: CONTE OS PONTINHOS':'TENTE OUTRO CAMINHO',0xb96d51,false);if(this.errosRodada>=2)this.tweens.add({targets:this.representacao,scale:1.18,yoyo:true,repeat:2,duration:180});return;}
        this.respondendo=true;audioJogo.efeito('letra');this.alternativas.forEach(a=>a.disableInteractive().setAlpha(a===botao?1:.48));(botao.getData('fundo') as Phaser.GameObjects.NineSlice).setTint(0xcceacb);(botao.getData('borda') as Phaser.GameObjects.NineSlice).setTint(0x55a16a).setAlpha(1);this.mostrarFeedback('CAMINHO CERTO!',0x3d9060,false);
        const destino=this.pontosTrilha[this.indice+1],meioY=Math.min(this.personagem.y,destino.y-28)-52;this.tweens.add({targets:this.personagem,x:destino.x,y:meioY,duration:280,ease:'Sine.Out',onComplete:()=>this.tweens.add({targets:this.personagem,y:destino.y-28,duration:280,ease:'Bounce.Out',onComplete:()=>{this.indice++;if(this.indice>=NIVEIS_SOMA_TRILHA[this.nivel].quantidadeDesafios)this.concluirTrilha();else this.time.delayedCall(350,()=>this.novaConta());}})});
    }

    private concluirTrilha():void {audioJogo.efeito('vitoria');this.criarConfetes();this.tweens.add({targets:this.personagem,y:this.personagem.y-35,yoyo:true,repeat:3,duration:190,ease:'Sine.Out'});this.time.delayedCall(550,()=>{const niveis=Object.keys(NIVEIS_SOMA_TRILHA) as NivelSomaTrilha[],proximo=niveis[(niveis.indexOf(this.nivel)+1)%niveis.length];mostrarModalConclusao(this,{titulo:'TRILHA CONCLUÍDA!',mensagem:`Você venceu o nível ${NIVEIS_SOMA_TRILHA[this.nivel].rotulo}. O que deseja fazer agora?`,cor:0x4f9664,aoJogarNovamente:()=>this.scene.restart({nivel:this.nivel}),aoOutroNivel:()=>this.scene.restart({nivel:proximo})});});}
    // raster-exception: confetes efêmeros de celebração.
    private criarConfetes():void {const cores=[0xffcf4b,0x66bc78,0x5e9ed2,0xe97668];for(let i=0;i<28;i++){const p=this.add.rectangle(Phaser.Math.Between(80,880),Phaser.Math.Between(-40,20),7,12,Phaser.Utils.Array.GetRandom(cores)).setDepth(10);this.tweens.add({targets:p,y:650,angle:Phaser.Math.Between(-360,360),duration:Phaser.Math.Between(1300,2400),delay:i*25});}}
    private mostrarFeedback(texto:string,cor:number,persistente:boolean):void {this.feedback.removeAll(true);this.feedback.add([painelRaster(this,0,0,294,48,cor,.5),painelRaster(this,0,0,290,44,0xffffff,.96),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',fontStyle:'bold',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5)]);this.feedback.setAlpha(1);if(!persistente)this.time.delayedCall(850,()=>this.feedback.setAlpha(0));}
    private botao(x:number,y:number,w:number,h:number,texto:string,cor:number,tamanho:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setSize(w,h).setInteractive({useHandCursor:true});c.add([botaoRaster(this,0,4,w,h,0x36513b,.16),botaoRaster(this,0,0,w,h,cor),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:`${tamanho}px`,color:'#ffffff'}).setOrigin(.5)]);c.on('pointerover',()=>this.tweens.add({targets:c,scale:1.035,duration:90}));c.on('pointerout',()=>this.tweens.add({targets:c,scale:1,duration:90}));return c;}
}
