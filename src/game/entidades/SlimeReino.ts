import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';
import { configurarAtorTerrestre } from '../sistemas/TerrestreReino';
import { circuloRaster } from '../sistemas/ArteRaster';

export class SlimeReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;
    get corpoColisao():Phaser.Physics.Arcade.Sprite {return this;}
    direcao=-1;origemX:number;alcance:number;derrotado=false;private vida=1;private sombra:Phaser.GameObjects.Image;private sombraYChao:number;
    constructor(cena:Phaser.Scene,x:number,y:number,alcance=130){
        super(cena,x,y,'reino-slime',0);this.origemX=x;this.alcance=alcance;this.sombraYChao=y+42;this.sombra=circuloRaster(cena,x,this.sombraYChao,42,0x17382f,.2).setDisplaySize(42,11).setDepth(6);cena.add.existing(this);cena.physics.add.existing(this);
        this.setScale(.22).setDepth(7);configurarAtorTerrestre(this,{largura:230,altura:250,offsetX:85,velocidadeMaxima:[80,600]});
    }
    atualizar():void {if(this.derrotado)return;const corpo=this.body as Phaser.Physics.Arcade.Body;if(corpo.blocked.down)this.sombraYChao=this.y+42;const distancia=Math.max(0,this.sombraYChao-(this.y+42)),escala=Phaser.Math.Clamp(1-distancia/280,.58,1);this.sombra.setPosition(this.x,this.sombraYChao).setDisplaySize(42*escala,11*escala).setAlpha(.1+.1*escala);if((this.x<=this.origemX-this.alcance&&this.direcao<0)||(corpo.blocked.left&&this.direcao<0))this.direcao=1;else if((this.x>=this.origemX+this.alcance&&this.direcao>0)||(corpo.blocked.right&&this.direcao>0))this.direcao=-1;this.setVelocityX(this.direcao*48).setFlipX(this.direcao>0);this.anims.play('reino-slime-mover',true);}
    atingir():boolean {if(this.derrotado)return false;this.vida--;if(this.vida>0){this.setAlpha(.45);this.scene.time.delayedCall(100,()=>{if(this.active)this.setAlpha(1);});return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.sombra.destroy();this.setVelocity(0,0).disableBody();this.setFrame(4);this.scene.tweens.add({targets:this,alpha:0,scaleX:.38,scaleY:.06,y:this.y+18,duration:360,ease:'Back.In',onComplete:()=>this.destroy()});}
}
