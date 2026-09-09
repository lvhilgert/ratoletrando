import * as Phaser from 'phaser';
import { servicoVoz } from '../../services/ServicoVoz';
import { EXERCICIOS_OUVI_ESCREVI, ExercicioEscrita } from '../dados/exerciciosOuviEscrevi';
import { audioJogo } from '../sistemas/SistemaAudio';
import { confirmarSaidaParaEducApp } from '../sistemas/ConfirmacaoSaida';
import { mostrarModalConclusao } from '../sistemas/ModalConclusao';
import { barraRaster, botaoRaster, circuloRaster, painelRaster } from '../sistemas/ArteRaster';

interface Ponto {x:number;y:number}

export class OuviEscrevi extends Phaser.Scene {
    private indice=0;
    private exercicio!:ExercicioEscrita;
    private tracos:Ponto[][]=[];
    private tracoAtual?:Ponto[];
    private ponteiroAtivo?:number;
    private desenho!:Phaser.GameObjects.Graphics;
    private textoModo!:Phaser.GameObjects.Text;
    private textoProgresso!:Phaser.GameObjects.Text;
    private resposta!:Phaser.GameObjects.Container;
    private botaoAcao!:Phaser.GameObjects.Container;
    private textoAcao!:Phaser.GameObjects.Text;
    private conferido=false;
    private espessura=12;
    private modelo!:Phaser.GameObjects.Text;
    private modeloVisivel=false;
    private confirmarLimpeza=false;
    private lapisCursor!:Phaser.GameObjects.Image;
    private readonly area={x:70,y:166,largura:820,altura:300};

    constructor(){super('OuviEscrevi');}

