import * as Phaser from 'phaser';
import { FaixaReino, progressoReino } from '../sistemas/ProgressoReino';

const FONTE='Arial Rounded MT Bold, Arial Black, Arial';

export class ConfiguracaoReino extends Phaser.Scene {
    constructor(){super('ConfiguracaoReino');}

    create():void {
        const salvo=progressoReino.carregar();
        let invencivel=salvo.invencivel,faixaSoma={...salvo.faixaSoma},faixaQuantidade={...salvo.faixaQuantidade};
        this.cameras.main.setBackgroundColor(0xeaf5ee);
        this.add.graphics().fillGradientStyle(0xf7fbf8,0xf7fbf8,0xd8ece2,0xd8ece2,1).fillRect(0,0,960,640);
        const decoracao=this.add.graphics().setAlpha(.35);decoracao.fillStyle(0xffffff,1).fillCircle(74,92,62).fillCircle(895,80,76).fillCircle(900,570,70).fillStyle(0x9bcdb5,.35).fillCircle(125,570,38).fillCircle(830,170,22);
        this.add.text(480,48,'REINO DAS PORTAS',{fontFamily:FONTE,fontSize:'34px',fontStyle:'bold',color:'#285f4c'}).setOrigin(.5);
        this.add.text(480,84,'Prepare sua jornada do seu jeito!',{fontFamily:FONTE,fontSize:'16px',color:'#5c776b'}).setOrigin(.5);
        const painel=this.add.graphics().fillStyle(0x315e4b,.16).fillRoundedRect(146,121,668,400,28).fillStyle(0xfffdf7,1).fillRoundedRect(146,113,668,400,28).lineStyle(3,0x70aa8d,.72).strokeRoundedRect(146,113,668,400,28);
        painel.fillStyle(0xe6f3ec,1).fillRoundedRect(174,140,612,92,20).fillStyle(0xf8edda,1).fillRoundedRect(174,250,612,108,20).fillStyle(0xeee8f6,1).fillRoundedRect(174,376,612,108,20);
        this.add.text(202,158,'MODO INVENCÍVEL',{fontFamily:FONTE,fontSize:'17px',fontStyle:'bold',color:'#356b58'});
        this.add.text(202,187,'Explore sem perder vidas ou ser derrubado.',{fontFamily:FONTE,fontSize:'12px',color:'#63796f'});
        const toggle=this.criarToggle(706,186,invencivel,ativo=>invencivel=ativo);
        this.add.text(202,267,'SOMA E SUBTRAÇÃO',{fontFamily:FONTE,fontSize:'16px',fontStyle:'bold',color:'#8b622f'});
        this.add.text(202,294,'Escolha a faixa das respostas:',{fontFamily:FONTE,fontSize:'12px',color:'#766b5e'});
        const atualizarSoma=this.criarFaixa(572,310,faixaSoma,0,100,5,nova=>faixaSoma=nova);
        this.add.text(202,393,'DESAFIOS DE QUANTIDADE',{fontFamily:FONTE,fontSize:'16px',fontStyle:'bold',color:'#665188'});
        this.add.text(202,420,'Quantas estrelas podem aparecer:',{fontFamily:FONTE,fontSize:'12px',color:'#70677b'});
        const atualizarQuantidade=this.criarFaixa(572,436,faixaQuantidade,1,20,1,nova=>faixaQuantidade=nova);
        void toggle;void atualizarSoma;void atualizarQuantidade;
        this.criarBotao(300,568,210,52,'‹ EDUCAPP',0x557f9c,()=>this.scene.start('EducApp'));
        this.criarBotao(590,568,290,52,'COMEÇAR JORNADA',0x397a69,()=>{progressoReino.salvar({invencivel,faixaSoma,faixaQuantidade});this.scene.start('ReinoDasPortas');});
    }

