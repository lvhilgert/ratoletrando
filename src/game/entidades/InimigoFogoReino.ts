import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';
import { configurarAtorTerrestre } from '../sistemas/TerrestreReino';

export class InimigoFogoReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;get corpoColisao():Phaser.Physics.Arcade.Sprite{return this;}derrotado=false;
    private readonly origemX:number;private direcao=-1;private vida:number;
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly tipo:'golem-lava'|'diabrete-fogo'){
        super(cena,x,y,'reino-inimigos-fogo',tipo==='golem-lava'?0:4);cena.add.existing(this);cena.physics.add.existing(this);this.origemX=x;this.vida=tipo==='golem-lava'?3:2;this.setDisplaySize(tipo==='golem-lava'?108:78,tipo==='golem-lava'?126:92).setDepth(8);configurarAtorTerrestre(this,{largura:tipo==='golem-lava'?220:180,altura:tipo==='golem-lava'?330:285,offsetX:tipo==='golem-lava'?82:100,velocidadeMaxima:[100,650]});
    }
    atualizar():void {if(this.derrotado)return;const corpo=this.body as Phaser.Physics.Arcade.Body;if(this.x<this.origemX-105||corpo.blocked.left)this.direcao=1;else if(this.x>this.origemX+105||corpo.blocked.right)this.direcao=-1;this.setVelocityX(this.direcao*(this.tipo==='golem-lava'?28:52)).setFlipX(this.direcao<0).setFrame((this.tipo==='golem-lava'?0:4)+Math.floor(this.scene.time.now/220)%4);}
    atingir():boolean {if(this.derrotado)return false;if(--this.vida>0){this.setTint(0xffffff);this.scene.time.delayedCall(100,()=>this.active&&this.clearTint());return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody();this.scene.tweens.add({targets:this,alpha:0,scale:.25,y:this.y+30,duration:480,onComplete:()=>this.destroy()});}
}
