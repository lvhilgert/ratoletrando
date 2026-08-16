import * as Phaser from 'phaser';
import { audioJogo } from '../sistemas/SistemaAudio';
import { ASSOCIACOES_MEMO_LETRAS, DificuldadeMemoLetras, ItemAssociacao, PARES_POR_DIFICULDADE, RegraAssociacao } from '../dados/associacoesMemoLetras';
import { servicoVoz } from '../../services/ServicoVoz';
import { confirmarSaidaParaEducApp } from '../sistemas/ConfirmacaoSaida';

interface Carta extends Phaser.GameObjects.Container {grupo:string;item:ItemAssociacao;aberta:boolean;encontrada:boolean;frente:Phaser.GameObjects.Container;verso:Phaser.GameObjects.Container}

export class MemoLetras extends Phaser.Scene {
    private dificuldade:DificuldadeMemoLetras='inicial';
    private cartas:Carta[]=[];
    private primeira?:Carta;
    private bloqueado=false;
    private encontrados=0;
    private progresso!:Phaser.GameObjects.Text;
    private feedback!:Phaser.GameObjects.Container;
    private paresEncontrados:string[]=[];
    private sequencia=0;
    private timerPrimeira?:Phaser.Time.TimerEvent;
    private timerFeedback?:Phaser.Time.TimerEvent;

    constructor(){super('MemoLetras');}
    init(dados:{dificuldade?:DificuldadeMemoLetras}):void {this.dificuldade=dados.dificuldade??'inicial';}

