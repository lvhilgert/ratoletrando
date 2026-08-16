import * as Phaser from 'phaser';

export class CavaleiroReino extends Phaser.Physics.Arcade.Sprite {
    private static readonly ESCALA_NORMAL=.34;
    private static readonly JANELA_PULO=115;
    olhando=1;
    atacando=false;
    invulneravel=false;
    defendendo=false;
    private agachado=false;
    private ultimoContatoChao=0;
    private coyoteDisponivel=false;
    private puloAereoUsado=false;
    private saltoGuardadoAte=0;
    private inicioPulo=0;
    private estavaNoChao=false;
    private velocidadeQuedaAnterior=0;
    private sombraYChao:number;
    private respiracao?:Phaser.Tweens.Tween;
    private proximoDash=0;
    private corRoupa=0xffffff;
    private sombra:Phaser.GameObjects.Ellipse;
    constructor(cena:Phaser.Scene,x:number,y:number){
        super(cena,x,y,'reino-cavaleiro',0);this.sombraYChao=y+80;this.sombra=cena.add.ellipse(x,this.sombraYChao,48,13,0x17382f,.24).setDepth(7);cena.add.existing(this);cena.physics.add.existing(this);
        this.setScale(CavaleiroReino.ESCALA_NORMAL).setCollideWorldBounds(true).setDepth(8);
        const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setSize(120,230).setOffset(68,252).setMaxVelocity(250,760);
    }
    mover(direcao:number,bloqueado:boolean):void {
        const corpo=this.body as Phaser.Physics.Arcade.Body,noChao=corpo.blocked.down;
        this.atualizarSombra(corpo);
        if(noChao){this.ultimoContatoChao=this.scene.time.now;this.coyoteDisponivel=true;this.puloAereoUsado=false;if(!this.estavaNoChao&&this.velocidadeQuedaAnterior>430)this.impactarPouso();if(this.saltoGuardadoAte>=this.scene.time.now)this.executarPulo();}
        this.estavaNoChao=noChao;this.velocidadeQuedaAnterior=corpo.velocity.y;
        if(bloqueado){this.setVelocityX(0);this.pararRespiracao();return;}
        const velocidade=this.agachado?95:230;
        if(direcao){this.pararRespiracao();this.olhando=direcao;this.setFlipX(direcao<0);this.setVelocityX(direcao*velocidade);if(!this.atacando&&noChao)this.anims.play('reino-correr',true);}
        else {this.setVelocityX(0);if(!this.atacando&&noChao){this.anims.play('reino-idle',true);if(!this.agachado)this.iniciarRespiracao();}}
        if(!noChao&&!this.atacando){this.pararRespiracao();this.setFrame(corpo.velocity.y<0?5:6);}
    }
    pular():boolean {
        const agora=this.scene.time.now;if(this.body?.blocked.down||(this.coyoteDisponivel&&agora-this.ultimoContatoChao<=CavaleiroReino.JANELA_PULO)){this.executarPulo();return true;}
        if(!this.puloAereoUsado){this.puloAereoUsado=true;this.executarPulo(-505);return true;}
        this.saltoGuardadoAte=agora+CavaleiroReino.JANELA_PULO;return false;
    }
    sustentarPulo(pressionado:boolean):void {
        const corpo=this.body as Phaser.Physics.Arcade.Body;
        if(pressionado&&corpo.velocity.y<0&&this.scene.time.now-this.inicioPulo<105)corpo.setVelocityY(Math.max(-620,corpo.velocity.y-15));
    }
    encerrarPulo():void {const corpo=this.body as Phaser.Physics.Arcade.Body;if(corpo.velocity.y<-235)corpo.setVelocityY(-235);this.inicioPulo=0;}
    agachar(ativo:boolean,bloqueado:boolean):void {
        const corpo=this.body as Phaser.Physics.Arcade.Body;
        if(bloqueado){if(this.agachado)this.restaurarForma();return;}
        if(!corpo.blocked.down){if(this.agachado)this.restaurarForma();corpo.setGravityY(ativo?720:0);return;}
        corpo.setGravityY(0);if(ativo===this.agachado||this.atacando)return;
        if(ativo){this.pararRespiracao();this.agachado=true;this.ajustarForma(.38,.23,126,180,65,302);}else this.restaurarForma();
    }
    resetarEstado():void {this.scene.tweens.killTweensOf(this);this.agachado=false;this.atacando=false;this.defendendo=false;this.coyoteDisponivel=false;this.puloAereoUsado=false;this.inicioPulo=0;this.saltoGuardadoAte=0;this.estavaNoChao=false;this.pararRespiracao();const corpo=this.body as Phaser.Physics.Arcade.Body;corpo.setGravityY(0);this.setScale(CavaleiroReino.ESCALA_NORMAL).setTint(this.corRoupa);corpo.setSize(120,230).setOffset(68,252);}
    aplicarRoupa(cor:number):void {this.corRoupa=cor;this.setTint(cor);}
    defender(ativo:boolean):void {this.defendendo=ativo;if(ativo&&!this.atacando){this.setVelocityX(0);this.setTint(0xbfe9ff);}else this.setTint(this.corRoupa);}
    dash():boolean {if(this.scene.time.now<this.proximoDash||this.defendendo)return false;this.proximoDash=this.scene.time.now+850;this.invulneravel=true;this.setVelocity(this.olhando*520,0);this.setAlpha(.72);this.scene.time.delayedCall(170,()=>{this.setVelocityX(this.olhando*190);this.setAlpha(1);this.invulneravel=false;});return true;}
    atacar(duracao=220):void {if(this.atacando)return;this.pararRespiracao();if(this.agachado)this.restaurarForma();this.atacando=true;this.setVelocityX(0);this.setScale(CavaleiroReino.ESCALA_NORMAL);this.anims.play('reino-atacar',true);this.scene.time.delayedCall(duracao,()=>{if(!this.atacando)return;this.setScale(CavaleiroReino.ESCALA_NORMAL);this.atacando=false;if(this.body?.blocked.down)this.anims.play('reino-idle',true);});}
    levarDano(origemX:number):void {this.pararRespiracao();if(this.agachado)this.restaurarForma();this.invulneravel=true;this.setFrame(9).setVelocity((this.x<origemX?-1:1)*260,-260);this.scene.tweens.add({targets:this,alpha:.28,yoyo:true,repeat:5,duration:85,onComplete:()=>{this.alpha=1;this.invulneravel=false;}});}
    private executarPulo(velocidadeY=-570):void {if(this.agachado)this.restaurarForma();this.coyoteDisponivel=false;this.saltoGuardadoAte=0;this.inicioPulo=this.scene.time.now;this.setVelocityY(velocidadeY);this.setFrame(5);}
    private restaurarForma():void {this.agachado=false;this.ajustarForma(CavaleiroReino.ESCALA_NORMAL,CavaleiroReino.ESCALA_NORMAL,120,230,68,252);}
    private ajustarForma(escalaX:number,escalaY:number,largura:number,altura:number,offsetX:number,offsetY:number):void {const corpo=this.body as Phaser.Physics.Arcade.Body,base=corpo.bottom;this.setScale(escalaX,escalaY);corpo.setSize(largura,altura).setOffset(offsetX,offsetY);corpo.updateFromGameObject();this.y+=base-corpo.bottom;}
    private impactarPouso():void {if(this.agachado||this.atacando)return;this.pararRespiracao();this.setScale(.37,.27);this.scene.tweens.add({targets:this,scaleX:CavaleiroReino.ESCALA_NORMAL,scaleY:CavaleiroReino.ESCALA_NORMAL,duration:100,ease:'Sine.Out'});}
    private iniciarRespiracao():void {this.pararRespiracao();}
    private pararRespiracao():void {if(!this.respiracao)return;this.respiracao.stop();this.respiracao=undefined;if(!this.agachado&&!this.atacando)this.setScale(CavaleiroReino.ESCALA_NORMAL);}
    private atualizarSombra(corpo:Phaser.Physics.Arcade.Body):void {if(corpo.blocked.down)this.sombraYChao=this.y+80;const distancia=Math.max(0,this.sombraYChao-(this.y+80)),escala=Phaser.Math.Clamp(1-distancia/360,.52,1);this.sombra.setPosition(this.x,this.sombraYChao).setScale(escala).setAlpha(.12+.12*escala);}
}
