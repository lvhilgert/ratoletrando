import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';
import { assentarTerrestre } from '../sistemas/TerrestreReino';

/** Planta carnívora raster: abre a boca periodicamente, sempre plantada no piso. */
export class PlantaReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=false;get corpoColisao():Phaser.Physics.Arcade.Sprite{return this;}derrotado=false;
    private readonly visual:Phaser.GameObjects.Sprite;private aberta=false;private vida=2;private proximaTroca:number;
    constructor(cena:Phaser.Scene,x:number,piso:number){super(cena,x,piso-35,'reino-planta',0);cena.add.existing(this);cena.physics.add.existing(this);this.setVisible(false).setDepth(8);const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setAllowGravity(false).setImmovable(true).setSize(48,70);corpo.checkCollision.none=true;this.visual=assentarTerrestre(cena.add.sprite(x,piso,'reino-planta',0).setDisplaySize(68,88).setDepth(8),piso);this.proximaTroca=cena.time.now+1500;}
    atualizar():void {if(this.derrotado)return;assentarTerrestre(this.visual,(this.body as Phaser.Physics.Arcade.Body).bottom);if(this.scene.time.now>=this.proximaTroca){this.aberta=!this.aberta;if(this.aberta)this.visual.play('reino-planta-abrir',true);else this.visual.setFrame(0);(this.body as Phaser.Physics.Arcade.Body).checkCollision.none=!this.aberta;this.proximaTroca=this.scene.time.now+1500;}}
    atingir():boolean {if(this.derrotado||!this.aberta)return false;if(--this.vida>0){this.visual.setAlpha(.4);this.scene.time.delayedCall(130,()=>this.visual.active&&this.visual.setAlpha(1));return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody();this.scene.tweens.add({targets:this.visual,scaleY:.12,alpha:0,duration:420,onComplete:()=>{this.visual.destroy();this.destroy();}});}
}
