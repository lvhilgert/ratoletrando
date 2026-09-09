import * as Phaser from 'phaser';
import { botaoRaster, circuloRaster, painelRaster } from './ArteRaster';

export interface OpcoesModalConclusao {
    titulo?:string;
    mensagem:string;
    cor:number;
    aoJogarNovamente:()=>void;
    aoOutroNivel?:()=>void;
}

/** Janela final compartilhada pelos minijogos curtos. */
export function mostrarModalConclusao(cena:Phaser.Scene,opcoes:OpcoesModalConclusao):Phaser.GameObjects.Container {
    const modal=cena.add.container(480,320).setDepth(300),temNivel=Boolean(opcoes.aoOutroNivel),largura=temNivel?700:520,altura=temNivel?330:300;
    const fundo=painelRaster(cena,0,0,960,640,0x163b32,.62).setInteractive(),sombra=painelRaster(cena,0,10,largura,altura,0x173b31,.22),borda=painelRaster(cena,0,0,largura+10,altura+10,opcoes.cor,.82),painel=painelRaster(cena,0,0,largura,altura,0xfffdf5),halo=circuloRaster(cena,0,-92,96,opcoes.cor,.12),estrela=cena.add.image(0,-98,'estrela-0').setDisplaySize(60,60);
    const titulo=cena.add.text(0,-42,opcoes.titulo??'DESAFIO CONCLUÍDO!',{fontFamily:'Trebuchet MS, Verdana, Arial, sans-serif',fontSize:'28px',fontStyle:'bold',color:`#${opcoes.cor.toString(16).padStart(6,'0')}`}).setOrigin(.5).setResolution(2),mensagem=cena.add.text(0,0,opcoes.mensagem,{fontFamily:'Trebuchet MS, Verdana, Arial, sans-serif',fontSize:'16px',color:'#405e53',align:'center',wordWrap:{width:largura-90},lineSpacing:5}).setOrigin(.5).setResolution(2);
    modal.add([fundo,sombra,borda,painel,halo,estrela,titulo,mensagem]);
    const botao=(x:number,y:number,w:number,texto:string,cor:number,acao:()=>void)=>{const c=cena.add.container(x,y).setSize(w,50).setInteractive({useHandCursor:true}),t=cena.add.text(0,0,texto,{fontFamily:'Trebuchet MS, Verdana, Arial, sans-serif',fontSize:'13px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5).setResolution(2);c.add([botaoRaster(cena,0,4,w,50,0x173b31,.18),botaoRaster(cena,0,0,w,50,cor),t]);c.on('pointerover',()=>cena.tweens.add({targets:c,scale:1.04,duration:90}));c.on('pointerout',()=>cena.tweens.add({targets:c,scale:1,duration:90}));c.on('pointerdown',acao);modal.add(c);return c;};
    if(temNivel){botao(-218,92,190,'↻  JOGAR NOVAMENTE',opcoes.cor,opcoes.aoJogarNovamente);botao(0,92,190,'◆  OUTRO NÍVEL',0x6f68a7,opcoes.aoOutroNivel!);botao(218,92,190,'⌂  EDUCAPP',0x557a70,()=>cena.scene.start('EducApp'));}
    else {botao(-112,82,200,'↻  JOGAR NOVAMENTE',opcoes.cor,opcoes.aoJogarNovamente);botao(112,82,200,'⌂  EDUCAPP',0x557a70,()=>cena.scene.start('EducApp'));}
    modal.setAlpha(0).setScale(.86);cena.tweens.add({targets:modal,alpha:1,scale:1,duration:260,ease:'Back.Out'});cena.tweens.add({targets:estrela,angle:360,duration:900,ease:'Back.Out'});return modal;
}
