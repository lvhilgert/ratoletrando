import * as Phaser from 'phaser';
import { PosicaoGrade } from '../tipos/jogo';

export class Rato extends Phaser.Physics.Arcade.Sprite {
    private bloqueado=false;
    private pausado=false;
    private movendo=false;
    private posicao:PosicaoGrade;
    private aoPressionar:(evento:KeyboardEvent)=>void;
    private aoSoltar:(evento:KeyboardEvent)=>void;
    private aoTocar:(ponteiro:Phaser.Input.Pointer)=>void;
    private aoArrastar:(ponteiro:Phaser.Input.Pointer)=>void;
    private aoSoltarToque:()=>void;
    private teclasPressionadas:string[]=[];
    private alvo?:{x:number;y:number;linha:number;coluna:number;dl:number;dc:number};
    private direcaoPendente?:[number,number];
    private caminhoToque:[number,number][]=[];
    private ultimaCelulaApontada?:string;

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
        this.aoTocar=(ponteiro)=>this.atualizarDestinoDoPonteiro(ponteiro);
        this.aoArrastar=(ponteiro)=>{
            if(ponteiro.isDown)this.atualizarDestinoDoPonteiro(ponteiro);
        };
        this.aoSoltarToque=()=>{this.ultimaCelulaApontada=undefined;};
        window.addEventListener('keydown',this.aoPressionar,{passive:false,capture:true});
        window.addEventListener('keyup',this.aoSoltar,{passive:false,capture:true});
        cena.input.on('pointerdown',this.aoTocar);
        cena.input.on('pointermove',this.aoArrastar);
        cena.input.on('pointerup',this.aoSoltarToque);
        cena.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            window.removeEventListener('keydown',this.aoPressionar,{capture:true});
            window.removeEventListener('keyup',this.aoSoltar,{capture:true});
            cena.input.off('pointerdown',this.aoTocar);
            cena.input.off('pointermove',this.aoArrastar);
            cena.input.off('pointerup',this.aoSoltarToque);
        });
    }

    private atualizarDestinoDoPonteiro(ponteiro:Phaser.Input.Pointer):void {
        if(this.bloqueado||this.pausado)return;
        const coluna=Math.floor((ponteiro.worldX-this.esquerda)/this.tamanho);
        const linha=Math.floor((ponteiro.worldY-this.topo)/this.tamanho);
        if(this.mapa[linha]?.[coluna]!==0)return;
        const celula=`${linha},${coluna}`;
        if(celula===this.ultimaCelulaApontada)return;
        this.ultimaCelulaApontada=celula;
        this.definirDestino({linha,coluna});
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
                const proxima=pendente??segurando??this.caminhoToque.shift();
                if(proxima&&this.mover(proxima[0],proxima[1]))return;
                this.caminhoToque=[];
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
        this.caminhoToque=[];
        if(this.movendo&&this.alvo){
            if(dl===this.alvo.dl&&dc===this.alvo.dc)return;
            if(this.virarImediatamente(dl,dc))return;
            this.direcaoPendente=[dl,dc];return;
        }
        this.mover(dl,dc);
    }

    private definirDestino(destino:PosicaoGrade):void {
        // Se já está entre células, termina o passo atual antes de iniciar a rota tocada.
        const inicio=this.movendo&&this.alvo
            ? {linha:this.alvo.linha,coluna:this.alvo.coluna}
            : {...this.posicao};
        const caminho=this.encontrarCaminho(inicio,destino);
        if(!caminho)return;
        this.direcaoPendente=undefined;
        this.caminhoToque=caminho;
        if(!this.movendo){
            const primeira=this.caminhoToque.shift();
            if(primeira)this.mover(primeira[0],primeira[1]);
        }
    }

    private encontrarCaminho(inicio:PosicaoGrade,destino:PosicaoGrade):[number,number][]|undefined {
        if(inicio.linha===destino.linha&&inicio.coluna===destino.coluna)return [];
        const direcoes:[number,number][]=[[-1,0],[1,0],[0,-1],[0,1]];
        const chave=(p:PosicaoGrade)=>`${p.linha},${p.coluna}`;
        const fila:PosicaoGrade[]=[inicio],anteriores=new Map<string,{posicao:PosicaoGrade;direcao:[number,number]}>();
        const visitados=new Set<string>([chave(inicio)]);
        while(fila.length){
            const atual=fila.shift()!;
            for(const direcao of direcoes){
                const proxima={linha:atual.linha+direcao[0],coluna:atual.coluna+direcao[1]};
                const id=chave(proxima);
                if(this.mapa[proxima.linha]?.[proxima.coluna]!==0||visitados.has(id))continue;
                visitados.add(id);anteriores.set(id,{posicao:atual,direcao});
                if(proxima.linha===destino.linha&&proxima.coluna===destino.coluna){
                    const caminho:[number,number][]=[];
                    let cursor=proxima;
                    while(chave(cursor)!==chave(inicio)){
                        const passo=anteriores.get(chave(cursor))!;
                        caminho.unshift(passo.direcao);cursor=passo.posicao;
                    }
                    return caminho;
                }
                fila.push(proxima);
            }
        }
        return undefined;
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
            this.body!.reset(x,y);this.alvo=undefined;this.direcaoPendente=undefined;this.caminhoToque=[];this.teclasPressionadas=[];this.movendo=false;this.anims.stop();
        }
    }
    definirPausado(valor:boolean):void {
        this.pausado=valor;
        if(valor)this.setVelocity(0);
        else if(this.alvo)this.setVelocity(this.alvo.dc*this.velocidade,this.alvo.dl*this.velocidade);
    }
}
