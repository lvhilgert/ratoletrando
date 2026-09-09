import * as Phaser from 'phaser';
import { configurarAtorTerrestre } from '../sistemas/TerrestreReino';
import type { InimigoReino } from './InimigoReino';

export class GuardiaoMamuteReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;readonly guardiao=true;readonly resisteMartelo=true;get corpoColisao(){return this;}derrotado=false;
    private vida=8;private estado:'espera'|'prepara'|'investe'|'recupera'='espera';private estadoAte=0;private vistoEm=0;private direcao=-1;
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite){super(cena,x,y,'reino-mamute',0);cena.add.existing(this);cena.physics.add.existing(this);this.setDisplaySize(178,148).setDepth(9);configurarAtorTerrestre(this,{largura:190,altura:150,offsetX:33,velocidadeMaxima:[330,650]});}
    atualizar():void {if(this.derrotado)return;const agora=this.scene.time.now,visivel=this.scene.cameras.main.worldView.contains(this.x,this.y);if(!visivel){this.vistoEm=0;this.setVelocityX(0);return;}if(!this.vistoEm)this.vistoEm=agora;const corpo=this.body as Phaser.Physics.Arcade.Body,dx=this.alvo.x-this.x;
        if(this.estado==='espera'&&agora-this.vistoEm>300&&Math.abs(dx)<560){this.estado='prepara';this.estadoAte=agora+700;this.direcao=Math.sign(dx)||this.direcao;this.setVelocityX(0).setFrame(2);}
        else if(this.estado==='prepara'&&agora>=this.estadoAte){this.estado='investe';this.estadoAte=agora+900;this.setVelocityX(this.direcao*285).setFrame(3);}
        else if(this.estado==='investe'&&(agora>=this.estadoAte||corpo.blocked.left||corpo.blocked.right)){this.estado='recupera';this.estadoAte=agora+1100;this.setVelocityX(0).setFrame(4);}
        else if(this.estado==='recupera'&&agora>=this.estadoAte){this.estado='espera';this.setFrame(0);}this.setFlipX(this.direcao<0);
    }
    atingir():boolean {if(this.derrotado)return false;const dano=this.estado==='recupera'?2:1;this.vida-=dano;if(this.vida>0){this.setTint(0xffdf9e);this.scene.time.delayedCall(140,()=>this.active&&this.clearTint());return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody().setFrame(5);this.scene.tweens.add({targets:this,y:this.y+35,alpha:0,duration:850,onComplete:()=>this.destroy()});}
}
