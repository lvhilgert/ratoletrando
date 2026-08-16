import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';

/** Arqueiro terrestre: patrulha pouco, mira e dispara de uma distância segura. */
export class ArqueiroReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;
    get corpoColisao():Phaser.Physics.Arcade.Sprite {return this;}
    derrotado=false;
    private readonly origemX:number;
    private readonly visual:Phaser.GameObjects.Container;
    private readonly arco:Phaser.GameObjects.Container;
    private direcao=-1;
    private vida=2;
    private estado:'patrulha'|'mirando'='patrulha';
    private miraAte=0;
    private proximoDisparo=0;

    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite,private readonly aoAcertar:()=>void){
        if(!cena.textures.exists('hitbox-arqueiro-reino')){
            const hitbox=cena.make.graphics({x:0,y:0});hitbox.fillStyle(0xffffff).fillRect(0,0,32,60).generateTexture('hitbox-arqueiro-reino',32,60);hitbox.destroy();
        }
        super(cena,x,y,'hitbox-arqueiro-reino');cena.add.existing(this);cena.physics.add.existing(this);this.setVisible(false).setDepth(8);this.origemX=x;
        const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setSize(32,60).setMaxVelocity(75,650);
        const pernaE=cena.add.rectangle(-7,23,8,23,0x463326).setStrokeStyle(2,0x251b16),pernaD=cena.add.rectangle(7,23,8,23,0x463326).setStrokeStyle(2,0x251b16),tronco=cena.add.rectangle(0,2,27,37,0x8b5a32).setStrokeStyle(3,0x3c281c),cinto=cena.add.rectangle(0,10,29,5,0x39251b),cabeca=cena.add.circle(0,-22,14,0xd5a36f).setStrokeStyle(3,0x3c281c),capuz=cena.add.graphics().fillStyle(0x6b3f2a).fillTriangle(-15,-23,0,-42,15,-23).fillRoundedRect(-15,-30,30,13,6),olho=cena.add.circle(-6,-22,2,0x2a211d);
        const desenhoArco=cena.add.graphics();desenhoArco.lineStyle(4,0xc78b45).beginPath().arc(0,0,21,-Math.PI/2,Math.PI/2,false).strokePath().lineStyle(2,0xead8b5).lineBetween(0,-21,0,21);
        const flechaMira=cena.add.graphics().lineStyle(3,0x5a3821).lineBetween(-8,0,27,0).fillStyle(0xd7c3a0).fillTriangle(31,0,23,-5,23,5);
        this.arco=cena.add.container(-20,-2,[desenhoArco,flechaMira]);this.visual=cena.add.container(x,y,[pernaE,pernaD,tronco,cinto,cabeca,capuz,olho,this.arco]).setDepth(8);
    }

    atualizar():void {
        if(this.derrotado)return;const agora=this.scene.time.now,dx=this.alvo.x-this.x,mesmaAltura=Math.abs(this.alvo.y-this.y)<85,dentro=Math.abs(dx)<420;
        if(this.estado==='patrulha'&&dentro&&mesmaAltura&&agora>=this.proximoDisparo){this.estado='mirando';this.miraAte=agora+380;this.direcao=Math.sign(dx)||this.direcao;this.setVelocityX(0);this.scene.tweens.add({targets:this.arco,angle:-8,scale:1.12,duration:300,ease:'Sine.Out'});}
        else if(this.estado==='mirando'&&(!dentro||!mesmaAltura)){this.cancelarMira(agora+450);}
        else if(this.estado==='mirando'&&agora>=this.miraAte){this.disparar();this.cancelarMira(agora+1750);}
        if(this.estado==='patrulha'){
            if(this.x<this.origemX-55)this.direcao=1;else if(this.x>this.origemX+55)this.direcao=-1;
            this.setVelocityX(this.direcao*28);
        }
        this.visual.setPosition(this.x,this.y).setScale(this.direcao>0?-1:1,1);
    }

    atingir():boolean {if(this.derrotado)return false;if(--this.vida>0){this.visual.setAlpha(.35).setScale(this.visual.scaleX*1.08,.92);this.scene.time.delayedCall(120,()=>{if(this.visual.active)this.visual.setAlpha(1).setScale(this.direcao>0?-1:1,1);});return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody();this.scene.tweens.add({targets:this.visual,y:this.y+30,angle:80,alpha:0,scale:.55,duration:520,ease:'Back.In',onComplete:()=>{this.visual.destroy(true);this.destroy();}});}

    private cancelarMira(proximo:number):void {this.estado='patrulha';this.proximoDisparo=proximo;this.scene.tweens.add({targets:this.arco,angle:0,scale:1,duration:160});}
    private disparar():void {
        if(!this.scene.textures.exists('flecha-arqueiro-reino')){const g=this.scene.make.graphics({x:0,y:0});g.lineStyle(3,0x5a3821).lineBetween(2,6,35,6).fillStyle(0xd8c5a4).fillTriangle(40,6,31,1,31,11).fillStyle(0x8f3f2e).fillTriangle(2,6,9,1,9,11).generateTexture('flecha-arqueiro-reino',42,12);g.destroy();}
        const dx=this.alvo.x-this.x,dy=this.alvo.y-this.y,distancia=Math.max(1,Math.hypot(dx,dy)),velocidade=310,flecha=this.scene.physics.add.sprite(this.x+Math.sign(dx)*28,this.y-4,'flecha-arqueiro-reino').setDepth(9).setRotation(Math.atan2(dy,dx));
        const corpo=flecha.body as Phaser.Physics.Arcade.Body;corpo.setAllowGravity(false).setSize(38,8);flecha.setVelocity(dx/distancia*velocidade,dy/distancia*velocidade);
        const sobreposicao=this.scene.physics.add.overlap(flecha,this.alvo,()=>{if(!flecha.active)return;this.aoAcertar();sobreposicao.destroy();flecha.destroy();});
        this.scene.time.delayedCall(1500,()=>{sobreposicao.destroy();if(flecha.active)flecha.destroy();});
    }
}
