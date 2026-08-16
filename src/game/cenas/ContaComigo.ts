import * as Phaser from 'phaser';
import { audioJogo } from '../sistemas/SistemaAudio';
import { CategoriaObjeto, NivelContaComigo, NIVEIS_CONTA_COMIGO } from '../dados/configuracaoContaComigo';
import { servicoVoz } from '../../services/ServicoVoz';
import { confirmarSaidaParaEducApp } from '../sistemas/ConfirmacaoSaida';

export class ContaComigo extends Phaser.Scene {
    private static ultimasQuantidades:Partial<Record<NivelContaComigo,number>>={};
    private nivel:NivelContaComigo='nivel1';
    private indice=0;
    private quantidade=1;
    private categoria:CategoriaObjeto='frutas';
    private objetos:Phaser.GameObjects.Container[]=[];
    private contados:Phaser.GameObjects.Container[]=[];
    private textoContagem!:Phaser.GameObjects.Text;
    private feedback!:Phaser.GameObjects.Container;
    private botoesResposta:Phaser.GameObjects.Container[]=[];
    private concluido=false;
    private altoContraste=false;
    private tentativas=0;
    private pote!:Phaser.GameObjects.Graphics;

    constructor(){super('ContaComigo');}
    init(dados:{nivel?:NivelContaComigo;indice?:number}):void {this.nivel=dados.nivel??'nivel1';this.indice=dados.indice??0;}

