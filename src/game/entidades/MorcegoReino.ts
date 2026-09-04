import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';

/** Morcego aéreo: patrulha em ondas e alterna mergulhos contra o cavaleiro. */
export class MorcegoReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=false;
    get corpoColisao():Phaser.Physics.Arcade.Sprite {return this;}
    derrotado=false;
    private readonly origemX:number;
    private readonly origemY:number;
    private readonly inicio:number;
    private vida=1;
    private estado:'patrulha'|'mergulho'|'retorno'='patrulha';
    private proximaInvestida=0;
    private mergulhoAte=0;

    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite){
        super(cena,x,y,'reino-morcego',0);cena.add.existing(this);cena.physics.add.existing(this);
        this.setScale(.22).setDepth(8);const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setAllowGravity(false).setSize(210,180).setOffset(76,300).setMaxVelocity(310,310);
        this.origemX=x;this.origemY=y;this.inicio=cena.time.now+Phaser.Math.Between(0,900);this.setFrame(0);
    }

    atualizar():void {
        if(this.derrotado)return;const agora=this.scene.time.now,dx=this.alvo.x-this.x,dy=this.alvo.y-this.y,distancia=Math.hypot(dx,dy);
        if(this.estado==='patrulha'&&distancia<260&&agora>=this.proximaInvestida){this.estado='mergulho';this.mergulhoAte=agora+1150;this.stop().setFrame(3);this.setVelocity(dx/distancia*245,Math.max(145,dy/distancia*245));}
        else if(this.estado==='mergulho'&&(this.y>this.alvo.y+42||agora>=this.mergulhoAte)){this.estado='retorno';}
        if(this.estado==='patrulha'){
            const t=(agora-this.inicio)/1000,alvoX=this.origemX+Math.sin(t*1.25)*105,alvoY=this.origemY+Math.sin(t*2.1)*32;this.setVelocity((alvoX-this.x)*2.1,(alvoY-this.y)*2.1);
        }else if(this.estado==='retorno'){
            const rx=this.origemX-this.x,ry=this.origemY-this.y;this.setVelocity(rx*2.4,ry*2.4);if(Math.hypot(rx,ry)<24){this.estado='patrulha';this.proximaInvestida=agora+1300;}
        }
        if(this.estado!=='mergulho')this.setFrame(Math.floor(agora/110)%3);this.setRotation(Phaser.Math.Clamp((this.body as Phaser.Physics.Arcade.Body).velocity.x/700,-.28,.28)).setFlipX((this.body as Phaser.Physics.Arcade.Body).velocity.x>0);
    }

    atingir():boolean {if(this.derrotado)return false;if(--this.vida>0)return false;this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.setVelocity(0,0).disableBody().stop().setFrame(5);this.scene.tweens.add({targets:this,y:this.y+170,angle:420,alpha:0,scale:.08,duration:650,ease:'Quad.In',onComplete:()=>this.destroy()});}
}
