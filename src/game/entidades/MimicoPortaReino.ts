import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';

/** Guardião final de cada região: desperta, persegue e golpeia em intervalos legíveis. */
export class MimicoPortaReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;get corpoColisao():Phaser.Physics.Arcade.Sprite{return this;}derrotado=false;
    private vida:number;private estado:'dormindo'|'andando'|'ataque'='dormindo';private estadoAte=0;private direcao=-1;
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite,bonusVida=0){super(cena,x,y,'reino-mimico-porta',0);cena.add.existing(this);cena.physics.add.existing(this);this.vida=5+bonusVida;this.setScale(.21).setDepth(9);(this.body as Phaser.Physics.Arcade.Body).setSize(245,430).setOffset(82,260).setMaxVelocity(185,650);}
    atualizar():void {if(this.derrotado)return;const agora=this.scene.time.now,dx=this.alvo.x-this.x,perto=Math.abs(dx)<430;if(this.estado==='dormindo'&&perto){this.estado='andando';this.setFrame(1);this.estadoAte=agora+500;}else if(this.estado==='andando'&&agora>=this.estadoAte&&Math.abs(dx)<145){this.estado='ataque';this.direcao=Math.sign(dx)||this.direcao;this.setFrame(3).setVelocityX(this.direcao*175);this.estadoAte=agora+420;}else if(this.estado==='ataque'&&agora>=this.estadoAte){this.estado='andando';this.setFrame(2);this.estadoAte=agora+900;}if(this.estado==='andando'){this.direcao=Math.sign(dx)||this.direcao;this.setFrame(2).setVelocityX(perto?this.direcao*55:0);}else if(this.estado==='dormindo')this.setVelocityX(0);this.setFlipX(this.direcao>0);}
    atingir():boolean {if(this.derrotado)return false;if(--this.vida>0){this.setTint(0xffd47a).setAlpha(.5);this.scene.time.delayedCall(130,()=>{if(this.active)this.clearTint().setAlpha(1);});return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.setVelocity(0,0).disableBody().clearTint().setFrame(4);this.scene.tweens.add({targets:this,y:this.y+30,alpha:0,scale:.1,duration:850,ease:'Back.In',onComplete:()=>this.destroy()});}
}
