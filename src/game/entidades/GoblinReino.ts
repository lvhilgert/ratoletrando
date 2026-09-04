import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';
import { assentarTerrestre } from '../sistemas/TerrestreReino';

/** Arqueiro élfico: patrulha, prepara o arco e dispara flechas reais. */
export class GoblinReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;get corpoColisao():Phaser.Physics.Arcade.Sprite{return this;}derrotado=false;
    private readonly origemX:number;private readonly visual:Phaser.GameObjects.Sprite;private direcao=-1;private vida=2;private mirandoAte=0;private proximoDisparo=0;
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite,private readonly aoAcertar:()=>void,private readonly alcance=105){
        if(!cena.textures.exists('hitbox-goblin-reino')){const g=cena.make.graphics({x:0,y:0});g.fillStyle(0xffffff).fillRect(0,0,34,62).generateTexture('hitbox-goblin-reino',34,62);g.destroy();}
        super(cena,x,y,'hitbox-goblin-reino');cena.add.existing(this);cena.physics.add.existing(this);this.setVisible(false).setDepth(8);this.origemX=x;(this.body as Phaser.Physics.Arcade.Body).setSize(34,62).setMaxVelocity(95,650);
        this.visual=assentarTerrestre(cena.add.sprite(x,y,'reino-arqueiro-sprites',0).setDisplaySize(78,118).setOrigin(.5,1).setDepth(8),(this.body as Phaser.Physics.Arcade.Body).bottom);
    }
    atualizar():void {if(this.derrotado)return;const agora=this.scene.time.now,dx=this.alvo.x-this.x,perto=Math.abs(dx)<440&&Math.abs(this.alvo.y-this.y)<105,corpo=this.body as Phaser.Physics.Arcade.Body;
        if(perto&&agora>=this.proximoDisparo&&!this.mirandoAte){this.mirandoAte=agora+520;this.direcao=Math.sign(dx)||this.direcao;this.setVelocityX(0);this.visual.setFrame(2);}
        else if(this.mirandoAte&&agora>=this.mirandoAte){this.mirandoAte=0;this.proximoDisparo=agora+1700;this.visual.setFrame(3);this.disparar();}
        else if(!this.mirandoAte){if(this.x<this.origemX-this.alcance||corpo.blocked.left)this.direcao=1;else if(this.x>this.origemX+this.alcance||corpo.blocked.right)this.direcao=-1;this.setVelocityX(this.direcao*34);this.visual.setFrame(Math.floor(agora/260)%2);}
        assentarTerrestre(this.visual,corpo.bottom).setX(this.x).setFlipX(this.direcao<0);
    }
    atingir():boolean {if(this.derrotado)return false;if(--this.vida>0){this.visual.setAlpha(.35);this.scene.time.delayedCall(120,()=>this.visual.active&&this.visual.setAlpha(1));return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody();this.scene.tweens.add({targets:this.visual,angle:-90,y:this.visual.y+35,alpha:0,duration:480,onComplete:()=>{this.visual.destroy();this.destroy();}});}
    private disparar():void {const dx=this.alvo.x-this.x,dy=this.alvo.y-this.y,dist=Math.max(1,Math.hypot(dx,dy)),flecha=this.scene.physics.add.image(this.x+Math.sign(dx)*38,this.y-28,'reino-flecha-arqueiro').setDisplaySize(62,20).setDepth(9).setFlipX(dx<0),body=flecha.body as Phaser.Physics.Arcade.Body;body.setAllowGravity(false).setSize(48,10);flecha.setVelocity(dx/dist*330,dy/dist*330);let fim=false;let contato!:Phaser.Physics.Arcade.Collider;const destruir=(acertou=false)=>{if(fim)return;fim=true;if(acertou)this.aoAcertar();contato?.destroy();flecha.destroy();};contato=this.scene.physics.add.overlap(flecha,this.alvo,()=>destruir(true));this.scene.time.delayedCall(1800,()=>destruir());}
}
