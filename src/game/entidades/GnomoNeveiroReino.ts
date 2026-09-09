import * as Phaser from 'phaser';
import { configurarAtorTerrestre } from '../sistemas/TerrestreReino';
import type { InimigoReino } from './InimigoReino';

export class GnomoNeveiroReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;get corpoColisao(){return this;}derrotado=false;
    private vida=2;private estado:'espera'|'mira'|'recupera'='espera';private estadoAte=0;private vistoEm=0;
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite,private readonly plataformas:Phaser.Physics.Arcade.StaticGroup,private readonly aoDano:()=>void){super(cena,x,y,'reino-gnomo-neve',0);cena.add.existing(this);cena.physics.add.existing(this);this.setDisplaySize(76,96).setDepth(9);configurarAtorTerrestre(this,{largura:112,altura:150,offsetX:24,velocidadeMaxima:[120,650]});}
    atualizar():void {if(this.derrotado)return;const agora=this.scene.time.now,visivel=this.scene.cameras.main.worldView.contains(this.x,this.y);if(!visivel){this.vistoEm=0;return;}if(!this.vistoEm)this.vistoEm=agora;const dx=this.alvo.x-this.x;this.setFlipX(dx<0);if(this.estado==='espera'&&agora-this.vistoEm>300&&Math.abs(dx)<520){this.estado='mira';this.estadoAte=agora+600;this.setFrame(2);}else if(this.estado==='mira'&&agora>=this.estadoAte){this.lancar();this.estado='recupera';this.estadoAte=agora+900;this.setFrame(4);}else if(this.estado==='recupera'&&agora>=this.estadoAte){this.estado='espera';this.setFrame(Math.floor(agora/500)%2);}}
    atingir():boolean {if(this.derrotado)return false;if(--this.vida>0){this.setTint(0xffe29b);this.scene.time.delayedCall(120,()=>this.active&&this.clearTint());return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody().setFrame(5);this.scene.tweens.add({targets:this,y:this.y+25,alpha:0,duration:560,onComplete:()=>this.destroy()});}
    private lancar():void {if(this.derrotado)return;this.setFrame(3);const direcao=Math.sign(this.alvo.x-this.x)||1,bola=this.scene.physics.add.image(this.x+direcao*42,this.y-45,'reino-objetos-neve',1).setDisplaySize(28,28).setDepth(10).setVelocity(direcao*185,-245).setBounce(.32);(bola.body as Phaser.Physics.Arcade.Body).setSize(24,24);let contatos=0;this.scene.physics.add.collider(bola,this.plataformas,()=>{if(++contatos>1)bola.destroy();});this.scene.physics.add.overlap(bola,this.alvo,()=>{if(!bola.active)return;bola.destroy();this.aoDano();});this.scene.time.delayedCall(2600,()=>bola.active&&bola.destroy());}
}
