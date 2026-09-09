import * as Phaser from 'phaser';
import { servicoVoz } from '../../services/ServicoVoz';
import { confirmarSaidaParaEducApp } from '../sistemas/ConfirmacaoSaida';
import { DificuldadeMontaPalavra, PALAVRAS_MONTA_PALAVRA, PalavraMontaPalavra, QUANTIDADE_DISTRATORES } from '../dados/palavrasMontaPalavra';
import { audioJogo } from '../sistemas/SistemaAudio';
import { mostrarModalConclusao } from '../sistemas/ModalConclusao';
import { botaoRaster, circuloRaster, painelRaster } from '../sistemas/ArteRaster';

interface PecaSilaba extends Phaser.GameObjects.Container {silaba:string;inicioX:number;inicioY:number;slot?:number}
interface SlotSilaba {container:Phaser.GameObjects.Container;fundo:Phaser.GameObjects.NineSlice;borda:Phaser.GameObjects.NineSlice;peca?:PecaSilaba}

export class MontaPalavra extends Phaser.Scene {
    private indice=0;
    private dificuldade:DificuldadeMontaPalavra='facil';
    private desafio!:PalavraMontaPalavra;
    private slots:SlotSilaba[]=[];
    private pecas:PecaSilaba[]=[];
    private feedback!:Phaser.GameObjects.Container;
    private concluido=false;
    private textoAlvo!:Phaser.GameObjects.Text;

    constructor(){super('MontaPalavra');}
    init(dados:{indice?:number;dificuldade?:DificuldadeMontaPalavra}):void {this.indice=dados.indice??0;this.dificuldade=dados.dificuldade??'facil';}

