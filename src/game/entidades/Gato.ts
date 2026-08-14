import * as Phaser from 'phaser';
import { buscarCaminho } from '../sistemas/SistemaCaminho';
import { PosicaoGrade } from '../tipos/jogo';

export class Gato extends Phaser.Physics.Arcade.Sprite {
    private rota: PosicaoGrade[] = [];
    private proximoCalculo = 0;
    constructor(cena: Phaser.Scene, x: number, y: number, private velocidade: number, private mapa: number[][], private tamanho: number, private topo: number, private esquerda: number) {
        super(cena, x, y, 'gato'); cena.add.existing(this); cena.physics.add.existing(this); this.setScale(.2).setOrigin(.5).setCircle(60,68,105).setDepth(4).setFrame(1);
    }
    atualizar(tempo: number, alvo: Phaser.GameObjects.Components.Transform): void {
        const centroAtual=this.paraMundo(this.paraGrade(this.x,this.y));
        const pertoDoCentro=Phaser.Math.Distance.Between(this.x,this.y,centroAtual.x,centroAtual.y)<5;
        if (!this.rota.length || (tempo >= this.proximoCalculo && pertoDoCentro)) {
            const origem = this.paraGrade(this.x, this.y), destino = this.paraGrade(alvo.x, alvo.y);
            this.rota = buscarCaminho(this.mapa, origem, destino); this.proximoCalculo = tempo + 450;
        }
        let passo = this.rota[0];
        if (!passo) { this.setVelocity(0); this.anims.stop(); return; }
        let destino = this.paraMundo(passo);
        if (Phaser.Math.Distance.Between(this.x, this.y, destino.x, destino.y) < 4) {
            this.setPosition(destino.x,destino.y);
            this.rota.shift(); passo=this.rota[0];
            if(!passo){this.setVelocity(0);this.anims.stop();return;}
            destino=this.paraMundo(passo);
        }
        this.scene.physics.moveTo(this, destino.x, destino.y, this.velocidade);
        const vx=this.body!.velocity.x, vy=this.body!.velocity.y;
        const direcao=Math.abs(vy)>=Math.abs(vx)?(vy>0?'frente':'costas'):(vx>0?'direita':'esquerda');
        this.play(`gato-${direcao}`,true);
    }
    afastar(posicao: PosicaoGrade): void { const p = this.paraMundo(posicao); this.setPosition(p.x,p.y).setVelocity(0); this.rota=[]; this.proximoCalculo=Infinity; this.scene.time.delayedCall(1400,()=>this.proximoCalculo=0); }
    private paraGrade(x:number,y:number): PosicaoGrade { return { coluna: Phaser.Math.Clamp(Math.floor((x-this.esquerda)/this.tamanho),0,this.mapa[0].length-1), linha: Phaser.Math.Clamp(Math.floor((y-this.topo)/this.tamanho),0,this.mapa.length-1) }; }
    private paraMundo(p:PosicaoGrade): {x:number;y:number} { return { x:this.esquerda+p.coluna*this.tamanho+this.tamanho/2, y:this.topo+p.linha*this.tamanho+this.tamanho/2 }; }
}
