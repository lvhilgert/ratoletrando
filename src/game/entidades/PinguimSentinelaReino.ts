import * as Phaser from 'phaser';
import { configurarAtorTerrestre } from '../sistemas/TerrestreReino';
import type { InimigoReino } from './InimigoReino';

export class PinguimSentinelaReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;readonly resisteMartelo=true;get corpoColisao(){return this;}derrotado=false;
    private estado:'patrulha'|'prepara'|'desliza'|'tonto'='patrulha';private estadoAte=0;private direcao=1;private vistoEm=0;
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite){super(cena,x,y,'reino-pinguim',0);cena.add.existing(this);cena.physics.add.existing(this);this.setDisplaySize(72,76).setDepth(9);configurarAtorTerrestre(this,{largura:116,altura:126,offsetX:22,velocidadeMaxima:[300,650]});}
    atualizar():void {if(this.derrotado)return;const agora=this.scene.time.now,visivel=this.scene.cameras.main.worldView.contains(this.x,this.y);if(!visivel){this.vistoEm=0;if(this.estado==='patrulha')this.setVelocityX(0);return;}if(!this.vistoEm)this.vistoEm=agora;const corpo=this.body as Phaser.Physics.Arcade.Body,dx=this.alvo.x-this.x;
        if(this.estado==='patrulha'){if(agora-this.vistoEm>300&&Math.abs(dx)<320){this.estado='prepara';this.estadoAte=agora+500;this.setVelocityX(0).setFrame(3);}else {if(corpo.blocked.left||corpo.blocked.right)this.direcao*=-1;this.setVelocityX(this.direcao*55).setFrame(Math.floor(agora/140)%3);}}
        else if(this.estado==='prepara'&&agora>=this.estadoAte){this.estado='desliza';this.direcao=Math.sign(dx)||this.direcao;this.estadoAte=agora+780;this.setVelocityX(this.direcao*245).setFrame(4);}
        else if(this.estado==='desliza'&&(agora>=this.estadoAte||corpo.blocked.left||corpo.blocked.right)){this.estado='tonto';this.estadoAte=agora+900;this.setVelocityX(0).setFrame(5);}
        else if(this.estado==='tonto'&&agora>=this.estadoAte){this.estado='patrulha';this.setFrame(0);}this.setFlipX(this.direcao<0);
    }
    atingir(impactoForte=false):boolean {if(this.derrotado)return false;if(impactoForte&&this.estado==='desliza'){this.estado='tonto';this.estadoAte=this.scene.time.now+900;this.setVelocityX(0).setFrame(5);return false;}if(this.estado!=='tonto'){this.setTint(0xa9e7ff);this.scene.time.delayedCall(120,()=>this.active&&this.clearTint());return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody().setFrame(5);this.scene.tweens.add({targets:this,y:this.y+28,alpha:0,duration:520,onComplete:()=>this.destroy()});}
}
