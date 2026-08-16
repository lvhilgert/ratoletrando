import * as Phaser from 'phaser';
import { TipoInimigo } from '../dados/mundoReinoPortas';

export class SlimeReino extends Phaser.Physics.Arcade.Sprite {
    direcao=-1;origemX:number;alcance:number;derrotado=false;private vida:number;private proximoSalto=0;private sombra:Phaser.GameObjects.Ellipse;
    constructor(cena:Phaser.Scene,x:number,y:number,public readonly tipo:TipoInimigo='slime',alcance=130){
        super(cena,x,y,'reino-slime',0);this.origemX=x;this.alcance=tipo==='veloz'?190:alcance;this.vida=tipo==='guardiao'?2:1;this.sombra=cena.add.ellipse(x,y+42,42,11,0x17382f,.2).setDepth(6);cena.add.existing(this);cena.physics.add.existing(this);
        this.setScale(.22).setDepth(7);const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setSize(230,250).setOffset(65,300).setMaxVelocity(80,600);
        const cores:Record<TipoInimigo,number>={slime:0xffffff,saltador:0xf6c85f,guardiao:0x9b82ce,veloz:0xff8f70,gelo:0x8edcf2};this.setTint(cores[tipo]);if(tipo==='guardiao')this.setScale(.27);
    }
    atualizar():void {if(this.derrotado)return;this.sombra.setPosition(this.x,this.y+42);const corpo=this.body as Phaser.Physics.Arcade.Body;if((this.x<=this.origemX-this.alcance&&this.direcao<0)||(corpo.blocked.left&&this.direcao<0))this.direcao=1;else if((this.x>=this.origemX+this.alcance&&this.direcao>0)||(corpo.blocked.right&&this.direcao>0))this.direcao=-1;const velocidade=this.tipo==='veloz'?76:this.tipo==='gelo'?58:48;this.setVelocityX(this.direcao*velocidade).setFlipX(this.direcao>0);if(this.tipo==='saltador'&&corpo.blocked.down&&this.scene.time.now>this.proximoSalto){this.setVelocityY(-330);this.proximoSalto=this.scene.time.now+1800;}this.anims.play('reino-slime-mover',true);}
    atingir():boolean {if(this.derrotado)return false;this.vida--;if(this.vida>0){this.setAlpha(.45);this.scene.time.delayedCall(100,()=>{if(this.active)this.setAlpha(1);});return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.sombra.destroy();this.setVelocity(0,0).disableBody();this.setFrame(4);this.scene.tweens.add({targets:this,alpha:0,scaleX:.38,scaleY:.06,y:this.y+18,duration:360,ease:'Back.In',onComplete:()=>this.destroy()});}
}
