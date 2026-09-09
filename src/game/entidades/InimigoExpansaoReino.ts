import * as Phaser from 'phaser';
import type { TipoInimigo } from '../dados/mundoReinoPortas';
import { configurarAtorTerrestre } from '../sistemas/TerrestreReino';
import type { InimigoReino } from './InimigoReino';

const CONFIG:Record<Extract<TipoInimigo,'caranguejo'|'gaivota'|'caranguejo-farol'|'sentinela-musgo'|'tatu-pedra'|'urubu'|'gigante-basalto'>,{textura:string;aereo?:boolean;guardiao?:boolean;tamanho:[number,number];aviso:number;acao:number;recupera:number;velocidade:number}>={
    caranguejo:{textura:'reino-caranguejo',tamanho:[84,70],aviso:600,acao:520,recupera:900,velocidade:150},
    gaivota:{textura:'reino-gaivota',aereo:true,tamanho:[82,68],aviso:600,acao:600,recupera:1000,velocidade:180},
    'caranguejo-farol':{textura:'reino-caranguejo-farol',guardiao:true,tamanho:[145,115],aviso:800,acao:780,recupera:1400,velocidade:210},
    'sentinela-musgo':{textura:'reino-sentinela-musgo',guardiao:true,tamanho:[160,150],aviso:900,acao:700,recupera:1500,velocidade:0},
    'tatu-pedra':{textura:'reino-tatu-pedra',tamanho:[88,66],aviso:650,acao:760,recupera:1100,velocidade:230},
    urubu:{textura:'reino-urubu',aereo:true,tamanho:[92,76],aviso:700,acao:650,recupera:1200,velocidade:175},
    'gigante-basalto':{textura:'reino-gigante-basalto',guardiao:true,tamanho:[180,170],aviso:900,acao:900,recupera:1600,velocidade:220},
};

export class InimigoExpansaoReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas:boolean;readonly guardiao:boolean;readonly resisteMartelo=true;derrotado=false;get corpoColisao(){return this;}
    private estado:'espera'|'aviso'|'acao'|'recupera'='espera';private estadoAte=0;private vistoEm=0;private direcao=-1;private vida:number;private readonly baseY:number;
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite,private readonly tipo:Extract<TipoInimigo,keyof typeof CONFIG>){const c=CONFIG[tipo];super(cena,x,y,c.textura,0);this.baseY=y;cena.add.existing(this);cena.physics.add.existing(this);this.guardiao=!!c.guardiao;this.colideComPlataformas=!c.aereo;this.vida=this.guardiao?3:1;this.setDisplaySize(...c.tamanho).setDepth(9);if(c.aereo)(this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setSize(c.tamanho[0]*.7,c.tamanho[1]*.65);else configurarAtorTerrestre(this,{largura:190,altura:190,offsetX:24,velocidadeMaxima:[300,650]});}
    atualizar():void {if(this.derrotado)return;const c=CONFIG[this.tipo],agora=this.scene.time.now,visivel=this.scene.cameras.main.worldView.contains(this.x,this.y);if(!visivel){this.vistoEm=0;this.setVelocity(0);return;}if(!this.vistoEm)this.vistoEm=agora;const dx=this.alvo.x-this.x,corpo=this.body as Phaser.Physics.Arcade.Body;
        if(this.estado==='espera'&&agora-this.vistoEm>350&&Math.abs(dx)<(this.guardiao?560:350)){this.estado='aviso';this.estadoAte=agora+c.aviso;this.direcao=Math.sign(dx)||this.direcao;this.setVelocity(0).setFrame(1);}
        else if(this.estado==='aviso'&&agora>=this.estadoAte){this.estado='acao';this.estadoAte=agora+c.acao;this.setFrame(2);if(c.aereo)this.setVelocity(this.direcao*c.velocidade,Math.max(90,c.velocidade));else this.setVelocityX(this.direcao*c.velocidade);}
        else if(this.estado==='acao'&&(agora>=this.estadoAte||corpo.blocked.left||corpo.blocked.right)){this.estado='recupera';this.estadoAte=agora+c.recupera;this.setVelocity(0).setFrame(3);}
        else if(this.estado==='recupera'&&agora>=this.estadoAte){this.estado='espera';this.setFrame(0);if(c.aereo)this.setY(this.baseY);}
        this.setFlipX(this.direcao<0);
    }
    atingir():boolean {if(this.derrotado)return false;if(this.estado!=='recupera'){this.setTint(0xffdf9e);this.scene.time.delayedCall(130,()=>this.active&&this.clearTint());return false;}if(--this.vida>0){this.estadoAte=this.scene.time.now+CONFIG[this.tipo].recupera;return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.disableBody().setFrame(3);this.scene.tweens.add({targets:this,y:this.y+28,alpha:0,duration:650,onComplete:()=>this.destroy()});}
}
