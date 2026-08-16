import * as Phaser from 'phaser';

export class DetetiveJogador extends Phaser.GameObjects.Sprite {
    private direcao='baixo';
    constructor(cena:Phaser.Scene,x:number,y:number){super(cena,x,y,'detetive-jogador',0);cena.add.existing(this);this.setScale(.25).setDepth(12);}
    mover(dx:number,dy:number):void {
        const velocidade=185;if(dx||dy){const n=new Phaser.Math.Vector2(dx,dy).normalize();this.x+=n.x*velocidade/60;this.y+=n.y*velocidade/60;
            if(Math.abs(dx)>Math.abs(dy)){this.direcao='lado';this.setFlipX(dx<0);this.anims.play('detetive-lado',true);}else if(dy<0){this.direcao='cima';this.setFlipX(false);this.anims.play('detetive-cima',true);}else{this.direcao='baixo';this.setFlipX(false);this.anims.play('detetive-baixo',true);}
        }else {this.anims.stop();this.setFrame(this.direcao==='baixo'?1:this.direcao==='cima'?4:7);}
        this.x=Phaser.Math.Clamp(this.x,42,918);this.y=Phaser.Math.Clamp(this.y,105,585);
    }
}