    create():void {
        this.indice=0;this.tracos=[];this.conferido=false;
        this.cameras.main.setBackgroundColor(0xeaf5f3);
        this.add.image(480,320,'minijogos-fundo').setDisplaySize(960,640);
        [[45,70,96,0x9ed7cf,.12],[925,580,152,0x9ed7cf,.12],[900,75,120,0xffffff,.26],[55,575,132,0xffffff,.26]].forEach(([x,y,d,cor,a])=>circuloRaster(this,x,y,d,cor,a));

        const voltar=this.criarBotao(74,22,120,36,'‹  EDUCAPP',0x397b70,12);
        voltar.on('pointerdown',()=>confirmarSaidaParaEducApp(this));
        this.add.text(480,31,'Ouvi e Escrevi',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'31px',fontStyle:'bold',color:'#2b665d'}).setOrigin(.5);
        this.textoModo=this.add.text(480,67,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#ffffff',backgroundColor:'#4c978b',padding:{x:12,y:5}}).setOrigin(.5);
        this.textoProgresso=this.add.text(880,32,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#55776f'}).setOrigin(1,.5);
        this.add.text(480,98,'Ouça e escreva na área abaixo',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',color:'#607b75'}).setOrigin(.5);

        const ouvir=this.add.container(480,132).setSize(190,52).setInteractive({useHandCursor:true});
        ouvir.add([circuloRaster(this,-58,3,50,0x397fbb,.18),botaoRaster(this,0,0,182,46,0x438ecb),this.add.text(0,0,'▶  OUVIR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',color:'#ffffff'}).setOrigin(.5)]);
        ouvir.on('pointerover',()=>this.tweens.add({targets:ouvir,scale:1.04,duration:100}));ouvir.on('pointerout',()=>this.tweens.add({targets:ouvir,scale:1,duration:100}));ouvir.on('pointerdown',()=>{this.tweens.add({targets:ouvir,scale:.95,yoyo:true,duration:70});this.ouvir();});

        painelRaster(this,this.area.x+this.area.largura/2+3,this.area.y+this.area.altura/2+7,this.area.largura,this.area.altura,0x315e54,.13);painelRaster(this,this.area.x+this.area.largura/2,this.area.y+this.area.altura/2,this.area.largura+6,this.area.altura+6,0x8bc8be,.7);painelRaster(this,this.area.x+this.area.largura/2,this.area.y+this.area.altura/2,this.area.largura,this.area.altura,0xffffff);
        barraRaster(this,480,316,760,2,0xb9dcd6,.35);barraRaster(this,480,405,760,2,0xb9dcd6,.35);
        this.add.text(480,183,'ESCREVA AQUI',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#a2bcb6',letterSpacing:1.5}).setOrigin(.5);
        this.modelo=this.add.text(480,322,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'150px',fontStyle:'bold',color:'#82aaa2',stroke:'#82aaa2',strokeThickness:2,align:'center'}).setOrigin(.5).setAlpha(0);
        // raster-exception: traço livre produzido pela própria criança.
        this.desenho=this.add.graphics().setDepth(5);
        const zona=this.add.zone(this.area.x,this.area.y,this.area.largura,this.area.altura).setOrigin(0).setInteractive({useHandCursor:false});
        zona.on('pointerdown',(p:Phaser.Input.Pointer)=>this.iniciarTraco(p));this.input.on('pointermove',(p:Phaser.Input.Pointer)=>this.continuarTraco(p));this.input.on('pointerup',(p:Phaser.Input.Pointer)=>this.finalizarTraco(p));this.input.on('pointerupoutside',(p:Phaser.Input.Pointer)=>this.finalizarTraco(p));

        this.resposta=this.add.container(480,502).setAlpha(0);
        const limpar=this.criarBotao(88,558,140,45,'APAGAR TUDO',0x718a84,11);limpar.on('pointerdown',()=>{if(!this.tracos.length)return;if(!this.confirmarLimpeza){this.confirmarLimpeza=true;(limpar.getData('texto') as Phaser.GameObjects.Text).setText('CONFIRMAR?');this.time.delayedCall(1500,()=>{this.confirmarLimpeza=false;(limpar.getData('texto') as Phaser.GameObjects.Text).setText('APAGAR TUDO');});return;}this.confirmarLimpeza=false;(limpar.getData('texto') as Phaser.GameObjects.Text).setText('APAGAR TUDO');this.apagarTudo();});
        const desfazer=this.criarBotao(268,558,145,45,'↶  DESFAZER',0x718a84,12);desfazer.on('pointerdown',()=>this.desfazer());
        const modelo=this.criarBotao(422,558,135,45,'MODELO',0x679a91,11);modelo.on('pointerdown',()=>{this.modeloVisivel=!this.modeloVisivel;this.modelo.setAlpha(this.modeloVisivel?.16:0);});
        const grossura=this.criarBotao(560,558,120,45,'TRAÇO  ●',0x617f98,11);grossura.on('pointerdown',()=>{this.espessura=this.espessura===12?18:this.espessura===18?8:12;(grossura.getData('texto') as Phaser.GameObjects.Text).setText(this.espessura===8?'TRAÇO  •':this.espessura===12?'TRAÇO  ●':'TRAÇO  ⬤');this.redesenhar();});
        this.botaoAcao=this.criarBotao(765,558,210,54,'CONFERIR  ✓',0x2e9b69,17);this.textoAcao=this.botaoAcao.getData('texto') as Phaser.GameObjects.Text;this.botaoAcao.on('pointerdown',()=>this.acaoPrincipal());
        const partes=this.criarBotao(820,126,150,38,'OUVIR PARTES',0x5e86aa,11);partes.on('pointerdown',()=>servicoVoz.falar(this.exercicio.partes.join('... '),{obrigatoria:true}));
        const lento=this.criarBotao(140,126,145,38,'OUVIR DEVAGAR',0x668ba7,10);lento.on('pointerdown',()=>servicoVoz.falar(this.exercicio.conteudo,{velocidade:.75,obrigatoria:true}));

        this.criarCursorLapis();
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{servicoVoz.parar();this.input.removeAllListeners();this.input.setDefaultCursor('');});
        this.carregarExercicio();
    }

    private carregarExercicio():void {
        this.exercicio=EXERCICIOS_OUVI_ESCREVI[this.indice%EXERCICIOS_OUVI_ESCREVI.length];this.conferido=false;this.modeloVisivel=false;this.modelo.setText(this.exercicio.conteudo).setFontSize(this.exercicio.conteudo.length>2?'92px':'150px').setAlpha(0);this.apagarTudo();this.resposta.setAlpha(0);this.textoModo.setText(this.exercicio.tipo.toLocaleUpperCase('pt-BR'));this.textoProgresso.setText(`${this.indice+1} / ${EXERCICIOS_OUVI_ESCREVI.length}`);this.textoAcao.setText('CONFERIR  ✓');this.time.delayedCall(420,()=>this.ouvir());
    }
    private ouvir():void {servicoVoz.falar(this.exercicio.conteudo,{obrigatoria:true});}

