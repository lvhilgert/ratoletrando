import * as Phaser from 'phaser';
import { circuloRaster } from './ArteRaster';

export const criarColetavelReino=(cena:Phaser.Scene,x:number,y:number,textura:string,frame:number,tamanho:[number,number],cor:number,corpo:{largura:number;altura:number;x:number;y:number}):{sprite:Phaser.Physics.Arcade.Sprite;brilho:Phaser.GameObjects.Image}=>{
    const sprite=cena.physics.add.sprite(x,y,textura,frame).setDisplaySize(...tamanho).setDepth(6),body=sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false).setSize(corpo.largura,corpo.altura).setOffset(corpo.x,corpo.y);
    const brilho=circuloRaster(cena,x,y,Math.max(...tamanho)+4,cor,.14).setDepth(5);
    cena.tweens.add({targets:[sprite,brilho],y:y-4,angle:3,yoyo:true,repeat:-1,duration:1150+Phaser.Math.Between(0,260),ease:'Sine.InOut'});
    cena.tweens.add({targets:brilho,scale:1.22,alpha:.03,yoyo:true,repeat:-1,duration:1000});
    return {sprite,brilho};
};
