import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';

/** Morcego aéreo: patrulha em ondas e alterna mergulhos contra o cavaleiro. */
export class MorcegoReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=false;
    get corpoColisao():Phaser.Physics.Arcade.Sprite {return this;}
    derrotado=false;
    private readonly origemX:number;
    private readonly origemY:number;
    private readonly visual:Phaser.GameObjects.Container;
    private readonly asaEsquerda:Phaser.GameObjects.Ellipse;
    private readonly asaDireita:Phaser.GameObjects.Ellipse;
    private readonly inicio:number;
    private vida=1;
    private estado:'patrulha'|'mergulho'|'retorno'='patrulha';
    private proximaInvestida=0;
    private mergulhoAte=0;

    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite){
        if(!cena.textures.exists('hitbox-morcego-reino')){
            const textura=cena.make.graphics({x:0,y:0});
            textura.fillStyle(0xffffff,1).fillRect(0,0,38,26).generateTexture('hitbox-morcego-reino',38,26);textura.destroy();
        }
        super(cena,x,y,'hitbox-morcego-reino');cena.add.existing(this);cena.physics.add.existing(this);
        this.setVisible(false).setDepth(8);const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setAllowGravity(false).setSize(38,26).setMaxVelocity(310,310);
        this.origemX=x;this.origemY=y;this.inicio=cena.time.now+Phaser.Math.Between(0,900);
        this.asaEsquerda=cena.add.ellipse(-22,0,34,17,0x342b4f).setAngle(-18).setStrokeStyle(2,0x181426);
        this.asaDireita=cena.add.ellipse(22,0,34,17,0x342b4f).setAngle(18).setStrokeStyle(2,0x181426);
        const corpoVisual=cena.add.ellipse(0,2,25,29,0x55466f).setStrokeStyle(2,0x181426),orelhaE=cena.add.triangle(-7,-13,0,8,6,0,11,10,0x79618d),orelhaD=cena.add.triangle(7,-13,0,10,5,0,11,8,0x79618d),olhoE=cena.add.circle(-5,-3,2,0xffd45d),olhoD=cena.add.circle(5,-3,2,0xffd45d);
        this.visual=cena.add.container(x,y,[this.asaEsquerda,this.asaDireita,corpoVisual,orelhaE,orelhaD,olhoE,olhoD]).setDepth(8);
        cena.tweens.add({targets:[this.asaEsquerda,this.asaDireita],scaleY:.22,yoyo:true,repeat:-1,duration:115,ease:'Sine.InOut'});
    }

    atualizar():void {
        if(this.derrotado)return;const agora=this.scene.time.now,dx=this.alvo.x-this.x,dy=this.alvo.y-this.y,distancia=Math.hypot(dx,dy);
        if(this.estado==='patrulha'&&distancia<260&&agora>=this.proximaInvestida){this.estado='mergulho';this.mergulhoAte=agora+1150;this.setVelocity(dx/distancia*245,Math.max(145,dy/distancia*245));}
        else if(this.estado==='mergulho'&&(this.y>this.alvo.y+42||agora>=this.mergulhoAte)){this.estado='retorno';}
        if(this.estado==='patrulha'){
            const t=(agora-this.inicio)/1000,alvoX=this.origemX+Math.sin(t*1.25)*105,alvoY=this.origemY+Math.sin(t*2.1)*32;
            this.setVelocity((alvoX-this.x)*2.1,(alvoY-this.y)*2.1);
        }else if(this.estado==='retorno'){
            const rx=this.origemX-this.x,ry=this.origemY-this.y;this.setVelocity(rx*2.4,ry*2.4);
            if(Math.hypot(rx,ry)<24){this.estado='patrulha';this.proximaInvestida=agora+1300;}
        }
        this.visual.setPosition(this.x,this.y).setRotation(Phaser.Math.Clamp((this.body as Phaser.Physics.Arcade.Body).velocity.x/700,-.28,.28));
        this.visual.setScale((this.body as Phaser.Physics.Arcade.Body).velocity.x<0?1:-1,1);
    }

    atingir():boolean {if(this.derrotado)return false;if(--this.vida>0)return false;this.derrotar();return true;}
    derrotar():void {
        if(this.derrotado)return;this.derrotado=true;this.disableBody();this.scene.tweens.killTweensOf([this.asaEsquerda,this.asaDireita]);
        this.scene.tweens.add({targets:this.visual,y:this.y+170,angle:420,alpha:0,scale:.35,duration:650,ease:'Quad.In',onComplete:()=>{this.visual.destroy(true);this.destroy();}});
    }
}
