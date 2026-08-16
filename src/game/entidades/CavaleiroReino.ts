import * as Phaser from 'phaser';
import type { EquipadoReino } from '../sistemas/ProgressoReino';

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
    private corPoeira=0xc9b58b;
    private sombra:Phaser.GameObjects.Ellipse;
    private arma?:Phaser.GameObjects.Container;private companheiro?:Phaser.GameObjects.Container;
    private tipoArma='espada';private movimentoArma?:Phaser.Tweens.Tween;private movimentoCompanheiro?:Phaser.Tweens.Tween;private proximaPoeira=0;
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
        if(direcao){this.pararRespiracao();this.olhando=direcao;this.setFlipX(direcao<0);this.setVelocityX(direcao*velocidade);if(!this.atacando&&noChao){this.anims.play('reino-correr',true);this.criarPoeira(false);}}
        else {this.setVelocityX(0);if(!this.atacando&&noChao){this.anims.play('reino-idle',true);if(!this.agachado)this.iniciarRespiracao();}}
        if(!noChao&&!this.atacando){this.pararRespiracao();this.setFrame(corpo.velocity.y<0?5:6);}this.atualizarEquipamentos();
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
    definirCorPoeira(cor:number):void {this.corPoeira=cor;}
    aplicarEquipamento(equipado:EquipadoReino):void {this.tipoArma=equipado.arma;this.movimentoCompanheiro?.stop();this.arma?.destroy(true);this.companheiro?.destroy(true);this.arma=this.criarArma(equipado.arma).setDepth(9);if(equipado.companheiro){this.companheiro=this.criarCompanheiro(equipado.companheiro).setPosition(this.x-this.olhando*48,this.y-55).setDepth(9);this.movimentoCompanheiro=this.scene.tweens.add({targets:this.companheiro.first,y:-7,duration:700,yoyo:true,repeat:-1,ease:'Sine.InOut'});}this.atualizarEquipamentos();}
    defender(ativo:boolean):void {this.defendendo=ativo;if(ativo&&!this.atacando){this.setVelocityX(0);this.setTint(0xbfe9ff);}else this.setTint(this.corRoupa);}
    dash():boolean {if(this.scene.time.now<this.proximoDash||this.defendendo)return false;this.proximoDash=this.scene.time.now+850;this.invulneravel=true;this.setVelocity(this.olhando*520,0);this.setAlpha(.72);this.scene.time.delayedCall(170,()=>{this.setVelocityX(this.olhando*190);this.setAlpha(1);this.invulneravel=false;});return true;}
    atacar(duracao=220):void {if(this.atacando)return;this.pararRespiracao();if(this.agachado)this.restaurarForma();this.atacando=true;this.setVelocityX(0);this.setScale(CavaleiroReino.ESCALA_NORMAL);this.anims.play('reino-atacar',true);this.animarArma(duracao);this.scene.time.delayedCall(duracao,()=>{if(!this.atacando)return;this.setScale(CavaleiroReino.ESCALA_NORMAL);this.atacando=false;if(this.body?.blocked.down)this.anims.play('reino-idle',true);});}
    levarDano(origemX:number):void {this.pararRespiracao();if(this.agachado)this.restaurarForma();this.invulneravel=true;this.setFrame(9).setVelocity((this.x<origemX?-1:1)*260,-260);this.scene.tweens.add({targets:this,alpha:.28,yoyo:true,repeat:5,duration:85,onComplete:()=>{this.alpha=1;this.invulneravel=false;}});}
    private executarPulo(velocidadeY=-570):void {if(this.agachado)this.restaurarForma();this.coyoteDisponivel=false;this.saltoGuardadoAte=0;this.inicioPulo=this.scene.time.now;this.setVelocityY(velocidadeY);this.setFrame(5);}
    private restaurarForma():void {this.agachado=false;this.ajustarForma(CavaleiroReino.ESCALA_NORMAL,CavaleiroReino.ESCALA_NORMAL,120,230,68,252);}
    private ajustarForma(escalaX:number,escalaY:number,largura:number,altura:number,offsetX:number,offsetY:number):void {const corpo=this.body as Phaser.Physics.Arcade.Body,base=corpo.bottom;this.setScale(escalaX,escalaY);corpo.setSize(largura,altura).setOffset(offsetX,offsetY);corpo.updateFromGameObject();this.y+=base-corpo.bottom;}
    private impactarPouso():void {if(this.agachado||this.atacando)return;this.pararRespiracao();this.criarPoeira(true);this.setScale(.37,.27);this.scene.tweens.add({targets:this,scaleX:CavaleiroReino.ESCALA_NORMAL,scaleY:CavaleiroReino.ESCALA_NORMAL,duration:100,ease:'Sine.Out'});}
    private iniciarRespiracao():void {if(this.respiracao?.isPlaying())return;this.respiracao=this.scene.tweens.add({targets:this,scaleX:.345,scaleY:.333,duration:850,yoyo:true,repeat:-1,ease:'Sine.InOut'});}
    private pararRespiracao():void {if(!this.respiracao)return;this.respiracao.stop();this.respiracao=undefined;if(!this.agachado&&!this.atacando)this.setScale(CavaleiroReino.ESCALA_NORMAL);}
    private atualizarSombra(corpo:Phaser.Physics.Arcade.Body):void {if(corpo.blocked.down)this.sombraYChao=this.y+80;const distancia=Math.max(0,this.sombraYChao-(this.y+80)),escala=Phaser.Math.Clamp(1-distancia/360,.52,1);this.sombra.setPosition(this.x,this.sombraYChao).setScale(escala).setAlpha(.12+.12*escala);}
    private atualizarEquipamentos():void {if(this.arma)this.arma.setPosition(this.x+this.olhando*24,this.y+5).setScale(this.olhando,1);if(this.companheiro){this.companheiro.x=Phaser.Math.Linear(this.companheiro.x,this.x-this.olhando*52,.09);this.companheiro.y=Phaser.Math.Linear(this.companheiro.y,this.y-52,.09);}}
    private criarArma(tipo:string):Phaser.GameObjects.Container {const g=this.scene.add.graphics();if(tipo==='martelo')g.lineStyle(5,0x70452f).lineBetween(0,8,26,-13).fillStyle(0x71818c).fillRoundedRect(18,-23,25,18,4).lineStyle(2,0xe2eef2).strokeRoundedRect(18,-23,25,18,4);else if(tipo==='lanca')g.lineStyle(4,0x8b5b35).lineBetween(-8,13,48,-21).fillStyle(0xe8edf0).fillTriangle(46,-27,61,-29,50,-15);else if(tipo==='arco')g.lineStyle(4,0x9b6538).beginPath().arc(15,0,25,-1.15,1.15).strokePath().lineStyle(2,0xf3e0b8).lineBetween(25,-23,25,23).fillStyle(0xffdc67).fillTriangle(28,-2,38,0,28,3);else {const rapida=tipo==='espada-rapida';g.lineStyle(rapida?3:5,rapida?0xb8f5ff:0xdce8ed).lineBetween(2,8,35,-25).lineStyle(4,0x8a613c).lineBetween(-5,15,7,3).lineStyle(5,rapida?0x62d9ed:0xd5a642).lineBetween(-2,2,11,15);if(rapida)g.lineStyle(2,0x7eeeff,.65).lineBetween(12,-4,43,-31);}return this.scene.add.container(0,0,[g]).setSize(70,60);}
    private criarCompanheiro(tipo:string):Phaser.GameObjects.Container {const g=this.scene.add.graphics();if(tipo==='coruja')g.fillStyle(0x8b6848).fillEllipse(0,2,28,32).fillStyle(0xe9d9ac).fillCircle(-6,-4,7).fillCircle(6,-4,7).fillStyle(0x263d42).fillCircle(-6,-4,2).fillCircle(6,-4,2).fillStyle(0xf0ad45).fillTriangle(-3,2,3,2,0,7);else if(tipo==='raposa')g.fillStyle(0xe4773e).fillEllipse(0,5,32,22).fillTriangle(-14,-1,-10,-16,-3,-5).fillTriangle(14,-1,10,-16,3,-5).fillStyle(0xffe1bd).fillEllipse(0,9,16,9).fillStyle(0x27383a).fillCircle(0,7,2);else if(tipo==='tartaruga')g.fillStyle(0x6a9b54).fillEllipse(0,5,34,20).lineStyle(2,0xd4dc74).strokeEllipse(0,5,25,15).fillStyle(0x8fc66d).fillCircle(20,5,7).fillCircle(-11,15,4).fillCircle(10,15,4);else g.fillStyle(0x72d9c8).fillEllipse(0,5,27,22).fillCircle(14,-2,10).fillTriangle(-9,1,-22,-10,-15,10).fillTriangle(4,-7,-2,-20,10,-10).fillStyle(0xffef91).fillCircle(17,-5,3).fillTriangle(21,2,32,5,21,8);return this.scene.add.container(0,0,[g]).setSize(48,42);}
    private animarArma(duracao:number):void {if(!this.arma)return;this.movimentoArma?.stop();this.arma.setRotation(this.tipoArma==='arco'?-.08:-.65);this.movimentoArma=this.scene.tweens.add({targets:this.arma,rotation:this.tipoArma==='arco'?.08:1.05,duration:this.tipoArma==='arco'?70:Math.max(90,duracao*.58),yoyo:this.tipoArma==='arco',repeat:this.tipoArma==='arco'?1:0,ease:'Sine.InOut',onComplete:()=>this.arma?.setRotation(0)});}
    private criarPoeira(pouso:boolean):void {const agora=this.scene.time.now;if(!pouso&&agora<this.proximaPoeira)return;this.proximaPoeira=agora+150;for(let i=0;i<(pouso?7:2);i++){const p=this.scene.add.ellipse(this.x+Phaser.Math.Between(-18,18),this.y+76,Phaser.Math.Between(5,11),Phaser.Math.Between(3,7),this.corPoeira,.55).setDepth(7);this.scene.tweens.add({targets:p,x:p.x+Phaser.Math.Between(-25,25),y:p.y-Phaser.Math.Between(5,18),alpha:0,scale:1.6,duration:Phaser.Math.Between(240,420),onComplete:()=>p.destroy()});}}
}
