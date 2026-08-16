import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';
export class FuracaoFolhasReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=false;get corpoColisao():Phaser.Physics.Arcade.Sprite{return this;}derrotado=false;private direcao=-1;private readonly origemX:number;
    constructor(cena:Phaser.Scene,x:number,y:number){super(cena,x,y,'reino-furacao',0);cena.add.existing(this);cena.physics.add.existing(this);this.origemX=x;this.setScale(.17).setDepth(8);const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setAllowGravity(false).setSize(300,380).setOffset(190,200);}
    atualizar():void {if(this.derrotado)return;if(this.x<this.origemX-190)this.direcao=1;else if(this.x>this.origemX+190)this.direcao=-1;this.setFrame(1).setVelocityX(this.direcao*210).setFlipX(this.direcao>0);}
    atingir():boolean {if(this.derrotado)return false;this.derrotar();return true;}derrotar():void {if(this.derrotado)return;this.derrotado=true;this.setVelocity(0,0).disableBody().setFrame(2);this.scene.tweens.add({targets:this,alpha:0,angle:360,scale:.05,duration:600,onComplete:()=>this.destroy()});}
}