    private iniciarTraco(p:Phaser.Input.Pointer):void {if(this.conferido||!this.dentroDaArea(p.worldX,p.worldY))return;audioJogo.efeito('bolinha');if('vibrate' in navigator)navigator.vibrate(8);this.ponteiroAtivo=p.id;this.tracoAtual=[{x:p.worldX,y:p.worldY}];this.tracos.push(this.tracoAtual);this.redesenhar();}
    private continuarTraco(p:Phaser.Input.Pointer):void {if(this.ponteiroAtivo!==p.id||!p.isDown||!this.tracoAtual)return;const ponto={x:Phaser.Math.Clamp(p.worldX,this.area.x+3,this.area.x+this.area.largura-3),y:Phaser.Math.Clamp(p.worldY,this.area.y+3,this.area.y+this.area.altura-3)},ultimo=this.tracoAtual[this.tracoAtual.length-1],distancia=Phaser.Math.Distance.Between(ultimo.x,ultimo.y,ponto.x,ponto.y);if(distancia<2)return;const passos=Math.max(1,Math.ceil(distancia/5));for(let i=1;i<=passos;i++)this.tracoAtual.push({x:Phaser.Math.Linear(ultimo.x,ponto.x,i/passos),y:Phaser.Math.Linear(ultimo.y,ponto.y,i/passos)});this.redesenhar();}
    private finalizarTraco(p:Phaser.Input.Pointer):void {if(this.ponteiroAtivo!==p.id)return;this.ponteiroAtivo=undefined;this.tracoAtual=undefined;}
    private dentroDaArea(x:number,y:number):boolean{return x>=this.area.x&&x<=this.area.x+this.area.largura&&y>=this.area.y&&y<=this.area.y+this.area.altura;}
    private redesenhar():void {const raio=this.espessura/2;this.desenho.clear().lineStyle(this.espessura,0x315f87,1);this.tracos.forEach(traco=>{if(!traco.length)return;this.desenho.fillStyle(0x315f87,1).fillCircle(traco[0].x,traco[0].y,raio);for(let i=1;i<traco.length;i++){const a=traco[i-1],b=traco[i];this.desenho.lineBetween(a.x,a.y,b.x,b.y).fillCircle(b.x,b.y,raio);}});}
    private apagarTudo():void {this.tracos=[];this.tracoAtual=undefined;this.ponteiroAtivo=undefined;if(this.desenho)this.desenho.clear();}
    private desfazer():void {if(this.conferido)return;this.tracos.pop();this.redesenhar();}
    private acaoPrincipal():void {if(this.conferido){if(this.indice+1>=EXERCICIOS_OUVI_ESCREVI.length){mostrarModalConclusao(this,{titulo:'ESCRITA CONCLUÍDA!',mensagem:`Você praticou os ${EXERCICIOS_OUVI_ESCREVI.length} exercícios. Parabéns!`,cor:0x3b9070,aoJogarNovamente:()=>this.scene.restart()});return;}this.indice++;this.carregarExercicio();return;}this.conferido=true;servicoVoz.falar(this.exercicio.conteudo,{obrigatoria:true});this.modelo.setAlpha(.16);this.resposta.removeAll(true);this.resposta.add([painelRaster(this,0,0,624,58,0x56ae7e,.55),painelRaster(this,0,0,620,54,0xe1f4e9),this.add.text(-280,0,'MODELO:',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',color:'#347359'}).setOrigin(0,.5),this.add.text(-115,0,this.exercicio.conteudo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'30px',fontStyle:'bold',color:'#245f48'}).setOrigin(.5)]);const tentar=this.criarBotao(190,0,190,38,'TENTAR DE NOVO',0x668b83,11);this.resposta.add(tentar);tentar.on('pointerdown',()=>{this.conferido=false;this.modelo.setAlpha(0);this.modeloVisivel=false;this.resposta.setAlpha(0);this.apagarTudo();this.textoAcao.setText('CONFERIR  ✓');this.ouvir();});this.resposta.setAlpha(0);this.tweens.add({targets:this.resposta,alpha:1,scale:{from:.9,to:1},duration:180,ease:'Back.Out'});this.textoAcao.setText(this.indice+1>=EXERCICIOS_OUVI_ESCREVI.length?'CONCLUIR  ✓':'FICOU PARECIDA?  ›');}

    private criarCursorLapis():void {
        this.input.setDefaultCursor('none');
        this.lapisCursor=this.add.image(this.input.activePointer.x,this.input.activePointer.y,'detetive-objetos',0).setDisplaySize(42,52).setOrigin(.22,.85).setDepth(1000).setScrollFactor(0);
        this.input.on('pointermove',(p:Phaser.Input.Pointer)=>this.lapisCursor.setPosition(p.x,p.y));
    }
    private criarBotao(x:number,y:number,largura:number,altura:number,rotulo:string,cor:number,tamanho:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setSize(largura,altura).setInteractive({useHandCursor:true}),t=this.add.text(0,0,rotulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:`${tamanho}px`,color:'#ffffff'}).setOrigin(.5);c.add([botaoRaster(this,0,4,largura,altura,0x294f46,.17),botaoRaster(this,0,0,largura,altura,cor),t]);c.setData('texto',t);c.on('pointerover',()=>this.tweens.add({targets:c,scale:1.035,duration:90}));c.on('pointerout',()=>this.tweens.add({targets:c,scale:1,duration:90}));return c;}
}
