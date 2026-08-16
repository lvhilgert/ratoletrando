import * as Phaser from 'phaser';

export class CavaleiroReino extends Phaser.Physics.Arcade.Sprite {
    private static readonly ESCALA_NORMAL=.34;
    private static readonly ESCALA_X_ATAQUE=.375;
    olhando=1;
    atacando=false;
    invulneravel=false;
    defendendo=false;
    private ultimoContatoChao=0;
    private saltoGuardadoAte=0;
    private saltosUsados=0;
    private proximoDash=0;
    private sombra:Phaser.GameObjects.Ellipse;
    constructor(cena:Phaser.Scene,x:number,y:number){
        super(cena,x,y,'reino-cavaleiro',0);this.sombra=cena.add.ellipse(x,y+80,48,13,0x17382f,.24).setDepth(7);cena.add.existing(this);cena.physics.add.existing(this);
        this.setScale(CavaleiroReino.ESCALA_NORMAL).setCollideWorldBounds(true).setDepth(8);
        const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setSize(120,230).setOffset(48,240).setMaxVelocity(250,720);
    }
    mover(direcao:number,bloqueado:boolean):void {
        this.sombra.setPosition(this.x,this.y+78).setScale(Phaser.Math.Clamp(1-Math.abs((this.body as Phaser.Physics.Arcade.Body).velocity.y)/1200,.55,1));
        if(bloqueado){this.setVelocityX(0);return;}
        if(direcao){this.olhando=direcao;this.setFlipX(direcao<0);this.setVelocityX(direcao*230);if(!this.atacando&&this.body?.blocked.down)this.anims.play('reino-correr',true);}
        else {this.setVelocityX(0);if(!this.atacando&&this.body?.blocked.down)this.anims.play('reino-idle',true);}
        const corpo=this.body as Phaser.Physics.Arcade.Body;if(corpo.blocked.down){this.ultimoContatoChao=this.scene.time.now;this.saltosUsados=0;if(this.saltoGuardadoAte>this.scene.time.now){this.saltoGuardadoAte=0;this.executarPulo();}}else if(!this.atacando)this.setFrame(corpo.velocity.y<0?5:6);
    }
    pular():boolean {if(this.body?.blocked.down||this.scene.time.now-this.ultimoContatoChao<=110){this.executarPulo();return true;}if(this.saltosUsados<2){this.executarPulo(-520);return true;}this.saltoGuardadoAte=this.scene.time.now+140;return false;}
    private executarPulo(forca=-590):void {this.saltosUsados++;this.setVelocityY(forca);this.setFrame(5);}
    encerrarPulo():void {const corpo=this.body as Phaser.Physics.Arcade.Body;if(corpo.velocity.y<-210)corpo.setVelocityY(-210);}
    defender(ativo:boolean):void {this.defendendo=ativo;if(ativo&&!this.atacando){this.setVelocityX(0);this.setTint(0xbfe9ff);}else this.clearTint();}
    dash():boolean {if(this.scene.time.now<this.proximoDash||this.defendendo)return false;this.proximoDash=this.scene.time.now+850;this.invulneravel=true;this.setVelocity(this.olhando*520,0);this.setAlpha(.72);this.scene.time.delayedCall(170,()=>{this.setVelocityX(this.olhando*190);this.setAlpha(1);this.invulneravel=false;});return true;}
    atacar():void {if(this.atacando)return;this.atacando=true;this.setVelocityX(0);this.setScale(CavaleiroReino.ESCALA_X_ATAQUE,CavaleiroReino.ESCALA_NORMAL);this.anims.play('reino-atacar',true);this.scene.time.delayedCall(220,()=>{this.setScale(CavaleiroReino.ESCALA_NORMAL);this.atacando=false;if(this.body?.blocked.down)this.anims.play('reino-idle',true);});}
    levarDano(origemX:number):void {this.invulneravel=true;this.setFrame(9).setVelocity((this.x<origemX?-1:1)*260,-260);this.scene.tweens.add({targets:this,alpha:.28,yoyo:true,repeat:5,duration:85,onComplete:()=>{this.alpha=1;this.invulneravel=false;}});}
}