    private criarToggle(x:number,y:number,inicial:boolean,aoMudar:(ativo:boolean)=>void):Phaser.GameObjects.Container {
        let ativo=inicial;const c=this.add.container(x,y).setSize(108,48).setInteractive({useHandCursor:true}),trilho=this.add.graphics(),bola=this.add.circle(0,0,13,0xffffff),estado=this.add.text(-35,-22,'',{fontFamily:FONTE,fontSize:'9px',fontStyle:'bold'}).setOrigin(.5);
        const desenhar=()=>{trilho.clear().fillStyle(ativo?0x62b68d:0xc8d2ce,1).fillRoundedRect(-30,-15,60,30,15);bola.setPosition(ativo?15:-15,0);estado.setText(ativo?'LIGADO':'DESLIGADO').setColor(ativo?'#34785b':'#74867e');};
        c.add([trilho,bola,estado]);desenhar();c.on('pointerdown',()=>{ativo=!ativo;aoMudar(ativo);desenhar();this.tweens.add({targets:bola,scale:1.2,yoyo:true,duration:100});});return c;
    }

    private criarFaixa(x:number,y:number,inicial:FaixaReino,limiteMin:number,limiteMax:number,passo:number,aoMudar:(faixa:FaixaReino)=>void):Phaser.GameObjects.Container {
        let faixa={minimo:Phaser.Math.Clamp(inicial.minimo,limiteMin,limiteMax-passo),maximo:Phaser.Math.Clamp(inicial.maximo,limiteMin+passo,limiteMax)};if(faixa.minimo>=faixa.maximo)faixa={minimo:limiteMin,maximo:limiteMax};
        const c=this.add.container(x,y),valorMin=this.add.text(-82,0,'',{fontFamily:FONTE,fontSize:'20px',fontStyle:'bold',color:'#385f51'}).setOrigin(.5),valorMax=this.add.text(82,0,'',{fontFamily:FONTE,fontSize:'20px',fontStyle:'bold',color:'#385f51'}).setOrigin(.5);
        const botao=(px:number,rotulo:string,acao:()=>void)=>{const b=this.add.container(px,0).setSize(38,38).setInteractive({useHandCursor:true});b.add([this.add.graphics().fillStyle(0x4c9276,1).fillRoundedRect(-19,-19,38,38,11).lineStyle(2,0xffffff,.55).strokeRoundedRect(-19,-19,38,38,11),this.add.text(0,-1,rotulo,{fontFamily:FONTE,fontSize:'23px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5)]);b.on('pointerdown',()=>{acao();desenhar();aoMudar({...faixa});this.tweens.add({targets:b,scale:.9,yoyo:true,duration:70});});return b;};
        const desenhar=()=>{valorMin.setText(`${faixa.minimo}`);valorMax.setText(`${faixa.maximo}`);};
        c.add([this.add.text(-82,-29,'MÍN.',{fontFamily:FONTE,fontSize:'9px',color:'#718078'}).setOrigin(.5),this.add.text(82,-29,'MÁX.',{fontFamily:FONTE,fontSize:'9px',color:'#718078'}).setOrigin(.5),botao(-130,'−',()=>faixa.minimo=Math.max(limiteMin,faixa.minimo-passo)),valorMin,botao(-35,'+',()=>faixa.minimo=Math.min(faixa.maximo-passo,faixa.minimo+passo)),this.add.text(0,0,'ATÉ',{fontFamily:FONTE,fontSize:'9px',color:'#718078'}).setOrigin(.5),botao(35,'−',()=>faixa.maximo=Math.max(faixa.minimo+passo,faixa.maximo-passo)),valorMax,botao(130,'+',()=>faixa.maximo=Math.min(limiteMax,faixa.maximo+passo))]);desenhar();aoMudar({...faixa});return c;
    }

    private criarBotao(x:number,y:number,largura:number,altura:number,rotulo:string,cor:number,acao:()=>void):void {const c=this.add.container(x,y).setSize(largura,altura).setInteractive({useHandCursor:true});c.add([this.add.graphics().fillStyle(0x234d3d,.2).fillRoundedRect(-largura/2,-altura/2+5,largura,altura,altura/2).fillStyle(cor,1).fillRoundedRect(-largura/2,-altura/2,largura,altura,altura/2).lineStyle(2,0xffffff,.35).strokeRoundedRect(-largura/2,-altura/2,largura,altura,altura/2),this.add.text(0,0,rotulo,{fontFamily:FONTE,fontSize:'15px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5)]);c.on('pointerover',()=>this.tweens.add({targets:c,scale:1.035,duration:90}));c.on('pointerout',()=>this.tweens.add({targets:c,scale:1,duration:90}));c.on('pointerdown',acao);}
}
