import * as Phaser from 'phaser';
import { InimigoReino } from './InimigoReino';
import type { TemaReino } from '../dados/mundoReinoPortas';
import { configurarAtorTerrestre } from '../sistemas/TerrestreReino';

interface PadraoAtaqueMimico {
    velocidade:number;
    duracao:number;
    intervalo:number;
    golpes:number;
}

/** Guardião final de cada região: desperta, persegue e golpeia em intervalos legíveis. */
export class MimicoPortaReino extends Phaser.Physics.Arcade.Sprite implements InimigoReino {
    readonly colideComPlataformas=true;get corpoColisao():Phaser.Physics.Arcade.Sprite{return this;}derrotado=false;
    private vida:number;private estado:'dormindo'|'andando'|'ataque'='dormindo';private estadoAte=0;private direcao=-1;
    private readonly padrao:PadraoAtaqueMimico;private golpesRestantes=0;private preparandoCombo=false;
    constructor(cena:Phaser.Scene,x:number,y:number,private readonly alvo:Phaser.Physics.Arcade.Sprite,bonusVida=0,regiao:TemaReino='bosque'){super(cena,x,y,'reino-mimico-porta',0);cena.add.existing(this);cena.physics.add.existing(this);this.vida=5+bonusVida;this.padrao=this.criarPadrao(regiao);this.setScale(.21).setDepth(9);configurarAtorTerrestre(this,{largura:245,altura:430,offsetX:82,velocidadeMaxima:[260,650]});}
    atualizar():void {
        if(this.derrotado)return;const agora=this.scene.time.now,dx=this.alvo.x-this.x,perto=Math.abs(dx)<430;
        if(this.estado==='dormindo'&&perto){this.estado='andando';this.setFrame(1);this.estadoAte=agora+500;}
        else if(this.estado==='andando'&&agora>=this.estadoAte&&Math.abs(dx)<145){this.iniciarAtaque(dx,agora);}
        else if(this.estado==='ataque'&&agora>=this.estadoAte){
            if(this.preparandoCombo){this.preparandoCombo=false;this.direcao=Math.sign(dx)||this.direcao;this.setFrame(3).setVelocityX(this.direcao*this.padrao.velocidade);this.estadoAte=agora+this.padrao.duracao;}
            else if(this.golpesRestantes>0){this.golpesRestantes--;this.preparandoCombo=true;this.setFrame(1).setVelocityX(0);this.estadoAte=agora+180;}
            else {this.estado='andando';this.setFrame(2);this.estadoAte=agora+this.padrao.intervalo;}
        }
        if(this.estado==='andando'){this.direcao=Math.sign(dx)||this.direcao;this.setFrame(2).setVelocityX(perto?this.direcao*55:0);}else if(this.estado==='dormindo')this.setVelocityX(0);this.setFlipX(this.direcao>0);
    }
    atingir():boolean {if(this.derrotado)return false;if(--this.vida>0){this.setTint(0xffd47a).setAlpha(.5);this.scene.time.delayedCall(130,()=>{if(this.active)this.clearTint().setAlpha(1);});return false;}this.derrotar();return true;}
    derrotar():void {if(this.derrotado)return;this.derrotado=true;this.setVelocity(0,0).disableBody().clearTint().setFrame(4);this.scene.tweens.add({targets:this,y:this.y+30,alpha:0,scale:.1,duration:850,ease:'Back.In',onComplete:()=>this.destroy()});}
    private iniciarAtaque(dx:number,agora:number):void {this.estado='ataque';this.direcao=Math.sign(dx)||this.direcao;this.golpesRestantes=this.padrao.golpes-1;this.preparandoCombo=false;this.setFrame(3).setVelocityX(this.direcao*this.padrao.velocidade);this.estadoAte=agora+this.padrao.duracao;}
    private criarPadrao(regiao:TemaReino):PadraoAtaqueMimico {
        if(regiao==='pantano'||regiao==='biblioteca'||regiao==='castelo')return {velocidade:230,duracao:360,intervalo:650,golpes:2};
        if(regiao==='caverna'||regiao==='montanha')return {velocidade:205,duracao:470,intervalo:740,golpes:1};
        return {velocidade:175,duracao:420,intervalo:900,golpes:1};
    }
}
