import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';
export class CogumeloSaltadorReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;get corpoColisao():Phaser.Physics.Arcade.Sprite{return this;}derrotado=false;private proximoPulo=0;private estado:'repouso'|'carga'|'salto'='repouso';
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite){super(cena,x,y,'reino-cogumelo',0);cena.add.existing(this);cena.physics.add.existing(this);this.setScale(.18).setDepth(8);(this.body as Phaser.Physics.Arcade.Body).setSize(300,300).setOffset(110,405).setMaxVelocity(80,700);}
    atualizar():void {if(this.derrotado)return;const corpo=this.body as Phaser.Physics.Arcade.Body;if(this.estado==='repouso'&&corpo.blocked.down&&Math.abs(this.alvo.x-this.x)<230&&this.scene.time.now>=this.proximoPulo){this.estado='carga';this.setFrame(1);this.scene.time.delayedCall(320,()=>{if(!this.active||this.derrotado)return;this.estado='salto';this.setFrame(2).setVelocityY(-570);});}else if(this.estado==='salto'&&corpo.blocked.down){this.setFrame(3);this.estado='repouso';this.proximoPulo=this.scene.time.now+1300;this.scene.time.delayedCall(220,()=>{if(this.active&&!this.derrotado)this.setFrame(0);});}}
    atingir():boolean {if(this.derrotado)return false;this.derrotar();return true;}derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody();this.scene.tweens.add({targets:this,alpha:0,scaleY:.04,duration:360,onComplete:()=>this.destroy()});}
}
