import * as Phaser from 'phaser';
import type { EquipadoReino } from '../sistemas/ProgressoReino';
import { alinharCorpoTerrestre, assentarTerrestre, configurarAtorTerrestre } from '../sistemas/TerrestreReino';
import { circuloRaster } from '../sistemas/ArteRaster';

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
    private corPoeira=0xc9b58b;
    private multiplicadorVelocidade=1;
    private multiplicadorPulo=1;
    private noGelo=false;
    private sombra:Phaser.GameObjects.Image;
    private arma?:Phaser.GameObjects.Container;private visualArma?:Phaser.GameObjects.Sprite;private visualEscudo?:Phaser.GameObjects.Sprite;private companheiro?:Phaser.GameObjects.Sprite;private tipoCompanheiro?:string;
    private tipoArma='espada';private movimentoArma?:Phaser.Tweens.Tween;private movimentoCompanheiro?:Phaser.Tweens.Tween;private proximaPoeira=0;
    constructor(cena:Phaser.Scene,x:number,y:number){
        super(cena,x,y,'reino-cavaleiro',0);this.sombraYChao=y+80;this.sombra=circuloRaster(cena,x,this.sombraYChao,48,0x17382f,.24).setDisplaySize(48,13).setDepth(7);cena.add.existing(this);cena.physics.add.existing(this);
        this.setScale(CavaleiroReino.ESCALA_NORMAL).setDepth(8);
        configurarAtorTerrestre(this,{largura:120,altura:230,offsetX:68,velocidadeMaxima:[250,760],colideComLimitesDoMundo:true});
    }
    mover(direcao:number,bloqueado:boolean):void {
        const corpo=this.body as Phaser.Physics.Arcade.Body,noChao=corpo.blocked.down;
        this.atualizarSombra(corpo);
        if(noChao){this.ultimoContatoChao=this.scene.time.now;this.coyoteDisponivel=true;this.puloAereoUsado=false;if(!this.estavaNoChao){this.setFrame(0);if(this.velocidadeQuedaAnterior>430)this.impactarPouso();}if(this.saltoGuardadoAte>=this.scene.time.now)this.executarPulo();}
        this.estavaNoChao=noChao;this.velocidadeQuedaAnterior=corpo.velocity.y;
        if(bloqueado){this.setVelocityX(0);this.pararRespiracao();return;}
        const velocidade=(this.agachado?95:230)*this.multiplicadorVelocidade;
        if(direcao){this.pararRespiracao();this.olhando=direcao;this.setFlipX(direcao<0);this.setVelocityX(this.noGelo?Phaser.Math.Linear(corpo.velocity.x,direcao*velocidade,.075):direcao*velocidade);if(!this.atacando&&noChao){this.anims.play('reino-correr',true);this.animarVisualArma('correr');this.criarPoeira(false);}}
        else {this.setVelocityX(this.noGelo?corpo.velocity.x*.94:0);if(!this.atacando&&noChao){this.anims.play('reino-idle',true);this.animarVisualArma('idle');if(!this.agachado)this.iniciarRespiracao();}}
        if(!noChao&&!this.atacando){this.pararRespiracao();this.setFrame(corpo.velocity.y<0?5:6);this.visualArma?.setFrame(corpo.velocity.y<0?5:6);}this.atualizarEquipamentos();
    }
    pular():boolean {
        const agora=this.scene.time.now;if(this.body?.blocked.down||(this.coyoteDisponivel&&agora-this.ultimoContatoChao<=CavaleiroReino.JANELA_PULO)){this.executarPulo();return true;}
        if(!this.puloAereoUsado){this.puloAereoUsado=true;this.executarPulo(-505);return true;}
        this.saltoGuardadoAte=agora+CavaleiroReino.JANELA_PULO;return false;
    }
    sustentarPulo(pressionado:boolean):void {
        const corpo=this.body as Phaser.Physics.Arcade.Body;
        if(pressionado&&corpo.velocity.y<0&&this.scene.time.now-this.inicioPulo<105)corpo.setVelocityY(Math.max(-620*this.multiplicadorPulo,corpo.velocity.y-15*this.multiplicadorPulo));
    }
    encerrarPulo():void {const corpo=this.body as Phaser.Physics.Arcade.Body;if(corpo.velocity.y<-235)corpo.setVelocityY(-235);this.inicioPulo=0;}
    agachar(ativo:boolean,bloqueado:boolean):void {
        const corpo=this.body as Phaser.Physics.Arcade.Body;
        if(bloqueado){if(this.agachado)this.restaurarForma();return;}
        if(!corpo.blocked.down){if(this.agachado)this.restaurarForma();corpo.setGravityY(ativo?720:0);return;}
        corpo.setGravityY(0);if(ativo===this.agachado||this.atacando)return;
        if(ativo){this.pararRespiracao();this.agachado=true;this.ajustarForma(.38,.23,126,180,65);}else this.restaurarForma();
    }
    resetarEstado():void {this.scene.tweens.killTweensOf(this);if(this.visualArma)this.scene.tweens.killTweensOf(this.visualArma);this.visualEscudo?.destroy();this.visualEscudo=undefined;this.agachado=false;this.atacando=false;this.defendendo=false;this.coyoteDisponivel=false;this.puloAereoUsado=false;this.inicioPulo=0;this.saltoGuardadoAte=0;this.estavaNoChao=false;this.pararRespiracao();const corpo=this.body as Phaser.Physics.Arcade.Body,base=corpo.bottom;corpo.setGravityY(0);this.setScale(CavaleiroReino.ESCALA_NORMAL).setAlpha(1).clearTint().setVisible(!this.visualArma);this.visualArma?.setAlpha(1).clearTint().setVisible(true);corpo.setSize(120,230).setOffset(68,0);alinharCorpoTerrestre(this,base);}
    aplicarRoupa(_cor:number):void {this.clearTint();this.visualArma?.clearTint();}
    definirEfeitoPocao(multiplicadorVelocidade=1,multiplicadorPulo=1):void {this.multiplicadorVelocidade=multiplicadorVelocidade;this.multiplicadorPulo=multiplicadorPulo;(this.body as Phaser.Physics.Arcade.Body).setMaxVelocity(multiplicadorVelocidade>1?380:250,760);}
    definirCorPoeira(cor:number):void {this.corPoeira=cor;}
    definirGelo(ativo:boolean):void {this.noGelo=ativo;}
    aplicarEquipamento(equipado:EquipadoReino):void {this.tipoArma=equipado.arma;this.movimentoCompanheiro?.stop();this.movimentoCompanheiro=undefined;this.arma?.destroy(true);this.arma=undefined;this.visualArma?.destroy();this.visualArma=undefined;this.companheiro?.destroy();this.companheiro=undefined;this.tipoCompanheiro=equipado.companheiro;const armaIntegrada=['espada-rapida','lanca','martelo','arco'].includes(equipado.arma);this.setVisible(!armaIntegrada);if(armaIntegrada)this.visualArma=this.scene.add.sprite(0,0,`reino-cavaleiro-${equipado.arma}`,0).setScale(350/667).setOrigin(.5,1).setDepth(8).play(`reino-cavaleiro-${equipado.arma}-idle`);else if(equipado.arma!=='espada')this.arma=this.criarArma(equipado.arma).setDepth(9);if(equipado.companheiro){this.companheiro=this.criarCompanheiro(equipado.companheiro).setDepth(9).play(`reino-companheiro-${equipado.companheiro}-mover`);if(equipado.companheiro==='coruja'||equipado.companheiro==='dragao')this.movimentoCompanheiro=this.scene.tweens.add({targets:this.companheiro,angle:5,duration:700,yoyo:true,repeat:-1,ease:'Sine.InOut'});}this.atualizarEquipamentos();}
    defender(ativo:boolean):void {if(ativo===this.defendendo)return;this.defendendo=ativo;if(ativo&&!this.atacando){this.setVelocityX(0);this.setVisible(false);this.visualArma?.setVisible(false);this.visualEscudo?.destroy();this.visualEscudo=this.scene.add.sprite(this.x,this.y,'reino-cavaleiro-escudo',0).setDisplaySize(74,148).setOrigin(.5,1).setDepth(9).setFlipX(this.olhando<0);this.scene.time.delayedCall(100,()=>{if(this.defendendo&&this.visualEscudo?.active)this.visualEscudo.setFrame(1);});}else if(this.visualEscudo){this.visualEscudo.setFrame(2);this.scene.time.delayedCall(130,()=>{if(this.defendendo)return;this.visualEscudo?.destroy();this.visualEscudo=undefined;this.setVisible(!this.visualArma);this.visualArma?.setVisible(true);});}}
    dash():boolean {if(this.scene.time.now<this.proximoDash||this.defendendo)return false;this.proximoDash=this.scene.time.now+850;this.invulneravel=true;this.setVelocity(this.olhando*520,0);this.setAlpha(.72);this.visualArma?.setAlpha(.72);this.scene.time.delayedCall(170,()=>{this.setVelocityX(this.olhando*190);this.setAlpha(1);this.visualArma?.setAlpha(1);this.invulneravel=false;});return true;}
    atacar(duracao=220):void {if(this.atacando)return;this.pararRespiracao();if(this.agachado)this.restaurarForma();this.atacando=true;this.setVelocityX(0);this.setScale(CavaleiroReino.ESCALA_NORMAL);this.anims.play('reino-atacar',true);this.animarVisualArma('atacar');this.animarArma(duracao);this.scene.time.delayedCall(duracao,()=>{if(!this.atacando)return;this.setScale(CavaleiroReino.ESCALA_NORMAL);this.atacando=false;if(this.body?.blocked.down){this.anims.play('reino-idle',true);this.animarVisualArma('idle');}});}
    levarDano(origemX:number):void {this.pararRespiracao();if(this.agachado)this.restaurarForma();this.invulneravel=true;this.setFrame(9);this.visualArma?.setFrame(9).setFlipX(this.olhando<0);this.setVelocity((this.x<origemX?-1:1)*260,-260);this.scene.tweens.add({targets:[this,this.visualArma].filter(Boolean),alpha:.28,yoyo:true,repeat:5,duration:85,onComplete:()=>{this.alpha=1;this.visualArma?.setAlpha(1);this.invulneravel=false;}});}
    private executarPulo(velocidadeY=-570):void {if(this.agachado)this.restaurarForma();this.coyoteDisponivel=false;this.saltoGuardadoAte=0;this.inicioPulo=this.scene.time.now;this.setVelocityY(velocidadeY*this.multiplicadorPulo);this.setFrame(5);}
    private restaurarForma():void {this.agachado=false;this.ajustarForma(CavaleiroReino.ESCALA_NORMAL,CavaleiroReino.ESCALA_NORMAL,120,230,68);}
    private ajustarForma(escalaX:number,escalaY:number,largura:number,altura:number,offsetX:number):void {const corpo=this.body as Phaser.Physics.Arcade.Body,base=corpo.bottom;this.setScale(escalaX,escalaY);corpo.setSize(largura,altura).setOffset(offsetX,0);alinharCorpoTerrestre(this,base);}
    private impactarPouso():void {if(this.agachado||this.atacando)return;this.pararRespiracao();this.criarPoeira(true);this.setScale(.35,.32);this.scene.tweens.add({targets:this,scaleX:CavaleiroReino.ESCALA_NORMAL,scaleY:CavaleiroReino.ESCALA_NORMAL,duration:45,ease:'Sine.Out'});}
    private iniciarRespiracao():void {if(this.respiracao?.isPlaying())return;this.respiracao=this.scene.tweens.add({targets:this,scaleX:.345,scaleY:.333,duration:850,yoyo:true,repeat:-1,ease:'Sine.InOut'});}
    private pararRespiracao():void {if(!this.respiracao)return;this.respiracao.stop();this.respiracao=undefined;if(!this.agachado&&!this.atacando)this.setScale(CavaleiroReino.ESCALA_NORMAL);}
    private atualizarSombra(corpo:Phaser.Physics.Arcade.Body):void {if(corpo.blocked.down)this.sombraYChao=corpo.bottom;const distancia=Math.max(0,this.sombraYChao-corpo.bottom),escala=Phaser.Math.Clamp(1-distancia/360,.52,1);this.sombra.setPosition(this.x,this.sombraYChao).setDisplaySize(48*escala,13*escala).setAlpha(.12+.12*escala);}
    private animarVisualArma(acao:'idle'|'correr'|'atacar'):void {this.visualArma?.play(`reino-cavaleiro-${this.tipoArma}-${acao}`,true);}
    private atualizarEquipamentos():void {const pe=(this.body as Phaser.Physics.Arcade.Body).bottom;if(this.arma)this.arma.setPosition(this.x+this.olhando*24,this.y+5).setScale(this.olhando,1);if(this.visualArma)assentarTerrestre(this.visualArma,pe).setX(this.x).setFlipX(this.olhando<0);if(this.visualEscudo)assentarTerrestre(this.visualEscudo,pe).setX(this.x).setFlipX(this.olhando<0);if(this.companheiro){const terrestre=this.tipoCompanheiro==='raposa'||this.tipoCompanheiro==='tartaruga';this.companheiro.x=Phaser.Math.Linear(this.companheiro.x,this.x-this.olhando*(terrestre?62:52),.12);if(terrestre)assentarTerrestre(this.companheiro,pe).setX(this.companheiro.x);else this.companheiro.y=Phaser.Math.Linear(this.companheiro.y,this.y-52,.12);this.companheiro.setFlipX(this.olhando<0);}}
    private criarArma(_tipo:string):Phaser.GameObjects.Container {return this.scene.add.container(0,0,[this.scene.add.image(18,-8,'reino-espada-cristal').setDisplaySize(72,72)]).setSize(70,60);}
    private criarCompanheiro(tipo:string):Phaser.GameObjects.Sprite {const terrestre=tipo==='raposa'||tipo==='tartaruga',dragao=tipo==='dragao';return this.scene.add.sprite(0,0,`reino-companheiro-${tipo}-mover`,0).setDisplaySize(terrestre?64:dragao?72:54,terrestre?46:dragao?72:54).setOrigin(.5,terrestre?1:.5);}
    private animarArma(duracao:number):void {if(!this.arma)return;this.movimentoArma?.stop();this.arma.setRotation(this.tipoArma==='arco'?-.08:-.65);this.movimentoArma=this.scene.tweens.add({targets:this.arma,rotation:this.tipoArma==='arco'?.08:1.05,duration:this.tipoArma==='arco'?70:Math.max(90,duracao*.58),yoyo:this.tipoArma==='arco',repeat:this.tipoArma==='arco'?1:0,ease:'Sine.InOut',onComplete:()=>this.arma?.setRotation(0)});}
    // raster-exception: poeira efêmera gerada pelo contato do personagem com o chão.
    private criarPoeira(pouso:boolean):void {const agora=this.scene.time.now;if(!pouso&&agora<this.proximaPoeira)return;this.proximaPoeira=agora+150;const pe=(this.body as Phaser.Physics.Arcade.Body).bottom;for(let i=0;i<(pouso?7:2);i++){const p=this.scene.add.ellipse(this.x+Phaser.Math.Between(-18,18),pe,Phaser.Math.Between(5,11),Phaser.Math.Between(3,7),this.corPoeira,.55).setDepth(7);this.scene.tweens.add({targets:p,x:p.x+Phaser.Math.Between(-25,25),y:p.y-Phaser.Math.Between(5,18),alpha:0,scale:1.6,duration:Phaser.Math.Between(240,420),onComplete:()=>p.destroy()});}}
}
