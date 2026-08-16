import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';

/** Goblin terrestre humanoide: prepara a arma, avança e então recua. */
export class GoblinReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;
    get corpoColisao():Phaser.Physics.Arcade.Sprite {return this;}
    derrotado=false;
    private readonly origemX:number;
    private readonly visual:Phaser.GameObjects.Container;
    private readonly arma:Phaser.GameObjects.Container;
    private direcao=-1;
    private vida=2;
    private estado:'patrulha'|'preparo'|'avanco'|'recuo'='patrulha';
    private estadoAte=0;
    private proximoAtaque=0;

    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite,private readonly alcance=125){
        if(!cena.textures.exists('hitbox-goblin-reino')){
            const textura=cena.make.graphics({x:0,y:0});
            textura.fillStyle(0xffffff,1).fillRect(0,0,34,58).generateTexture('hitbox-goblin-reino',34,58);textura.destroy();
        }
        super(cena,x,y,'hitbox-goblin-reino');cena.add.existing(this);cena.physics.add.existing(this);this.setVisible(false).setDepth(8);this.origemX=x;
        const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setSize(34,58).setOffset(0,0).setMaxVelocity(270,650);
        const pernaE=cena.add.rectangle(-8,23,8,22,0x3c4a43).setStrokeStyle(2,0x202923),pernaD=cena.add.rectangle(8,23,8,22,0x3c4a43).setStrokeStyle(2,0x202923),tronco=cena.add.rectangle(0,3,27,35,0x65756a).setStrokeStyle(3,0x29382f),cabeca=cena.add.ellipse(0,-22,31,27,0x839a78).setStrokeStyle(3,0x29382f),orelha=cena.add.triangle(-18,-23,0,7,15,0,15,14,0x839a78).setStrokeStyle(2,0x29382f),olho=cena.add.circle(-6,-24,2,0xf6c85f),cinto=cena.add.rectangle(0,10,29,5,0x563d2a);
        this.arma=cena.add.container(17,-2,[cena.add.rectangle(0,6,5,31,0x6b4429),cena.add.triangle(0,-12,0,14,6,0,12,14,0xc4c9bd).setStrokeStyle(2,0x4b514c)]).setAngle(20);
        this.visual=cena.add.container(x,y,[pernaE,pernaD,tronco,cabeca,orelha,olho,cinto,this.arma]).setDepth(8);
    }

    atualizar():void {
        if(this.derrotado)return;const agora=this.scene.time.now,corpo=this.body as Phaser.Physics.Arcade.Body,dx=this.alvo.x-this.x,mesmaAltura=Math.abs(this.alvo.y-this.y)<72;
        if(this.estado==='patrulha'&&Math.abs(dx)<180&&mesmaAltura&&agora>=this.proximoAtaque){this.estado='preparo';this.estadoAte=agora+330;this.direcao=Math.sign(dx)||1;this.setVelocityX(0);this.scene.tweens.add({targets:this.arma,angle:-55,duration:230,ease:'Back.Out'});}
        else if(this.estado==='preparo'&&agora>=this.estadoAte){this.estado='avanco';this.estadoAte=agora+260;this.setVelocityX(this.direcao*255);this.scene.tweens.add({targets:this.arma,angle:70,duration:100});}
        else if(this.estado==='avanco'&&agora>=this.estadoAte){this.estado='recuo';this.estadoAte=agora+360;this.setVelocityX(-this.direcao*105);}
        else if(this.estado==='recuo'&&agora>=this.estadoAte){this.estado='patrulha';this.proximoAtaque=agora+1250;this.scene.tweens.add({targets:this.arma,angle:20,duration:180});}
        if(this.estado==='patrulha'){
            if((this.x<this.origemX-this.alcance&&this.direcao<0)||(corpo.blocked.left&&this.direcao<0))this.direcao=1;
            else if((this.x>this.origemX+this.alcance&&this.direcao>0)||(corpo.blocked.right&&this.direcao>0))this.direcao=-1;
            this.setVelocityX(this.direcao*55);
        }
        this.visual.setPosition(this.x,this.y).setScale(this.direcao>0?-1:1,1);
    }

    atingir():boolean {if(this.derrotado)return false;this.vida--;if(this.vida>0){this.visual.setAlpha(.35);this.scene.time.delayedCall(110,()=>{if(this.visual.active)this.visual.setAlpha(1);});return false;}this.derrotar();return true;}
    derrotar():void {
        if(this.derrotado)return;this.derrotado=true;this.disableBody();this.scene.tweens.add({targets:this.visual,angle:-105,y:this.y+28,alpha:0,duration:520,ease:'Back.In',onComplete:()=>{this.visual.destroy(true);this.destroy();}});
    }
}