    create():void {
        this.cartas=[];this.primeira=undefined;this.bloqueado=false;this.encontrados=0;this.paresEncontrados=[];this.sequencia=0;this.timerPrimeira=undefined;this.timerFeedback=undefined;
        this.add.graphics().fillGradientStyle(0xf6f2fb,0xf6f2fb,0xe1e8f2,0xe1e8f2,1).fillRect(0,0,960,640);
        const decor=this.add.graphics().setAlpha(.25);decor.fillStyle(0xa58ac8,.35).fillCircle(45,65,55).fillCircle(925,575,80).fillStyle(0xffffff,.85).fillCircle(900,65,58).fillCircle(55,575,70);
        const voltar=this.botao(76,26,124,36,'‹  EDUCAPP',0x74649d,12);voltar.on('pointerdown',()=>confirmarSaidaParaEducApp(this));
        this.add.text(480,31,'MemóLetras',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'32px',fontStyle:'bold',color:'#554878'}).setOrigin(.5);
        this.progresso=this.add.text(884,31,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#706887'}).setOrigin(1,.5);
        this.criarSeletorDificuldade();
        this.add.text(480,112,ASSOCIACOES_MEMO_LETRAS.titulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'15px',fontStyle:'bold',color:'#665c7e',letterSpacing:1}).setOrigin(.5);
        this.add.text(480,136,'Encontre duas palavras que começam igual',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',color:'#7f778d'}).setOrigin(.5);
        this.criarCartas();
        this.feedback=this.add.container(480,594).setDepth(20).setAlpha(0);
        this.atualizarProgresso();
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>servicoVoz.parar());
        this.time.delayedCall(320,()=>servicoVoz.falar('Encontre duas palavras que começam com o mesmo som.'));
    }

    private criarSeletorDificuldade():void {
        const opcoes:{valor:DificuldadeMemoLetras;rotulo:string}[]=[{valor:'inicial',rotulo:'3 PARES'},{valor:'intermediario',rotulo:'4 PARES'},{valor:'avancado',rotulo:'6 PARES'}];
        opcoes.forEach((op,i)=>{const ativo=op.valor===this.dificuldade,b=this.botao(363+i*117,76,105,31,op.rotulo,ativo?0x8069ad:0xb7afc5,10);b.setAlpha(ativo?1:.72);b.on('pointerdown',()=>{if(op.valor!==this.dificuldade)this.scene.restart({dificuldade:op.valor});});});
    }

    private criarCartas():void {
        const pares=Phaser.Utils.Array.Shuffle([...ASSOCIACOES_MEMO_LETRAS.pares]).slice(0,PARES_POR_DIFICULDADE[this.dificuldade]);
        const base=pares.flatMap(par=>par.itens.map(item=>({grupo:par.grupo,item})));let itens=[...base];for(let tentativa=0;tentativa<20;tentativa++){itens=Phaser.Utils.Array.Shuffle([...base]);const colunasTeste=itens.length===6?3:4,adjacente=itens.some((item,i)=>itens.some((outro,j)=>j>i&&item.grupo===outro.grupo&&Math.abs(i%colunasTeste-j%colunasTeste)+Math.abs(Math.floor(i/colunasTeste)-Math.floor(j/colunasTeste))===1));if(!adjacente)break;}
        const total=itens.length,colunas=total===6?3:4,linhas=Math.ceil(total/colunas),largura=total===6?190:total===8?160:145,altura=total===12?105:130,espacoX=20,espacoY=18;
        const totalW=colunas*largura+(colunas-1)*espacoX,totalH=linhas*altura+(linhas-1)*espacoY,inicioY=160+(355-totalH)/2;
        itens.forEach((dados,i)=>{const coluna=i%colunas,linha=Math.floor(i/colunas),x=480-totalW/2+largura/2+coluna*(largura+espacoX),y=inicioY+altura/2+linha*(altura+espacoY),carta=this.criarCarta(x,y,largura,altura,dados.grupo,dados.item);this.cartas.push(carta);});
    }

    private criarCarta(x:number,y:number,w:number,h:number,grupo:string,item:ItemAssociacao):Carta {
        const carta=this.add.container(x,y).setSize(w,h).setInteractive({useHandCursor:true}) as Carta;carta.grupo=grupo;carta.item=item;carta.aberta=false;carta.encontrada=false;
        carta.verso=this.add.container(0,0);carta.verso.add([this.add.graphics().fillStyle(0x493c68,.18).fillRoundedRect(-w/2,-h/2+6,w,h,20).fillStyle(0x8069ad,1).fillRoundedRect(-w/2,-h/2,w,h,20).lineStyle(4,0xffffff,.65).strokeRoundedRect(-w/2+4,-h/2+4,w-8,h-8,17),this.add.circle(0,0,27,0xffffff,.14).setStrokeStyle(3,0xffffff,.45),this.add.text(0,0,'A',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'30px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5)]);
        carta.frente=this.add.container(0,0).setVisible(false);const tamanhoFonte=item.texto.length>6?18:23;const fundoFrente=this.add.graphics().fillStyle(0x51446a,.14).fillRoundedRect(-w/2,-h/2+6,w,h,20).fillStyle(0xffffff,1).fillRoundedRect(-w/2,-h/2,w,h,20).lineStyle(3,0xa891c7,.65).strokeRoundedRect(-w/2,-h/2,w,h,20);const[letraInicial,restoPalavra]=this.criarTextoPalavra(item.texto,tamanhoFonte);carta.frente.add([fundoFrente,letraInicial,restoPalavra]);
        carta.add([carta.verso,carta.frente]);carta.on('pointerover',()=>{if(!carta.aberta)this.tweens.add({targets:carta,y:y-4,scale:1.025,duration:90});});carta.on('pointerout',()=>this.tweens.add({targets:carta,y,scale:1,duration:90}));carta.on('pointerdown',()=>this.selecionar(carta));return carta;
    }

    private criarTextoPalavra(texto:string,tamanhoFonte:number):[Phaser.GameObjects.Text,Phaser.GameObjects.Text] {
        const estilo={fontFamily:'Arial Rounded MT Bold, Arial',fontSize:`${tamanhoFonte}px`,fontStyle:'bold'};
        const letraInicial=this.add.text(0,0,texto.charAt(0),{...estilo,color:'#d3352b'}).setOrigin(0,.5);
        const restante=this.add.text(0,0,texto.slice(1),{...estilo,color:'#51436f'}).setOrigin(0,.5);
        const largura=letraInicial.width+restante.width;
        letraInicial.x=-largura/2; restante.x=letraInicial.x+letraInicial.width;
        return [letraInicial,restante];
    }
    private selecionar(carta:Carta):void {
        if(this.bloqueado||carta.aberta||carta.encontrada)return;this.bloqueado=true;this.virar(carta,true,()=>{audioJogo.efeito('bolinha');servicoVoz.falar(carta.item.texto);if(!this.primeira){this.primeira=carta;this.bloqueado=false;this.timerPrimeira=this.time.delayedCall(3000,()=>{if(this.primeira===carta&&!carta.encontrada){this.primeira=undefined;this.bloqueado=true;this.virar(carta,false,()=>{this.bloqueado=false;});}});return;}this.timerPrimeira?.remove(false);const primeira=this.primeira;this.primeira=undefined;if(this.combinam(primeira,carta,ASSOCIACOES_MEMO_LETRAS.regra)){primeira.encontrada=true;carta.encontrada=true;this.encontrados++;this.sequencia++;this.paresEncontrados.push(`${primeira.item.texto} e ${carta.item.texto} começam com ${carta.grupo}`);audioJogo.efeito('letra');this.destacarPar(primeira,carta);this.mostrarFeedback(this.sequencia>=3?`COMBO ${this.sequencia}!  ${primeira.item.texto} + ${carta.item.texto}`:`${primeira.item.texto} + ${carta.item.texto}`,0x4b996b);this.bloqueado=false;this.atualizarProgresso();if(this.encontrados===PARES_POR_DIFICULDADE[this.dificuldade])this.time.delayedCall(550,()=>this.concluir());}else{this.sequencia=0;audioJogo.efeito('erro');this.mostrarFeedback('OBSERVE E TENTE NOVAMENTE',0xa76c72);this.time.delayedCall(1350,()=>this.virar(primeira,false,()=>this.virar(carta,false,()=>{this.bloqueado=false;})));}});}
    private combinam(a:Carta,b:Carta,_regra:RegraAssociacao):boolean {return a.grupo===b.grupo;}
    private virar(carta:Carta,abrir:boolean,aoConcluir:()=>void):void {this.tweens.add({targets:carta,scaleX:0,duration:135,ease:'Sine.In',onComplete:()=>{carta.aberta=abrir;carta.verso.setVisible(!abrir);carta.frente.setVisible(abrir);this.tweens.add({targets:carta,scaleX:1,duration:150,ease:'Sine.Out',onComplete:aoConcluir});}});}
    private destacarPar(a:Carta,b:Carta):void {[a,b].forEach((carta,i)=>{carta.add(this.add.container(carta.width/2-20,-carta.height/2+20,[this.add.circle(0,0,15,0x5a9d70).setStrokeStyle(2,0xffffff),this.add.text(0,0,carta.grupo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#ffffff'}).setOrigin(.5)]));this.tweens.add({targets:carta,scale:1.08,yoyo:true,duration:180,delay:i*60});carta.setAlpha(.9);carta.disableInteractive();});}
    private atualizarProgresso():void {this.progresso.setText(`${this.encontrados} / ${PARES_POR_DIFICULDADE[this.dificuldade]} PARES`);}
    private mostrarFeedback(texto:string,cor:number):void {this.timerFeedback?.remove(false);this.feedback.removeAll(true);this.feedback.add([this.add.graphics().fillStyle(0xffffff,.97).fillRoundedRect(-165,-23,330,46,17).lineStyle(2,cor,.5).strokeRoundedRect(-165,-23,330,46,17),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',fontStyle:'bold',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5)]);this.feedback.setAlpha(1);this.timerFeedback=this.time.delayedCall(850,()=>this.feedback.setAlpha(0));}
    private concluir():void {
        this.timerFeedback?.remove(false);
        audioJogo.efeito('vitoria');
        servicoVoz.falar(`Parabéns! Você encontrou todos os pares! ${this.paresEncontrados.join('. ')}`);
        const fundo=this.add.rectangle(480,320,960,640,0x241c38,.5).setDepth(19).setInteractive();
        this.feedback.setDepth(21).setPosition(480,320);
        this.feedback.removeAll(true);
        this.feedback.add([
            this.add.graphics().fillStyle(0x2f4d3d,.2).fillRoundedRect(-220,-96,440,198,28),
            this.add.graphics().fillStyle(0xffffff,1).fillRoundedRect(-220,-104,440,198,28).lineStyle(4,0x5c9b72,.75).strokeRoundedRect(-220,-104,440,198,28),
            this.add.star(-118,-60,5,7,15,0xffd84f).setStrokeStyle(2,0xffffff),
            this.add.star(118,-60,5,7,15,0xffd84f).setStrokeStyle(2,0xffffff),
            this.add.text(0,-60,'PARABÉNS!',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'29px',fontStyle:'bold',color:'#3f7a58'}).setOrigin(.5),
            this.add.text(0,-20,`Você encontrou os ${PARES_POR_DIFICULDADE[this.dificuldade]} pares!`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',color:'#5c6f66'}).setOrigin(.5)
        ]);
        const novamente=this.botao(0,44,240,50,'▶  JOGAR DE NOVO',0x5c9270,16);
        this.feedback.add(novamente);
        novamente.on('pointerdown',()=>{fundo.destroy();this.scene.restart({dificuldade:this.dificuldade});});
        this.feedback.setAlpha(0).setScale(.85);
        this.tweens.add({targets:this.feedback,alpha:1,scale:1,duration:280,ease:'Back.Out'});
        this.criarConfeteVitoria();
    }
    private criarConfeteVitoria():void {
        const cores=[0xff6f61,0xffd84f,0x7a45bd,0x4ecb91,0x55b8e8];
        for(let i=0;i<28;i++){
            const p=this.add.rectangle(Phaser.Math.Between(60,900),Phaser.Math.Between(-60,0),Phaser.Math.Between(6,10),Phaser.Math.Between(10,16),Phaser.Utils.Array.GetRandom(cores)).setDepth(22);
            this.tweens.add({targets:p,y:680,angle:Phaser.Math.Between(-360,360),duration:Phaser.Math.Between(1800,2800),delay:Phaser.Math.Between(0,500),onComplete:()=>p.destroy()});
        }
    }
    private botao(x:number,y:number,w:number,h:number,texto:string,cor:number,tamanho:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setSize(w,h).setInteractive({useHandCursor:true});c.add([this.add.graphics().fillStyle(0x403552,.15).fillRoundedRect(-w/2,-h/2+4,w,h,h/2).fillStyle(cor,1).fillRoundedRect(-w/2,-h/2,w,h,h/2),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:`${tamanho}px`,color:'#ffffff'}).setOrigin(.5)]);c.on('pointerover',()=>this.tweens.add({targets:c,scale:1.035,duration:90}));c.on('pointerout',()=>this.tweens.add({targets:c,scale:1,duration:90}));return c;}
}
