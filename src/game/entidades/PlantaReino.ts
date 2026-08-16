import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';

/** Planta carnívora estacionária: só fica vulnerável e perigosa quando abre a boca. */
export class PlantaReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=false;
    get corpoColisao():Phaser.Physics.Arcade.Sprite {return this;}
    derrotado=false;
    private readonly visual:Phaser.GameObjects.Container;
    private readonly petalaCima:Phaser.GameObjects.Container;
    private readonly petalaBaixo:Phaser.GameObjects.Container;
    private aberta=false;
    private vida=2;
    private proximaTroca:number;
    private transicionando=false;

    constructor(cena:Phaser.Scene,x:number,y:number){
        if(!cena.textures.exists('hitbox-planta-reino')){const hitbox=cena.make.graphics({x:0,y:0});hitbox.fillStyle(0xffffff).fillRect(0,0,48,70).generateTexture('hitbox-planta-reino',48,70);hitbox.destroy();}
        super(cena,x,y,'hitbox-planta-reino');cena.add.existing(this);cena.physics.add.existing(this);this.setVisible(false).setDepth(8);
        const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setAllowGravity(false).setImmovable(true).setSize(48,70);corpo.checkCollision.none=true;
        const caule=cena.add.rectangle(0,20,11,48,0x397d45).setStrokeStyle(3,0x1f4b2b),folhaE=cena.add.ellipse(-16,28,31,13,0x54a852).setAngle(25).setStrokeStyle(2,0x245b31),folhaD=cena.add.ellipse(16,34,31,13,0x54a852).setAngle(-25).setStrokeStyle(2,0x245b31);
        const cima=cena.add.ellipse(0,-7,50,26,0x7d3b85).setStrokeStyle(3,0x3b2048),denteCima=cena.add.triangle(0,4,0,0,7,0,3,8,0xf1e2bf),baixo=cena.add.ellipse(0,7,50,26,0x94509c).setStrokeStyle(3,0x3b2048),denteBaixo=cena.add.triangle(0,-4,0,8,7,8,3,0,0xf1e2bf);
        this.petalaCima=cena.add.container(0,-17,[cima,denteCima]).setScale(1,.25);this.petalaBaixo=cena.add.container(0,-3,[baixo,denteBaixo]).setScale(1,.25);
        this.visual=cena.add.container(x,y,[folhaE,folhaD,caule,this.petalaCima,this.petalaBaixo]).setDepth(8);this.proximaTroca=cena.time.now+1500;
    }

    atualizar():void {if(this.derrotado)return;this.visual.setPosition(this.x,this.y);if(!this.transicionando&&this.scene.time.now>=this.proximaTroca)this.alternarEstado();}
    atingir():boolean {if(this.derrotado||!this.aberta||this.transicionando)return false;if(--this.vida>0){this.visual.setAlpha(.4);this.scene.time.delayedCall(130,()=>{if(this.visual.active)this.visual.setAlpha(1);});return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody();this.scene.tweens.killTweensOf([this.petalaCima,this.petalaBaixo]);this.scene.tweens.add({targets:this.visual,scaleY:.12,scaleX:.72,y:this.y+36,angle:12,alpha:0,duration:700,ease:'Quad.In',onComplete:()=>{this.visual.destroy(true);this.destroy();}});}

    private alternarEstado():void {
        this.transicionando=true;const vaiAbrir=!this.aberta;
        this.scene.tweens.add({targets:this.petalaCima,y:vaiAbrir?-31:-17,scaleY:vaiAbrir?1:.25,angle:vaiAbrir?-12:0,duration:260,ease:'Back.Out'});
        this.scene.tweens.add({targets:this.petalaBaixo,y:vaiAbrir?10:-3,scaleY:vaiAbrir?1:.25,angle:vaiAbrir?12:0,duration:260,ease:'Back.Out',onComplete:()=>{if(this.derrotado)return;this.aberta=vaiAbrir;this.transicionando=false;(this.body as Phaser.Physics.Arcade.Body).checkCollision.none=!this.aberta;this.proximaTroca=this.scene.time.now+1500;}});
    }
}