    create():void {
        const config=NIVEIS_CONTA_COMIGO[this.nivel];this.objetos=[];this.contados=[];this.botoesResposta=[];this.concluido=false;this.tentativas=0;
        do{this.quantidade=Phaser.Math.Between(config.quantidadeMinima,config.quantidadeMaxima);}while(config.quantidadeMaxima>config.quantidadeMinima&&this.quantidade===ContaComigo.ultimasQuantidades[this.nivel]);ContaComigo.ultimasQuantidades[this.nivel]=this.quantidade;this.categoria=config.categorias[this.indice%config.categorias.length];
        this.add.graphics().fillGradientStyle(0xfbfaf3,0xfbfaf3,0xe9f1d8,0xe9f1d8,1).fillRect(0,0,960,640);
        const decor=this.add.graphics().setAlpha(.25);decor.fillStyle(0x8fc66d,.4).fillCircle(45,65,55).fillCircle(925,575,80).fillStyle(0xffffff,.9).fillCircle(900,66,58).fillCircle(55,575,70);
        const voltar=this.botao(76,26,124,36,'‹  EDUCAPP',0x628a48,12);voltar.on('pointerdown',()=>confirmarSaidaParaEducApp(this));
        this.add.text(480,33,'ContaComigo',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'32px',fontStyle:'bold',color:'#4c7137'}).setOrigin(.5);
        this.add.text(884,33,`${this.indice+1} / ${config.quantidadeDesafios}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#667c58'}).setOrigin(1,.5);
        this.criarSeletorNivel();
        const contraste=this.botao(822,77,130,31,'ALTO CONTRASTE',0x70836a,9);contraste.on('pointerdown',()=>{this.altoContraste=!this.altoContraste;contraste.setAlpha(this.altoContraste?1:.72);this.objetos.forEach(o=>{const h=o.getData('halo') as Phaser.GameObjects.Arc;if(o.getData('contado'))h.setFillStyle(this.altoContraste?0xffe36e:0xccebc5,.7).setStrokeStyle(4,this.altoContraste?0x245a9b:0x5da857,1);});});
        this.add.text(480,113,'QUANTOS OBJETOS EXISTEM?',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'19px',fontStyle:'bold',color:'#52713e',letterSpacing:.5}).setOrigin(.5);
        this.add.graphics().fillStyle(0x35572e,.1).fillRoundedRect(63,143,840,315,28).fillStyle(0xffffff,.94).fillRoundedRect(60,137,840,315,28).lineStyle(3,0xa9cb91,.55).strokeRoundedRect(60,137,840,315,28);
        this.criarObjetos();
        this.textoContagem=this.add.text(480,476,'TOQUE NOS OBJETOS PARA CONTAR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',color:'#71836a'}).setOrigin(.5);
        this.pote=this.add.graphics();this.desenharPote();
        this.criarAlternativas();
        this.feedback=this.add.container(480,600).setAlpha(0);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>servicoVoz.parar());
        this.time.delayedCall(350,()=>servicoVoz.falar('Quantos objetos existem?'));
    }

    private criarSeletorNivel():void {
        (Object.entries(NIVEIS_CONTA_COMIGO) as [NivelContaComigo,typeof NIVEIS_CONTA_COMIGO[NivelContaComigo]][]).forEach(([chave,config],i)=>{const ativo=chave===this.nivel,b=this.botao(302+i*117,77,105,31,config.rotulo,ativo?0x76a952:0xb8c6ae,10);b.setAlpha(ativo?1:.72);b.on('pointerdown',()=>{if(chave!==this.nivel)this.scene.restart({nivel:chave,indice:0});});});
    }

    private criarObjetos():void {
        const avancado=NIVEIS_CONTA_COMIGO[this.nivel].quantidadeMaxima>20,colunas=avancado?6:5,linhas=avancado?5:4,celulaW=avancado?126:145,celulaH=avancado?54:68,candidatos:Array<{x:number;y:number}>=[],organizacao=this.indice%3;
        for(let l=0;l<linhas;l++)for(let c=0;c<colunas;c++){const deslocamento=organizacao===0?Phaser.Math.Between(-10,10):organizacao===1?(l%2)*12:0,jitterY=organizacao===2?0:Phaser.Math.Between(-4,4);candidatos.push({x:480+(c-(colunas-1)/2)*celulaW+deslocamento,y:166+l*celulaH+jitterY});}
        Phaser.Utils.Array.Shuffle(candidatos).slice(0,this.quantidade).forEach((pos,i)=>{const objeto=this.criarObjeto(pos.x,pos.y,i);this.objetos.push(objeto);});
    }

    private criarObjeto(x:number,y:number,indice:number):Phaser.GameObjects.Container {
        const avancado=NIVEIS_CONTA_COMIGO[this.nivel].quantidadeMaxima>20,tamanhoToque=avancado?50:64,c=this.add.container(x,y).setSize(tamanhoToque,tamanhoToque).setInteractive({useHandCursor:true});
        const halo=this.add.circle(0,0,avancado?25:31,0x73bd68,0).setStrokeStyle(3,0x5da857,0);
        const tamanho=avancado?46:54;
        if(this.categoria==='frutas'){
            const texturas=['fruta-maca','fruta-cereja','fruta-melancia'];c.add([halo,this.add.image(0,0,texturas[indice%texturas.length]).setDisplaySize(tamanho,tamanho)]);
        }else if(this.categoria==='estrelas')c.add([halo,this.add.image(0,0,'estrela-0').setDisplaySize(tamanho,tamanho)]);
        else c.add([halo,this.add.circle(0,0,23,indice%2?0x66bceb:0xf2a85c).setStrokeStyle(4,0xffffff),this.add.circle(-7,-7,6,0xffffff,.4)]);
        const badge=this.add.container(22,-21).setAlpha(0);badge.add([this.add.circle(0,0,13,0x3d8f62).setStrokeStyle(2,0xffffff),this.add.text(0,0,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#ffffff'}).setOrigin(.5)]);c.add(badge);c.setData({contado:false,halo,badge,textoBadge:badge.list[1]});c.on('pointerdown',()=>this.alternarContagem(c));return c;
    }

    private alternarContagem(objeto:Phaser.GameObjects.Container):void {
        if(this.concluido)return;const contado=objeto.getData('contado') as boolean,halo=objeto.getData('halo') as Phaser.GameObjects.Arc,badge=objeto.getData('badge') as Phaser.GameObjects.Container;
        objeto.setData('contado',!contado);if('vibrate' in navigator)navigator.vibrate(10);if(contado){this.contados=this.contados.filter(item=>item!==objeto);halo.setFillStyle(0x73bd68,0).setStrokeStyle(3,0x5da857,0);badge.setAlpha(0);}else{this.contados.push(objeto);halo.setFillStyle(this.altoContraste?0xffe36e:0xccebc5,.65).setStrokeStyle(this.altoContraste?4:3,this.altoContraste?0x245a9b:0x5da857,.95);badge.setAlpha(1);this.tweens.add({targets:objeto,scale:1.16,yoyo:true,duration:110,ease:'Sine.Out'});}this.atualizarNumeracao();this.desenharPote();if(this.contados.length)servicoVoz.falar(`${this.contados.length}`);
    }
    private atualizarNumeracao():void {this.contados.forEach((objeto,i)=>(objeto.getData('textoBadge') as Phaser.GameObjects.Text).setText(`${i+1}`));this.textoContagem.setText(this.contados.length?`VOCÊ CONTOU:  ${this.contados.length}`:'TOQUE NOS OBJETOS PARA CONTAR');}

    private criarAlternativas():void {
        const config=NIVEIS_CONTA_COMIGO[this.nivel],valores=new Set<number>([this.quantidade]),limite=Math.max(config.quantidadeMaxima+2,config.numeroAlternativas);
        const offsets=Phaser.Utils.Array.Shuffle([-2,-1,1,2,3,-3]);for(const offset of offsets){if(valores.size>=config.numeroAlternativas)break;const valor=this.quantidade+offset;if(valor>=1&&valor<=limite)valores.add(valor);}for(let n=1;valores.size<config.numeroAlternativas;n++)if(n!==this.quantidade)valores.add(n);
        const opcoes=Phaser.Utils.Array.Shuffle([...valores]),w=100,espaco=22,total=opcoes.length*w+(opcoes.length-1)*espaco;
        opcoes.forEach((valor,i)=>{const x=480-total/2+w/2+i*(w+espaco),b=this.botao(x,531,w,58,`${valor}`,0x6ea34f,25);b.setData('valor',valor);b.on('pointerdown',()=>this.responder(b,valor));this.botoesResposta.push(b);});
    }

    private responder(botao:Phaser.GameObjects.Container,valor:number):void {
        if(this.concluido)return;this.tentativas++;if(valor===this.quantidade){this.concluido=true;audioJogo.efeito('letra');servicoVoz.falar(`Muito bem. São ${this.quantidade}.`);this.botoesResposta.forEach(b=>b.disableInteractive().setAlpha((b.getData('valor') as number)===valor?1:.5));this.tweens.add({targets:botao,scale:1.14,yoyo:true,duration:170});const representacao=this.tentativas===1?`★  DE PRIMEIRA!  ${this.quantidade}`:this.quantidade<=10?`${'● '.repeat(this.quantidade)}= ${this.quantidade}`:`${this.quantidade} OBJETOS = ${this.quantidade}`;this.mostrarFeedback(representacao,0x3b9560,true);}else{audioJogo.efeito('erro');this.tweens.add({targets:botao,x:botao.x-6,yoyo:true,repeat:3,duration:45});this.mostrarFeedback('TENTE OUTRA VEZ',0xc5784d,false);}
    }
    private desenharPote():void {if(!this.pote)return;this.pote.clear().lineStyle(3,0x6f8e7a,.65).strokeRoundedRect(835,455,60,39,10);const limite=Math.min(this.contados.length,12);for(let i=0;i<limite;i++)this.pote.fillStyle(i%2?0xf0ad55:0x69b881,1).fillCircle(845+(i%6)*8,484-Math.floor(i/6)*10,4);}
    private mostrarFeedback(texto:string,cor:number,proximo:boolean):void {this.feedback.removeAll(true);const largura=proximo?500:260;this.feedback.add([this.add.graphics().fillStyle(0xffffff,.98).fillRoundedRect(-largura/2,-25,largura,50,18).lineStyle(2,cor,.55).strokeRoundedRect(-largura/2,-25,largura,50,18),this.add.text(proximo?-55:0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:proximo?'18px':'14px',fontStyle:'bold',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5)]);if(proximo){const b=this.botao(165,0,140,38,'PRÓXIMO  ›',cor,13);this.feedback.add(b);b.on('pointerdown',()=>{const config=NIVEIS_CONTA_COMIGO[this.nivel],proximoIndice=(this.indice+1)%config.quantidadeDesafios;this.scene.restart({nivel:this.nivel,indice:proximoIndice});});}this.feedback.setAlpha(0).setScale(.9);this.tweens.add({targets:this.feedback,alpha:1,scale:1,duration:170,ease:'Back.Out'});if(!proximo)this.time.delayedCall(1000,()=>this.feedback.setAlpha(0));}
    private botao(x:number,y:number,w:number,h:number,texto:string,cor:number,tamanho:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setSize(w,h).setInteractive({useHandCursor:true});c.add([this.add.graphics().fillStyle(0x40572f,.16).fillRoundedRect(-w/2,-h/2+4,w,h,h/2).fillStyle(cor,1).fillRoundedRect(-w/2,-h/2,w,h,h/2),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:`${tamanho}px`,color:'#ffffff'}).setOrigin(.5)]);c.on('pointerover',()=>this.tweens.add({targets:c,scale:1.035,duration:90}));c.on('pointerout',()=>this.tweens.add({targets:c,scale:1,duration:90}));return c;}
}
