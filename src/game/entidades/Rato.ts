import * as Phaser from 'phaser';
import { PosicaoGrade } from '../tipos/jogo';

export class Rato extends Phaser.Physics.Arcade.Sprite {
    private bloqueado=false;
    private movendo=false;
    private posicao:PosicaoGrade;
    private aoPressionar:(evento:KeyboardEvent)=>void;
    private aoSoltar:(evento:KeyboardEvent)=>void;
    private teclasPressionadas:string[]=[];
    private alvo?:{x:number;y:number;linha:number;coluna:number;dl:number;dc:number};
    private direcaoPendente?:[number,number];

    constructor(
        cena:Phaser.Scene,x:number,y:number,private velocidade:number,
        private mapa:number[][],private tamanho:number,private topo:number,private esquerda:number,
        posicaoInicial:PosicaoGrade
    ) {
        super(cena,x,y,'rato');
        cena.add.existing(this); cena.physics.add.existing(this);
        this.setScale(.2).setOrigin(.5).setDepth(5).setFrame(1);
        this.body!.setSize(120,120).setOffset(68,105);
        this.posicao={...posicaoInicial};
        const teclado=cena.input.keyboard!;
        teclado.enabled=true;
        this.aoPressionar=(evento)=>{
            const direcoes:Record<string,[number,number]>= {
                ArrowUp:[-1,0],KeyW:[-1,0],ArrowDown:[1,0],KeyS:[1,0],
                ArrowLeft:[0,-1],KeyA:[0,-1],ArrowRight:[0,1],KeyD:[0,1]
            };
            const direcao=direcoes[evento.code];
            if(!direcao)return;
            evento.preventDefault();
            if(!this.teclasPressionadas.includes(evento.code))this.teclasPressionadas.push(evento.code);
            this.solicitarMovimento(direcao[0],direcao[1]);
        };
        this.aoSoltar=(evento)=>{
            const codigos=['ArrowUp','KeyW','ArrowDown','KeyS','ArrowLeft','KeyA','ArrowRight','KeyD'];
            if(!codigos.includes(evento.code))return;
            evento.preventDefault();
            this.teclasPressionadas=this.teclasPressionadas.filter(codigo=>codigo!==evento.code);
            const direcao=this.direcaoPressionada();
            this.direcaoPendente=direcao;
            if(direcao)this.solicitarMovimento(direcao[0],direcao[1]);
        };
        window.addEventListener('keydown',this.aoPressionar,{passive:false,capture:true});
        window.addEventListener('keyup',this.aoSoltar,{passive:false,capture:true});
        cena.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            window.removeEventListener('keydown',this.aoPressionar,{capture:true});
            window.removeEventListener('keyup',this.aoSoltar,{capture:true});
        });
    }

    atualizar():void {
        if(this.bloqueado){if(!this.movendo)this.anims.stop();return;}
        if(this.movendo&&this.alvo){
            const chegou=this.alvo.dc!==0
                ? (this.alvo.dc>0?this.x>=this.alvo.x:this.x<=this.alvo.x)
                : (this.alvo.dl>0?this.y>=this.alvo.y:this.y<=this.alvo.y);
            if(chegou){
                this.setPosition(this.alvo.x,this.alvo.y);
                this.posicao={linha:this.alvo.linha,coluna:this.alvo.coluna};
                this.alvo=undefined;this.movendo=false;
                const pendente=this.direcaoPendente;this.direcaoPendente=undefined;
                const segurando=this.direcaoPressionada();
                const proxima=pendente??segurando;
                if(proxima&&this.mover(proxima[0],proxima[1]))return;
                this.setVelocity(0);
                this.anims.stop();
            }
            return;
        }
        const direcao=this.direcaoPressionada();
        if(direcao)this.solicitarMovimento(direcao[0],direcao[1]);
    }

    private solicitarMovimento(dl:number,dc:number):void {
        if(this.bloqueado)return;
        if(this.movendo&&this.alvo){
            if(dl===this.alvo.dl&&dc===this.alvo.dc)return;
            if(this.virarImediatamente(dl,dc))return;
            this.direcaoPendente=[dl,dc];return;
        }
        this.mover(dl,dc);
    }

    private virarImediatamente(dl:number,dc:number):boolean {
        if(!this.alvo)return false;
        const origem={...this.posicao};
        const destino={linha:this.alvo.linha,coluna:this.alvo.coluna};
        const centroOrigem={
            x:this.esquerda+origem.coluna*this.tamanho+this.tamanho/2,
            y:this.topo+origem.linha*this.tamanho+this.tamanho/2
        };
        const centroDestino={
            x:this.esquerda+destino.coluna*this.tamanho+this.tamanho/2,
            y:this.topo+destino.linha*this.tamanho+this.tamanho/2
        };
        const distanciaOrigem=Phaser.Math.Distance.Between(this.x,this.y,centroOrigem.x,centroOrigem.y);
        const distanciaDestino=Phaser.Math.Distance.Between(this.x,this.y,centroDestino.x,centroDestino.y);
        const base=distanciaDestino<distanciaOrigem?destino:origem;
        const linha=base.linha+dl,coluna=base.coluna+dc;
        if(this.mapa[linha]?.[coluna]!==0)return false;
        const x=this.esquerda+base.coluna*this.tamanho+this.tamanho/2;
        const y=this.topo+base.linha*this.tamanho+this.tamanho/2;
        this.body!.reset(x,y);this.posicao=base;this.alvo=undefined;this.movendo=false;
        this.direcaoPendente=undefined;
        return this.mover(dl,dc);
    }

    private direcaoPressionada():[number,number]|undefined {
        const direcoes:Record<string,[number,number]>= {
            ArrowUp:[-1,0],KeyW:[-1,0],ArrowDown:[1,0],KeyS:[1,0],
            ArrowLeft:[0,-1],KeyA:[0,-1],ArrowRight:[0,1],KeyD:[0,1]
        };
        const codigo=this.teclasPressionadas[this.teclasPressionadas.length-1];
        return codigo?direcoes[codigo]:undefined;
    }

    private mover(dl:number,dc:number):boolean {
        if(this.bloqueado||this.movendo)return false;
        const linha=this.posicao.linha+dl,coluna=this.posicao.coluna+dc;
        if(this.mapa[linha]?.[coluna]!==0)return false;
        this.movendo=true;
        const direcao=dl!==0?(dl>0?'frente':'costas'):(dc>0?'direita':'esquerda');
        this.play(`rato-${direcao}`,true);
        const x=this.esquerda+coluna*this.tamanho+this.tamanho/2;
        const y=this.topo+linha*this.tamanho+this.tamanho/2;
        this.alvo={x,y,linha,coluna,dl,dc};
        this.setVelocity(dc*this.velocidade,dl*this.velocidade);
        return true;
    }

    definirBloqueado(valor:boolean):void {
        this.bloqueado=valor;
        if(valor){
            this.setVelocity(0);
            const x=this.esquerda+this.posicao.coluna*this.tamanho+this.tamanho/2;
            const y=this.topo+this.posicao.linha*this.tamanho+this.tamanho/2;
            this.body!.reset(x,y);this.alvo=undefined;this.direcaoPendente=undefined;this.teclasPressionadas=[];this.movendo=false;this.anims.stop();
        }
    }
    definirPausado(valor:boolean):void {
        if(valor)this.setVelocity(0);
        else if(this.alvo)this.setVelocity(this.alvo.dc*this.velocidade,this.alvo.dl*this.velocidade);
    }
}
