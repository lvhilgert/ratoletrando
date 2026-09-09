import * as Phaser from 'phaser';
import { DadosFimFase } from '../tipos/jogo';
import { servicoVoz } from '../../services/ServicoVoz';
import { confirmarSaidaParaEducApp } from '../sistemas/ConfirmacaoSaida';
import { botaoRaster, circuloRaster, painelRaster } from '../sistemas/ArteRaster';

export class FimDaFase extends Phaser.Scene {
    constructor(){super('FimDaFase');}

    create(dados:DadosFimFase):void {
        const temas=['FLORESTA','PRAIA','FAZENDA','CIDADE','INVERNO'];
        const cores=[0x4baa68,0x20abc1,0xd7743e,0x596ba9,0x55a9cc];
        const corTema=cores[dados.fase%cores.length],proximo=temas[(dados.fase+1)%temas.length];
        this.add.image(480,320,'menu-jardim').setDisplaySize(960,640);
        painelRaster(this,480,320,960,640,0x173b46,.42);
        this.criarConfetes();
        const voltar=this.add.container(75,39,[botaoRaster(this,0,0,102,34,0x397466),this.add.text(0,0,'‹  EDUCAPP',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#ffffff'}).setOrigin(.5)]).setSize(102,34).setDepth(50).setInteractive({useHandCursor:true});voltar.on('pointerdown',()=>confirmarSaidaParaEducApp(this));

        const painel=this.add.container(480,322).setScale(.82).setAlpha(0);
        const desenhar=(x:number,y:number,w:number,h:number,_raio:number,cor:number,alpha=1):Phaser.GameObjects.NineSlice=>painelRaster(this,x,y,w,h,cor,alpha);

        // Sombra, moldura colorida e interior cremoso em camadas.
        painel.add(desenhar(0,18,650,492,44,0x102f3b,.35));
        painel.add(desenhar(0,0,650,492,44,corTema));
        painel.add(desenhar(0,0,630,472,37,0xffd85a));
        painel.add(desenhar(0,0,608,450,31,0xfffbeb));
        painel.add(desenhar(0,-165,572,88,25,0xff6f61));
        painel.add(desenhar(0,-158,572,74,22,0xff8b69));

        // Medalhão e estrelas dão um foco visual claro ao resultado.
        painel.add(circuloRaster(this,0,-229,130,0xffc83d));
        painel.add(circuloRaster(this,0,-229,122,0xfff4a6));
        painel.add(circuloRaster(this,0,-229,94,0x7a45bd));
        const estrelaCentral=this.add.image(0,-233,'estrela-0').setDisplaySize(76,76);
        painel.add(estrelaCentral);
        painel.add(this.add.image(-83,-199,'estrela-0').setDisplaySize(36,36).setAngle(-18));
        painel.add(this.add.image(83,-199,'estrela-0').setDisplaySize(36,36).setAngle(18));

        painel.add(this.add.text(0,-145,'MUITO BEM!',{
            fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'39px',color:'#ffffff',
            stroke:'#b83d55',strokeThickness:5,shadow:{offsetY:4,color:'#8e3048',blur:1,fill:true}
        }).setOrigin(.5));
        painel.add(this.add.text(0,-93,'VOCÊ COMPLETOU A PALAVRA',{
            fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',color:'#755b79',letterSpacing:2
        }).setOrigin(.5));
        painel.add(this.add.text(0,108,`PRÓXIMO DESTINO: ${proximo}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',color:'#755b79',letterSpacing:1}).setOrigin(.5));

        const palavraFundo=desenhar(0,-24,470,86,24,0xefe3ff);
        painel.add(palavraFundo);
        painel.add(this.add.text(0,-27,dados.palavra,{
            fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'58px',color:'#6536a0',
            stroke:'#ffffff',strokeThickness:5,shadow:{offsetY:4,color:'#c9aee9',blur:0,fill:true}
        }).setOrigin(.5));

        const placar=desenhar(0,63,430,72,21,0xdff6ee);
        painel.add(placar);
        painel.add(circuloRaster(this,-176,63,44,0x58c994));
        painel.add(this.add.text(-176,62,'★',{fontFamily:'Arial',fontSize:'27px',color:'#ffffff'}).setOrigin(.5));
        painel.add(this.add.text(-140,48,'NESTA PARTIDA',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',color:'#38745d'}).setOrigin(0,.5));
        painel.add(this.add.text(176,48,`+${dados.pontuacao.toLocaleString('pt-BR')}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'19px',color:'#2e6552'}).setOrigin(1,.5));
        painel.add(this.add.text(-140,76,'TOTAL ACUMULADO',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',color:'#654883'}).setOrigin(0,.5));
        painel.add(this.add.text(176,76,dados.totalAcumulado.toLocaleString('pt-BR'),{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'21px',color:'#6536a0'}).setOrigin(1,.5));

        const rotulo='PRÓXIMA FASE';
        const botao=this.add.container(0,168);
        botao.add(desenhar(0,8,390,78,27,0xb63745,.55));
        botao.add(desenhar(0,0,390,78,27,0xff5964));
        botao.add(desenhar(0,-5,372,61,22,0xff7b72));
        botao.add(this.add.text(-12,-3,rotulo,{
            fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'27px',color:'#ffffff',
            stroke:'#c53b4a',strokeThickness:4
        }).setOrigin(.5));
        botao.add(this.add.text(151,-3,'›',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'46px',color:'#fff6bc'}).setOrigin(.5));
        botao.setSize(390,78).setInteractive({useHandCursor:true});
        painel.add(botao);

        botao.on('pointerover',()=>this.tweens.add({targets:botao,scale:1.045,duration:100,ease:'Sine.Out'}));
        botao.on('pointerout',()=>this.tweens.add({targets:botao,scale:1,duration:100}));
        botao.on('pointerdown',()=>{
            botao.setScale(.96);
            this.time.delayedCall(90,()=>this.scene.start('Jogo',{fase:dados.fase+1,modo:dados.modo}));
        });

        this.tweens.add({targets:painel,scale:1,alpha:1,duration:520,ease:'Back.Out'});
        this.tweens.add({targets:estrelaCentral,angle:360,scale:{from:.35,to:1},duration:700,ease:'Back.Out'});
        this.time.delayedCall(650,()=>servicoVoz.falar(dados.palavra));
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>servicoVoz.parar());
        this.input.keyboard?.once('keydown-ENTER',()=>this.scene.start('Jogo',{fase:dados.fase+1,modo:dados.modo}));
    }

    private criarConfetes():void {
        const cores=[0xff6f61,0xffd84f,0x7a45bd,0x4ecb91,0x55b8e8];
        for(let i=0;i<42;i++){
            const x=i%2===0?Phaser.Math.Between(15,145):Phaser.Math.Between(815,945);
            // raster-exception: confete efêmero de celebração.
            const p=this.add.rectangle(x,Phaser.Math.Between(-100,30),Phaser.Math.Between(6,10),Phaser.Math.Between(10,18),Phaser.Utils.Array.GetRandom(cores));
            this.tweens.add({targets:p,y:680,angle:Phaser.Math.Between(-360,360),duration:Phaser.Math.Between(2200,3800),delay:Phaser.Math.Between(0,900),repeat:-1});
        }
    }
}
