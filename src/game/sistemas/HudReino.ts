import * as Phaser from 'phaser';
import { barraRaster, circuloRaster, painelRaster } from './ArteRaster';

export type HudReino={
    coracoes:Phaser.GameObjects.Image[];
    textoMoedas:Phaser.GameObjects.Text;
    textoRegiao:Phaser.GameObjects.Text;
    barraProgresso:Phaser.GameObjects.NineSlice;
    textoInimigos:Phaser.GameObjects.Text;
    barraPocao:Phaser.GameObjects.NineSlice;
    textoPocao:Phaser.GameObjects.Text;
    hudPocao:Phaser.GameObjects.Container;
    textoObjetivo:Phaser.GameObjects.Text;
};

export const criarHudReino=(cena:Phaser.Scene,moedas:number,botao:(x:number,y:number,w:number,h:number,texto:string,cor:number)=>void,acoes:{sair:()=>void;jornada:()=>void;pausar:()=>void}):HudReino=>{
    const hud=cena.add.container(0,0).setScrollFactor(0).setDepth(30);
    hud.add([painelRaster(cena,151,43,274,62,0xffffff,.35),painelRaster(cena,151,43,270,58,0x173d34,.76)]);
    const coracoes=[0,1,2,3].map(i=>cena.add.image(42+i*38,43,'reino-objetos',3).setDisplaySize(31,31));
    const textoMoedas=cena.add.text(244,43,`${moedas}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'22px',fontStyle:'bold',color:'#fff3b0'}).setOrigin(.5);
    hud.add([...coracoes,cena.add.image(208,43,'reino-objetos',2).setDisplaySize(32,32),textoMoedas]);
    const textoRegiao=cena.add.text(480,34,'BOSQUE DOS NÚMEROS',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'15px',fontStyle:'bold',color:'#ffffff',stroke:'#244d42',strokeThickness:4}).setOrigin(.5).setScrollFactor(0).setDepth(35);
    barraRaster(cena,480,59.5,300,9,0x173d34,.65).setScrollFactor(0).setDepth(35);const barraProgresso=barraRaster(cena,330,59.5,1,9,0xffffff).setOrigin(0,.5).setScrollFactor(0).setDepth(35);
    const textoInimigos=cena.add.text(480,79,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',fontStyle:'bold',color:'#fff4b8',stroke:'#244d42',strokeThickness:3}).setOrigin(.5).setScrollFactor(0).setDepth(35);
    const trilhoPocao=barraRaster(cena,88,30.5,176,7,0x173d34,.72),barraPocao=barraRaster(cena,0,30.5,1,7,0xffffff).setOrigin(0,.5),textoPocao=cena.add.text(43,10,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',fontStyle:'bold',color:'#ffffff'}),icone=cena.add.image(21,18,'reino-itens-magicos',1).setDisplaySize(30,33).setName('icone');
    const hudPocao=cena.add.container(330,91,[painelRaster(cena,110,19.5,224,43,0xffffff,.28),painelRaster(cena,110,19.5,220,39,0x173d34,.82),icone,textoPocao,trilhoPocao,barraPocao]).setScrollFactor(0).setDepth(35).setVisible(false);
    const textoObjetivo=cena.add.text(151,92,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',fontStyle:'bold',color:'#fff4c2',backgroundColor:'rgba(23,61,52,0.82)',padding:{x:12,y:7},fixedWidth:270,align:'center'}).setOrigin(.5,0).setScrollFactor(0).setDepth(35);
    [[884,42,118,42,'‹ EDUCAPP',0x376e61,acoes.sair],[748,42,112,42,'☰ JORNADA',0x557f9c,acoes.jornada],[665,42,42,42,'Ⅱ',0x9a7048,acoes.pausar]].forEach(([x,y,w,h,texto,cor,acao])=>{botao(x as number,y as number,w as number,h as number,texto as string,cor as number);cena.add.zone(x as number,y as number,w as number,h as number).setScrollFactor(0).setDepth(42).setInteractive({useHandCursor:true}).on('pointerdown',acao as ()=>void);});
    return {coracoes,textoMoedas,textoRegiao,barraProgresso,textoInimigos,barraPocao,textoPocao,hudPocao,textoObjetivo};
};

export const criarControlesTouchReino=(cena:Phaser.Scene,acoes:{esquerda:(ativa:boolean)=>void;direita:(ativa:boolean)=>void;dash:()=>void;defesa:(ativa:boolean)=>void;pular:()=>void;encerrarPulo:()=>void;atacar:(ativa:boolean)=>void}):void=>{
    if(!window.matchMedia('(pointer: coarse)').matches)return;
    const pressionavel=(x:number,y:number,rotulo:string,cor:number,down:()=>void,up?:()=>void)=>{const c=cena.add.container(x,y).setScrollFactor(0).setDepth(40).setSize(72,72).setInteractive({useHandCursor:true});c.add([circuloRaster(cena,0,4,68,0x173d34,.25),circuloRaster(cena,0,0,72,0xffffff,.65),circuloRaster(cena,0,0,66,cor,.72),cena.add.text(0,0,rotulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:rotulo==='DASH'?'13px':'25px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5)]);c.on('pointerdown',()=>{c.setScale(.92);down();});const soltar=()=>{c.setScale(1);up?.();};c.on('pointerup',soltar).on('pointerout',soltar);};
    pressionavel(72,555,'◀',0x3f8271,()=>acoes.esquerda(true),()=>acoes.esquerda(false));
    pressionavel(150,555,'▶',0x3f8271,()=>acoes.direita(true),()=>acoes.direita(false));
    pressionavel(640,555,'DASH',0x8667a7,acoes.dash);
    pressionavel(720,555,'◆',0x507fa4,()=>acoes.defesa(true),()=>acoes.defesa(false));
    pressionavel(805,555,'↑',0x4d82aa,acoes.pular,acoes.encerrarPulo);
    pressionavel(886,555,'⚔',0xb77b43,()=>acoes.atacar(true),()=>acoes.atacar(false));
};
