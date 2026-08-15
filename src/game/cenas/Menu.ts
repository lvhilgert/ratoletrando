import * as Phaser from 'phaser';
import { audioJogo } from '../sistemas/SistemaAudio';
import { ModoPalavras } from '../dados/palavras';
import { PreferenciaModoPalavras } from '../sistemas/PreferenciaModoPalavras';

interface OpcaoModo { valor:ModoPalavras; container:Phaser.GameObjects.Container; fundo:Phaser.GameObjects.Graphics; texto:Phaser.GameObjects.Text }

export class Menu extends Phaser.Scene {
    private modoSelecionado:ModoPalavras='ate4';
    private opcoesModo:OpcaoModo[]=[];
    constructor() { super('Menu'); }
    create(): void {
        this.modoSelecionado=PreferenciaModoPalavras.obter();
        this.opcoesModo=[];
        this.add.image(480,320,'menu-jardim').setDisplaySize(960,640);
        this.add.rectangle(480,320,960,640,0x174f55,.05);
        const voltar=this.add.text(24,22,'‹  EDUCAPP',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',color:'#ffffff',backgroundColor:'#276b58',padding:{x:13,y:8}}).setDepth(20).setInteractive({useHandCursor:true});
        voltar.on('pointerover',()=>voltar.setScale(1.06));voltar.on('pointerout',()=>voltar.setScale(1));voltar.on('pointerdown',()=>this.scene.start('EducApp'));
        for(let i=0;i<16;i++){const luz=this.add.circle(Phaser.Math.Between(35,925),Phaser.Math.Between(190,590),Phaser.Math.Between(2,4),i%2?0xffef72:0xffffff,.35);this.tweens.add({targets:luz,y:luz.y-Phaser.Math.Between(25,70),x:luz.x+Phaser.Math.Between(-25,25),alpha:{from:.15,to:.8},scale:{from:.6,to:1.3},yoyo:true,repeat:-1,duration:Phaser.Math.Between(1800,3600),delay:i*90,ease:'Sine.InOut'});}
        const titulo=this.add.container(480,88);
        const cores=['#ff3045','#48c94f','#20a9f5','#9a55e8','#ff9e1b','#ef4ec5','#18b9ae'];
        [...'RATOLETRANDO'].forEach((letra,i)=>titulo.add(this.add.text((i-5.5)*48,0,letra,{
            fontFamily:'Arial Rounded MT Bold, Arial Black, Arial',fontSize:'61px',fontStyle:'bold',
            color:cores[i%cores.length],stroke:'#fff8bd',strokeThickness:7,
            shadow:{offsetX:3,offsetY:7,color:'#3d2464',blur:1,fill:true}
        }).setOrigin(.5)));
        this.add.text(480,151,'A AVENTURA DAS PALAVRAS',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'20px',color:'#fff',stroke:'#2f765e',strokeThickness:6}).setOrigin(.5);
        this.criarSeletorModo();
        const sombra=this.add.ellipse(480,492,250,30,0x244c34,.3);
        const botao=this.add.ellipse(480,455,250,82,0xff6a4f).setStrokeStyle(7,0xfff2a8).setInteractive({useHandCursor:true});
        const texto=this.add.text(480,455,'JOGAR  ›',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'34px',color:'#fff',stroke:'#b83b35',strokeThickness:4}).setOrigin(.5);
        const jogar=()=>{audioJogo.iniciarMusica();audioJogo.efeito('letra');this.scene.start('Jogo',{fase:0,modo:this.modoSelecionado});};
        botao.on('pointerover',()=>this.tweens.add({targets:[botao,texto],scale:1.07,duration:120}));
        botao.on('pointerout',()=>this.tweens.add({targets:[botao,texto],scale:1,duration:120}));botao.on('pointerdown',jogar);this.input.keyboard?.once('keydown-ENTER',jogar);
        const dica=this.add.container(480,568);dica.add([this.add.ellipse(0,0,330,46,0x245f50,.86),this.add.text(0,0,'SETAS  ou  WASD  •  MOVIMENTAR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',color:'#fff'}).setOrigin(.5)]);
        this.tweens.add({targets:[botao,texto,sombra],scaleX:1.035,scaleY:.97,yoyo:true,repeat:-1,duration:850,ease:'Sine.InOut'});
        this.tweens.add({targets:titulo,y:94,yoyo:true,repeat:-1,duration:1800,ease:'Sine.InOut'});
    }
    private criarSeletorModo():void {
        this.add.text(480,297,'TAMANHO DAS PALAVRAS',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',color:'#fff',stroke:'#2f765e',strokeThickness:4,letterSpacing:1}).setOrigin(.5);
        const definicoes:{valor:ModoPalavras;rotulo:string}[]=[
            {valor:'ate4',rotulo:'ATÉ 4'},
            {valor:'ate5',rotulo:'ATÉ 5'},
            {valor:'aleatorio',rotulo:'ALEATÓRIO'}
        ];
        const largura=170, altura=52, espaco=14, totalLargura=largura*3+espaco*2;
        definicoes.forEach((def,i)=>{
            const x=480-totalLargura/2+largura/2+i*(largura+espaco);
            const container=this.add.container(x,340).setSize(largura,altura).setInteractive({useHandCursor:true});
            const fundo=this.add.graphics();
            const texto=this.add.text(0,0,def.rotulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'17px',color:'#ffffff'}).setOrigin(.5);
            container.add([fundo,texto]);
            container.on('pointerdown',()=>this.selecionarModo(def.valor));
            container.on('pointerover',()=>{if(this.modoSelecionado!==def.valor)this.tweens.add({targets:container,scale:1.05,duration:100});});
            container.on('pointerout',()=>this.tweens.add({targets:container,scale:1,duration:100}));
            this.opcoesModo.push({valor:def.valor,container,fundo,texto});
        });
        this.atualizarVisualSeletor();
    }
    private selecionarModo(modo:ModoPalavras):void {
        if(this.modoSelecionado===modo)return;
        this.modoSelecionado=modo; PreferenciaModoPalavras.definir(modo); audioJogo.efeito('letra'); this.atualizarVisualSeletor();
    }
    private atualizarVisualSeletor():void {
        const largura=170, altura=52;
        this.opcoesModo.forEach(op=>{
            const ativo=op.valor===this.modoSelecionado;
            op.fundo.clear();
            op.fundo.fillStyle(ativo?0xff6a4f:0x2c6b5c,ativo?1:.55).fillRoundedRect(-largura/2,-altura/2,largura,altura,16);
            op.fundo.lineStyle(3,ativo?0xfff2a8:0xffffff,ativo?1:.4).strokeRoundedRect(-largura/2,-altura/2,largura,altura,16);
            op.texto.setColor(ativo?'#ffffff':'#dff3ea');
        });
    }
}