    create():void {
        this.desafio=PALAVRAS_MONTA_PALAVRA[this.indice%PALAVRAS_MONTA_PALAVRA.length];this.slots=[];this.pecas=[];this.concluido=false;
        this.add.image(480,320,'minijogos-fundo').setDisplaySize(960,640);
        [[45,65,110,0xe3b65e,.1],[920,570,156,0xe3b65e,.1],[900,65,116,0xffffff,.24],[60,575,144,0xffffff,.24]].forEach(([x,y,d,cor,a])=>circuloRaster(this,x,y,d,cor,a));
        const voltar=this.botao(76,26,124,36,'‹  EDUCAPP',0x96713b,12);voltar.on('pointerdown',()=>confirmarSaidaParaEducApp(this));
        this.add.text(480,34,'MontaPalavra',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'32px',fontStyle:'bold',color:'#6e522d'}).setOrigin(.5);
        this.add.text(884,34,`${this.indice+1} / ${PALAVRAS_MONTA_PALAVRA.length}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#816f54'}).setOrigin(1,.5);
        this.add.text(884,58,this.desafio.tema.toLocaleUpperCase('pt-BR'),{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'9px',color:'#8a775a',backgroundColor:'#f2e6c9',padding:{x:8,y:3}}).setOrigin(1,.5);
        this.criarSeletorDificuldade();

        const alvo=this.dificuldade==='dificil'?'OUÇA E DESCUBRA':this.desafio.palavra;
        this.textoAlvo=this.add.text(480,121,alvo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:this.dificuldade==='dificil'?'17px':'42px',fontStyle:'bold',color:'#76552d',letterSpacing:this.dificuldade==='dificil'?1:3}).setOrigin(.5);
        const ouvir=this.botao(480,166,190,43,'▶  OUVIR',0x518cb5,15);ouvir.on('pointerdown',()=>this.ouvir());
        if(this.dificuldade==='dificil'){const dica=this.botao(690,166,120,37,'DICA',0xb58b4f,11);dica.on('pointerdown',()=>{this.textoAlvo.setText(this.desafio.palavra).setFontSize(30);this.time.delayedCall(1400,()=>this.textoAlvo.setText('OUÇA E DESCUBRA').setFontSize(17));});}
        this.add.text(480,207,'ARRASTE AS SÍLABAS PARA OS ESPAÇOS',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#89775d',letterSpacing:1}).setOrigin(.5);
        this.criarSlots();this.criarPecas();
        for(let i=0;i<PALAVRAS_MONTA_PALAVRA.length;i++)circuloRaster(this,480+(i-(PALAVRAS_MONTA_PALAVRA.length-1)/2)*16,527,10,i===this.indice?0xc58b3c:0xd8c9aa);
        this.feedback=this.add.container(480,557).setAlpha(0);
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>servicoVoz.parar());
        this.time.delayedCall(420,()=>this.ouvir());
        if(this.dificuldade!=='dificil')this.time.delayedCall(6500,()=>this.mostrarDicaGradativa());
    }

    private criarSeletorDificuldade():void {
        const opcoes:{valor:DificuldadeMontaPalavra;rotulo:string}[]=[{valor:'facil',rotulo:'FÁCIL'},{valor:'medio',rotulo:'MÉDIO'},{valor:'dificil',rotulo:'DIFÍCIL'}];
        opcoes.forEach((op,i)=>{const ativo=op.valor===this.dificuldade,c=this.botao(363+i*117,78,105,31,op.rotulo,ativo?0xc58b3c:0xcfc4ad,11);c.setAlpha(ativo?1:.72);c.on('pointerdown',()=>{if(op.valor!==this.dificuldade)this.scene.restart({indice:this.indice,dificuldade:op.valor});});});
    }

    private criarSlots():void {
        const quantidade=this.desafio.silabas.length,largura=quantidade===2?150:130,espaco=18,total=quantidade*largura+(quantidade-1)*espaco;
        this.desafio.silabas.forEach((_silaba,i)=>{const x=480-total/2+largura/2+i*(largura+espaco),container=this.add.container(x,274).setSize(largura,74),borda=painelRaster(this,0,0,largura,74,0xc9b98f,.55),fundo=painelRaster(this,0,0,largura-6,68,0xf7f2e5);container.add([borda,fundo]);this.slots.push({container,fundo,borda});this.desenharSlot(i,'vazio');});
    }

    private criarPecas():void {
        const extras=this.desafio.distratores.slice(0,QUANTIDADE_DISTRATORES[this.dificuldade]),silabas=Phaser.Utils.Array.Shuffle([...this.desafio.silabas,...extras]);
        const largura=112,espaco=14,porLinha=Math.min(6,silabas.length),total=porLinha*largura+(porLinha-1)*espaco;
        silabas.forEach((silaba,i)=>{const linha=Math.floor(i/6),coluna=i%6,x=480-total/2+largura/2+coluna*(largura+espaco),y=402+linha*82,peca=this.criarPeca(x,y,silaba);this.pecas.push(peca);});
    }

    private criarPeca(x:number,y:number,silaba:string):PecaSilaba {
        const p=this.add.container(x,y).setSize(112,62).setInteractive({useHandCursor:true}) as PecaSilaba;p.silaba=silaba;p.inicioX=x;p.inicioY=y;
        p.add([painelRaster(this,0,5,112,62,0x68491f,.18),painelRaster(this,0,0,116,66,0xd69b36,.8),painelRaster(this,0,0,110,60,0xffd978),this.add.text(0,-1,silaba,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'27px',fontStyle:'bold',color:'#69491f'}).setOrigin(.5)]);
        this.input.setDraggable(p);p.on('pointerdown',()=>servicoVoz.falar(silaba));p.on('dragstart',()=>this.iniciarArraste(p));p.on('drag',(_pointer:Phaser.Input.Pointer,dx:number,dy:number)=>this.arrastarPeca(p,dx,dy));p.on('dragend',()=>this.soltarPeca(p));return p;
    }

    private iniciarArraste(peca:PecaSilaba):void {if(this.concluido)return;if(peca.slot!==undefined){const anterior=peca.slot;this.slots[anterior].peca=undefined;peca.slot=undefined;this.desenharSlot(anterior,'vazio');}this.children.bringToTop(peca);this.tweens.add({targets:peca,scale:1.08,duration:90});this.ocultarFeedback();}
    private arrastarPeca(peca:PecaSilaba,x:number,y:number):void {peca.setPosition(x,y);this.slots.forEach((slot,i)=>{const perto=Phaser.Math.Distance.Between(x,y,slot.container.x,slot.container.y)<95;slot.container.setScale(perto?1.07:1);if(!slot.peca)this.desenharSlot(i,perto?'ocupado':'vazio');});}
    private soltarPeca(peca:PecaSilaba):void {if(this.concluido)return;this.slots.forEach(slot=>slot.container.setScale(1));const destino=this.slots.findIndex(slot=>Phaser.Math.Distance.Between(peca.x,peca.y,slot.container.x,slot.container.y)<95);if(destino>=0){const deslocada=this.slots[destino].peca;if(deslocada&&deslocada!==peca){deslocada.slot=undefined;this.tweens.add({targets:deslocada,x:deslocada.inicioX,y:deslocada.inicioY,scale:1,duration:190,ease:'Sine.Out'});}this.slots[destino].peca=peca;peca.slot=destino;this.tweens.add({targets:peca,x:this.slots[destino].container.x,y:this.slots[destino].container.y,scale:1,duration:170,ease:'Back.Out',onComplete:()=>{this.falarComposicaoParcial();this.verificarPreenchimento();}});this.desenharSlot(destino,'ocupado');}else this.tweens.add({targets:peca,x:peca.inicioX,y:peca.inicioY,scale:1,duration:210,ease:'Sine.Out'});}
    private falarComposicaoParcial():void {const preenchidas=this.slots.map(slot=>slot.peca?.silaba).filter((s):s is string=>Boolean(s));if(preenchidas.length)servicoVoz.falar(preenchidas.join('... '));}
    private mostrarDicaGradativa():void {if(this.concluido||this.slots.every(s=>s.peca))return;const indice=this.slots.findIndex(s=>!s.peca),correta=this.desafio.silabas[indice],peca=this.pecas.find(p=>p.silaba===correta&&p.slot===undefined);if(peca)this.tweens.add({targets:peca,scale:1.14,alpha:.68,yoyo:true,repeat:4,duration:280,ease:'Sine.InOut'});}

    private verificarPreenchimento():void {if(this.slots.some(slot=>!slot.peca))return;const correto=this.slots.every((slot,i)=>slot.peca?.silaba===this.desafio.silabas[i]);if(correto)this.acertou();else{this.slots.forEach((slot,i)=>this.desenharSlot(i,slot.peca?.silaba===this.desafio.silabas[i]?'correto':'incorreto'));this.mostrarFeedback('QUASE! MUDE AS PEÇAS VERMELHAS',0xc36a55,false);}}
    private acertou():void {this.concluido=true;this.pecas.forEach(peca=>this.input.setDraggable(peca,false));this.slots.forEach((_slot,i)=>this.desenharSlot(i,'correto'));audioJogo.efeito('vitoria');this.tweens.add({targets:this.slots.map(s=>s.container),scale:1.1,yoyo:true,duration:220,ease:'Back.Out'});servicoVoz.falar(this.desafio.palavra);this.mostrarFeedback(`${this.desafio.silabas.join(' + ')}  =  ${this.desafio.palavra}`,0x39966b,true);}
    private mostrarFeedback(texto:string,cor:number,proximo:boolean):void {this.feedback.removeAll(true);const largura=proximo?550:430;this.feedback.add([painelRaster(this,0,0,largura+6,66,cor,.55),painelRaster(this,0,0,largura,60,0xffffff,.98),this.add.text(proximo?-70:0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:proximo?'19px':'13px',fontStyle:'bold',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5)]);if(proximo){const ultimo=this.indice+1>=PALAVRAS_MONTA_PALAVRA.length,botao=this.botao(185,0,150,42,ultimo?'CONCLUIR  ✓':'PRÓXIMO  ›',cor,14);this.feedback.add(botao);botao.on('pointerdown',()=>{if(ultimo){const dificuldades:DificuldadeMontaPalavra[]=['facil','medio','dificil'],outra=dificuldades[(dificuldades.indexOf(this.dificuldade)+1)%dificuldades.length];mostrarModalConclusao(this,{titulo:'PALAVRAS CONCLUÍDAS!',mensagem:`Você montou as ${PALAVRAS_MONTA_PALAVRA.length} palavras deste desafio.`,cor:0xc58b3c,aoJogarNovamente:()=>this.scene.restart({indice:0,dificuldade:this.dificuldade}),aoOutroNivel:()=>this.scene.restart({indice:0,dificuldade:outra})});}else this.scene.restart({indice:this.indice+1,dificuldade:this.dificuldade});});}this.feedback.setAlpha(0).setScale(.9);this.tweens.add({targets:this.feedback,alpha:1,scale:1,duration:180,ease:'Back.Out'});}
    private ocultarFeedback():void {if(this.feedback)this.feedback.setAlpha(0);this.slots.forEach((_slot,i)=>this.desenharSlot(i,this.slots[i].peca?'ocupado':'vazio'));}
    private desenharSlot(indice:number,estado:'vazio'|'ocupado'|'correto'|'incorreto'):void {const slot=this.slots[indice],cores={vazio:[0xf7f2e5,0xc9b98f],ocupado:[0xfff4ca,0xd6a94f],correto:[0xd9f2e4,0x4ca777],incorreto:[0xf8ddd7,0xd06a5b]}[estado];slot.fundo.setTint(cores[0]);slot.borda.setTint(cores[1]).setAlpha(estado==='vazio'?.55:.9);}
    private ouvir():void {servicoVoz.falar(this.desafio.palavra);}
    private botao(x:number,y:number,w:number,h:number,texto:string,cor:number,tamanho:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setSize(w,h).setInteractive({useHandCursor:true});c.add([botaoRaster(this,0,4,w,h,0x594321,.16),botaoRaster(this,0,0,w,h,cor),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:`${tamanho}px`,color:'#ffffff'}).setOrigin(.5)]);c.on('pointerover',()=>this.tweens.add({targets:c,scale:1.035,duration:90}));c.on('pointerout',()=>this.tweens.add({targets:c,scale:1,duration:90}));return c;}
}
