import * as Phaser from 'phaser';
import { audioJogo } from '../sistemas/SistemaAudio';

export class Menu extends Phaser.Scene {
    constructor() { super('Menu'); }
    create(): void {
        this.add.image(480,320,'menu-jardim').setDisplaySize(960,640);
        this.add.rectangle(480,320,960,640,0x174f55,.05);
        for(let i=0;i<16;i++){const luz=this.add.circle(Phaser.Math.Between(35,925),Phaser.Math.Between(190,590),Phaser.Math.Between(2,4),i%2?0xffef72:0xffffff,.35);this.tweens.add({targets:luz,y:luz.y-Phaser.Math.Between(25,70),x:luz.x+Phaser.Math.Between(-25,25),alpha:{from:.15,to:.8},scale:{from:.6,to:1.3},yoyo:true,repeat:-1,duration:Phaser.Math.Between(1800,3600),delay:i*90,ease:'Sine.InOut'});}
        const titulo=this.add.container(480,88);
        const cores=['#ff3045','#48c94f','#20a9f5','#9a55e8','#ff9e1b','#ef4ec5','#18b9ae'];
        [...'RATOLETRANDO'].forEach((letra,i)=>titulo.add(this.add.text((i-5.5)*48,0,letra,{
            fontFamily:'Arial Rounded MT Bold, Arial Black, Arial',fontSize:'61px',fontStyle:'bold',
            color:cores[i%cores.length],stroke:'#fff8bd',strokeThickness:7,
            shadow:{offsetX:3,offsetY:7,color:'#3d2464',blur:1,fill:true}
        }).setOrigin(.5)));
        this.add.text(480,151,'A AVENTURA DAS PALAVRAS',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'20px',color:'#fff',stroke:'#2f765e',strokeThickness:6}).setOrigin(.5);
        const sombra=this.add.ellipse(480,492,250,30,0x244c34,.3);
        const botao=this.add.ellipse(480,455,250,82,0xff6a4f).setStrokeStyle(7,0xfff2a8).setInteractive({useHandCursor:true});
        const texto=this.add.text(480,455,'JOGAR  ›',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'34px',color:'#fff',stroke:'#b83b35',strokeThickness:4}).setOrigin(.5);
        const jogar=()=>{audioJogo.iniciarMusica();audioJogo.efeito('letra');this.scene.start('Jogo',{fase:0});};
        botao.on('pointerover',()=>this.tweens.add({targets:[botao,texto],scale:1.07,duration:120}));
        botao.on('pointerout',()=>this.tweens.add({targets:[botao,texto],scale:1,duration:120}));botao.on('pointerdown',jogar);this.input.keyboard?.once('keydown-ENTER',jogar);
        const dica=this.add.container(480,568);dica.add([this.add.ellipse(0,0,330,46,0x245f50,.86),this.add.text(0,0,'SETAS  ou  WASD  •  MOVIMENTAR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',color:'#fff'}).setOrigin(.5)]);
        this.tweens.add({targets:[botao,texto,sombra],scaleX:1.035,scaleY:.97,yoyo:true,repeat:-1,duration:850,ease:'Sine.InOut'});
        this.tweens.add({targets:titulo,y:94,yoyo:true,repeat:-1,duration:1800,ease:'Sine.InOut'});
    }
}
