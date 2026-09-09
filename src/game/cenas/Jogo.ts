import * as Phaser from 'phaser';
import { criarFase } from '../dados/fases';
import { Gato } from '../entidades/Gato';
import { ItemColetavel, TipoItem } from '../entidades/ItemColetavel';
import { Rato } from '../entidades/Rato';
import { SistemaPalavra } from '../sistemas/SistemaPalavra';
import { SistemaPontuacao } from '../sistemas/SistemaPontuacao';
import { PontuacaoAcumulada } from '../sistemas/PontuacaoAcumulada';
import { PreferenciaModoPalavras } from '../sistemas/PreferenciaModoPalavras';
import { audioJogo } from '../sistemas/SistemaAudio';
import { ConfiguracaoFase, PosicaoGrade } from '../tipos/jogo';
import { ModoPalavras } from '../dados/palavras';
import { confirmarSaidaParaEducApp } from '../sistemas/ConfirmacaoSaida';
import { barraRaster, botaoRaster, circuloRaster, painelRaster } from '../sistemas/ArteRaster';

const TILE=48, TOPO=136;
interface LetraMapa extends Phaser.GameObjects.Image { letra?:string; coletada?:boolean }
interface TemaVisual {nome:string;ceu:number;chao:number;borda:number;primaria:number;secundaria:number;tintaPiso:number;tintaNatureza:number;ambiente:'folha'|'bolha'|'poeira'|'luz'|'neve'}
const TEMAS:TemaVisual[]=[
    {nome:'FLORESTA',ceu:0xaee4dc,chao:0xdcae43,borda:0x327947,primaria:0x4baa68,secundaria:0xffd85a,tintaPiso:0xfff0b8,tintaNatureza:0xffffff,ambiente:'folha'},
    {nome:'PRAIA',ceu:0x72d8ed,chao:0xe9c66f,borda:0x168eaa,primaria:0x20abc1,secundaria:0xff8c61,tintaPiso:0xffe5a0,tintaNatureza:0xd8fff1,ambiente:'bolha'},
    {nome:'FAZENDA',ceu:0xffd69a,chao:0xc98c3f,borda:0x8a572c,primaria:0xd7743e,secundaria:0xffd349,tintaPiso:0xffd88b,tintaNatureza:0xf3e3a4,ambiente:'poeira'},
    {nome:'CIDADE',ceu:0xbfc9e5,chao:0xa99b8b,borda:0x515c78,primaria:0x596ba9,secundaria:0xffcb4b,tintaPiso:0xd9d2c8,tintaNatureza:0xb9d1c2,ambiente:'luz'},
    {nome:'INVERNO',ceu:0xdaf4ff,chao:0xc4e7ef,borda:0x4c91ae,primaria:0x55a9cc,secundaria:0xc8f5ff,tintaPiso:0xe8f8ff,tintaNatureza:0xd4efff,ambiente:'neve'}
];

export class Jogo extends Phaser.Scene {
    private static readonly CORES_AZULEJO=['amarelo','azul','vermelho','roxo','verde'];
    private static readonly FUNDOS_AZULEJO:Record<string,number>={
        amarelo:0xf3dda0,
        azul:0xc5dce8,
        vermelho:0xf1c6bd,
        roxo:0xdccde8,
        verde:0xc9dfc0
    };
    private static readonly DESLOCAMENTO_AZULEJO=Phaser.Math.Between(0,Jogo.CORES_AZULEJO.length-1);
    private indiceFase=0; private modo:ModoPalavras='ate4'; private fase!:ConfiguracaoFase; private rato!:Rato; private gatos:Gato[]=[];
    private paredes!:Phaser.Physics.Arcade.StaticGroup; private itens!:Phaser.Physics.Arcade.Group;
    private sistemaPalavra!:SistemaPalavra; private pontos=new SistemaPontuacao(); private textoPontos!:Phaser.GameObjects.Text; private pontosAcumulados=0;
    private caixasLetras:Phaser.GameObjects.Container[]=[]; private mensagem!:Phaser.GameObjects.Text; private invulneravel=false; private terminou=false;
    private timerInvencibilidade?:Phaser.Time.TimerEvent;
    private indicadoresProgresso:Phaser.GameObjects.Image[]=[]; private textoRestantes!:Phaser.GameObjects.Text;
    private tema!:TemaVisual;
    private pausado=false;private overlayPausa?:Phaser.GameObjects.Container;
    constructor(){super('Jogo');}
    init(dados:{fase?:number;modo?:ModoPalavras}):void { this.indiceFase=Math.max(0,dados.fase??0); this.modo=dados.modo??PreferenciaModoPalavras.obter(); this.pontos=new SistemaPontuacao(); this.pontosAcumulados=PontuacaoAcumulada.obter(); this.gatos=[]; this.caixasLetras=[];this.indicadoresProgresso=[]; this.invulneravel=false; this.terminou=false;this.tema=TEMAS[this.indiceFase%TEMAS.length]; }
    create():void {
        audioJogo.iniciarMusica();
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            this.timerInvencibilidade?.remove(false);
            this.timerInvencibilidade=undefined;
            audioJogo.pararEstrela();
        });
        this.fase=criarFase(this.indiceFase,this.modo); this.sistemaPalavra=new SistemaPalavra(this.fase.palavra); this.cameras.main.fadeIn(420,255,255,255);
        this.criarMapa(); this.criarHud(); const inicio=this.mundo(this.fase.posicaoInicialRato);
        this.rato=new Rato(this,inicio.x,inicio.y,this.fase.velocidadeRato,this.fase.mapa,TILE,TOPO,120,this.fase.posicaoInicialRato);
        for(let i=0;i<this.fase.quantidadeGatos;i++){const pos=this.fase.posicoesIniciaisGatos[i]??this.fase.posicoesIniciaisGatos[0]; const p=this.mundo(pos); const gato=new Gato(this,p.x,p.y,this.fase.velocidadeGato,this.fase.mapa,TILE,TOPO,120); this.physics.add.collider(gato,this.paredes); this.physics.add.overlap(this.rato,gato,()=>this.gatoPegou(gato)); this.gatos.push(gato);}
        this.criarColetaveis(); this.physics.add.overlap(this.rato,this.itens,(_,obj)=>this.coletarItem(obj as ItemColetavel)); this.criarLetras(); this.criarBotaoPausa();this.agendarEstrela();
    }
    update(tempo:number):void { if(this.terminou||this.pausado)return; this.rato.atualizar(); this.gatos.forEach(g=>g.atualizar(tempo,this.rato)); }
    private criarBotaoPausa():void {
        const sair=this.add.container(775,103,[botaoRaster(this,0,0,100,28,0x50756b),this.add.text(0,0,'‹  EDUCAPP',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'10px',color:'#ffffff'}).setOrigin(.5)]).setSize(100,28).setDepth(40).setInteractive({useHandCursor:true});
        sair.on('pointerdown',()=>confirmarSaidaParaEducApp(this,{aoAbrir:()=>{this.pausado=true;this.physics.world.pause();this.anims.pauseAll();audioJogo.pausar();this.rato.definirPausado(true);},aoCancelar:()=>{this.pausado=false;this.physics.world.resume();this.anims.resumeAll();audioJogo.continuar();this.rato.definirPausado(false);}}));
        const botao=this.add.container(893,103).setDepth(40).setSize(88,28).setInteractive({useHandCursor:true});
        const sombra=botaoRaster(this,0,3,88,28,0x173b46,.25),borda=botaoRaster(this,0,0,92,32,0xffffff,.9),fundo=botaoRaster(this,0,0,88,28,this.tema.borda),brilho=barraRaster(this,0,-8,76,9,0xffffff,.16),selo=circuloRaster(this,-27,0,18,0xffffff,.2),icone=this.add.image(-27,0,'ui-barra').setDisplaySize(10,12).setTint(0xffffff);
        const texto=this.add.text(8,0,'PAUSA',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#ffffff',letterSpacing:.5}).setOrigin(.5);
        botao.add([sombra,borda,fundo,brilho,selo,icone,texto]);
        botao.on('pointerover',()=>this.tweens.add({targets:botao,scale:1.06,duration:110,ease:'Sine.Out'}));
        botao.on('pointerout',()=>this.tweens.add({targets:botao,scale:1,duration:110,ease:'Sine.Out'}));
        botao.on('pointerdown',()=>{botao.setScale(.96);this.alternarPausa();});
        this.input.keyboard?.on('keydown-ESC',()=>this.alternarPausa());
    }
    private alternarPausa():void {
        if(this.terminou)return;this.pausado=!this.pausado;
        if(this.pausado){
            this.physics.world.pause();this.anims.pauseAll();this.time.paused=true;audioJogo.pausar();this.rato.definirPausado(true);this.gatos.forEach(g=>g.setVelocity(0));
            const fundo=painelRaster(this,480,320,960,640,0x102a38,.62).setInteractive(),borda=painelRaster(this,480,320,404,224,this.tema.primaria),painel=painelRaster(this,480,320,390,210,0xfffbea,.98);
            const titulo=this.add.text(480,280,'JOGO PAUSADO',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'32px',color:'#573a78'}).setOrigin(.5);
            const continuar=this.add.container(480,355,[botaoRaster(this,0,0,220,52,0x4baa68),this.add.text(0,0,'▶  CONTINUAR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'21px',color:'#ffffff'}).setOrigin(.5)]).setSize(220,52).setInteractive({useHandCursor:true});
            continuar.on('pointerdown',()=>this.alternarPausa());this.overlayPausa=this.add.container(0,0,[fundo,borda,painel,titulo,continuar]).setDepth(100);
        }else{
            this.overlayPausa?.destroy(true);this.overlayPausa=undefined;this.physics.world.resume();this.anims.resumeAll();this.time.paused=false;audioJogo.continuar();this.rato.definirPausado(false);
        }
    }
    private criarHud():void {
        painelRaster(this,484,70,930,112,0x18374a,.2).setDepth(8);painelRaster(this,480,64,940,122,this.tema.borda).setDepth(9);painelRaster(this,480,64,930,112,0xfffbdf,.98).setDepth(9);
        circuloRaster(this,82,57,88,0xffffff).setDepth(10);circuloRaster(this,82,57,78,this.tema.primaria).setDepth(10);this.add.text(82,48,`${this.fase.numero}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'32px',color:'#fff'}).setOrigin(.5).setDepth(11);this.add.text(82,78,this.tema.nome,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'9px',color:'#ffffff'}).setOrigin(.5).setDepth(11);
        this.textoPontos=this.add.text(215,57,`TOTAL  ⭐  ${this.pontosAcumulados.toLocaleString('pt-BR')}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'19px',color:'#5b3b8c'}).setOrigin(.5).setDepth(11);
        const largura=Math.min(62,440/this.fase.palavra.length), total=largura*this.fase.palavra.length;
        this.add.text(480,17,'FORME A PALAVRA',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#806292',letterSpacing:2}).setOrigin(.5).setDepth(11);
        [...this.fase.palavra].forEach((_,i)=>{const c=this.add.container(480-total/2+largura*i+largura/2,58).setDepth(11),sombra=painelRaster(this,2,4,largura-8,54,0x6c477c,.22),borda=painelRaster(this,0,0,largura-4,58,this.tema.secundaria),fundo=painelRaster(this,0,0,largura-8,54,0xffffff),t=this.add.text(0,-1,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'32px',color:'#593d78',stroke:'#ffffff',strokeThickness:2}).setOrigin(.5);c.add([sombra,borda,fundo,t]);this.caixasLetras.push(c);});
        botaoRaster(this,805,57,231,72,0x78b96c);botaoRaster(this,805,57,225,66,0xdff3d5);this.mensagem=this.add.text(805,57,'Pegue as letras em qualquer ordem!',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',color:'#356653',align:'center',wordWrap:{width:190}}).setOrigin(.5);
        const progresso=this.add.container(480,104);
        const totalLetras=this.fase.palavra.length, espacoProgresso=totalLetras>1?Math.min(27,110/(totalLetras-1)):0;
        [...this.fase.palavra].forEach((_,i)=>{const bolha=circuloRaster(this,(i-(totalLetras-1)/2)*espacoProgresso,0,14,0xffffff,.9);this.indicadoresProgresso.push(bolha);progresso.add(bolha);});
        this.textoRestantes=this.add.text(555,104,`${this.fase.palavra.length} restantes`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',color:'#68458c'}).setOrigin(0,.5);
    }
    private criarMapa():void {
        const tema=this.tema;this.cameras.main.setBackgroundColor(tema.ceu);
        const cores=Jogo.CORES_AZULEJO;
        const corAzulejo=cores[(this.indiceFase+Jogo.DESLOCAMENTO_AZULEJO)%cores.length];
        const azulejo=`azulejo-${corAzulejo}`,fundoBlocos=Jogo.FUNDOS_AZULEJO[corAzulejo];
        for(let i=0;i<5;i++){const nuvem=circuloRaster(this,80+i*205,130+(i%2)*18,50,0xffffff,.3).setScale(1.9,.5).setDepth(-2);this.tweens.add({targets:nuvem,x:nuvem.x+35,yoyo:true,repeat:-1,duration:5000+i*600,ease:'Sine.InOut'});}
        this.paredes=this.physics.add.staticGroup();
        painelRaster(this,486,394,744,494,0x173b46,.22);painelRaster(this,480,388,760,510,tema.borda);painelRaster(this,480,388,744,494,fundoBlocos);
        this.fase.mapa.forEach((linha,l)=>linha.forEach((celula,c)=>{
            const p=this.mundo({linha:l,coluna:c});
            if(celula===1){
                const parede=this.add.image(p.x,p.y,'natureza',(l*7+c)%4).setDisplaySize(TILE+8,TILE+8).setTint(tema.tintaNatureza).setDepth(2);
                this.physics.add.existing(parede,true); this.paredes.add(parede);
            } else {
                this.add.image(p.x,p.y,azulejo).setDisplaySize(TILE-1,TILE-1);
            }
        }));
        this.criarAmbiente();
    }
    private criarAmbiente():void {
        const livres=this.embaralhar(this.corredoresLivres()).slice(0,10);
        livres.forEach((grade,i)=>{
            const p=this.mundo(grade);
            const x=p.x+Phaser.Math.Between(-15,15),y=p.y+Phaser.Math.Between(-15,15);
            this.add.image(x,y,this.tema.ambiente==='folha'?'fruta-cereja':'estrela-0').setDisplaySize(14,14).setTint(this.tema.ambiente==='folha'?0x4aa85e:this.tema.ambiente==='bolha'?0xffd7a1:this.tema.ambiente==='poeira'?0xf0bd43:this.tema.ambiente==='luz'?0xb7c1ca:0xffffff).setAlpha(.85).setDepth(1).setAngle(i*23);
        });
        for(let i=0;i<14;i++){
            const cor=this.tema.ambiente==='neve'?0xffffff:this.tema.ambiente==='bolha'?0xc8f8ff:this.tema.ambiente==='luz'?0xffe47a:0x8fd36b;
            // raster-exception: partícula ambiental efêmera.
            const particula=this.add.circle(Phaser.Math.Between(125,835),Phaser.Math.Between(140,630),Phaser.Math.Between(2,4),cor,.45).setDepth(3);
            this.tweens.add({targets:particula,y:particula.y+(this.tema.ambiente==='bolha'?-90:90),x:particula.x+Phaser.Math.Between(-35,35),alpha:{from:.15,to:.7},yoyo:true,repeat:-1,duration:Phaser.Math.Between(2600,5200),delay:i*120,ease:'Sine.InOut'});
        }
        painelRaster(this,480,388,720,470,0xffffff,this.tema.ambiente==='neve'?.08:.025).setDepth(3).setBlendMode(Phaser.BlendModes.ADD);
    }
    private corredoresLivres():PosicaoGrade[]{const bloqueados=[this.fase.posicaoInicialRato,...this.fase.posicoesIniciaisGatos]; return this.fase.mapa.flatMap((linha,l)=>linha.map((v,c)=>({v,p:{linha:l,coluna:c}}))).filter(x=>x.v===0&&!bloqueados.some(b=>b.linha===x.p.linha&&b.coluna===x.p.coluna)).map(x=>x.p);}
    private embaralhar<T>(lista:T[]):T[]{return Phaser.Utils.Array.Shuffle([...lista]);}
    private criarColetaveis():void {
        this.itens=this.physics.add.group({allowGravity:false}); const livres=this.embaralhar(this.corredoresLivres()); let indice=0;
        const adicionar=(tipo:TipoItem,quantidade:number)=>{for(let i=0;i<quantidade;i++){const p=this.mundo(livres[indice++]); this.itens.add(new ItemColetavel(this,p.x,p.y,tipo));}};
        adicionar('queijo',this.fase.quantidadeQueijos); adicionar('fruta',this.fase.quantidadeFrutas);
        for(;indice<livres.length;indice+=2){const p=this.mundo(livres[indice]);this.itens.add(new ItemColetavel(this,p.x,p.y,'bolinha'));}
    }
    private criarLetras():void {
        const ocupadas=this.itens.getChildren().map(o=>`${Math.floor(((o as ItemColetavel).y-TOPO)/TILE)},${Math.floor(((o as ItemColetavel).x-120)/TILE)}`);
        const livres=this.corredoresLivres().filter(p=>!ocupadas.includes(`${p.linha},${p.coluna}`));
        const meioLinha=(this.fase.mapa.length-1)/2, meioColuna=(this.fase.mapa[0].length-1)/2;
        const setores=[
            (p:PosicaoGrade)=>p.linha<meioLinha&&p.coluna<meioColuna,
            (p:PosicaoGrade)=>p.linha<meioLinha&&p.coluna>meioColuna,
            (p:PosicaoGrade)=>p.linha>meioLinha&&p.coluna<meioColuna,
            (p:PosicaoGrade)=>p.linha>meioLinha&&p.coluna>meioColuna
        ];
        const escolhidas:PosicaoGrade[]=[];
        const letras=[...this.fase.palavra];
        letras.forEach((letra,i)=>{
            const candidatas=this.embaralhar(livres.filter(setores[i%setores.length]).filter(p=>!escolhidas.includes(p)));
            const afastadas=candidatas.filter(p=>escolhidas.every(e=>Math.abs(e.linha-p.linha)+Math.abs(e.coluna-p.coluna)>=3));
            const p=(afastadas[0]??candidatas[0]??this.embaralhar(livres.filter(x=>!escolhidas.includes(x)))[0]);
            escolhidas.push(p);
            const pos=this.mundo(p),halo=circuloRaster(this,pos.x,pos.y,58,0xffffff,.65).setDepth(3),brilho=this.add.image(pos.x+17,pos.y-17,'estrela-0').setDisplaySize(10,10).setDepth(5),texto=this.add.image(pos.x,pos.y,`letra-${letra}`).setDisplaySize(46,46).setDepth(4) as LetraMapa;halo.setTint(this.tema.secundaria);texto.letra=letra;texto.setData('halo',halo);texto.setData('brilho',brilho);this.physics.add.existing(texto,true);const corpo=texto.body as Phaser.Physics.Arcade.StaticBody;corpo.setCircle(20);corpo.updateFromGameObject();this.physics.add.overlap(this.rato,texto,()=>this.tentarLetra(texto));this.tweens.add({targets:[texto,halo],y:pos.y-6,yoyo:true,repeat:-1,duration:950+i*55,ease:'Sine.InOut'});this.tweens.add({targets:texto,angle:{from:-3,to:3},yoyo:true,repeat:-1,duration:1250+i*35,ease:'Sine.InOut'});this.tweens.add({targets:halo,scale:{from:.82,to:1.12},alpha:{from:.12,to:.35},yoyo:true,repeat:-1,duration:800+i*60});this.tweens.add({targets:brilho,scale:{from:.3,to:1.4},angle:180,alpha:{from:0,to:1},yoyo:true,repeat:-1,duration:700,delay:i*170});
        });
    }
    private coletarItem(item:ItemColetavel):void { if(!item.active)return; item.disableBody(true,false);if(item.tipo==='estrela'){this.particulas(item.x,item.y,0xffdf38,16);this.ativarInvencibilidade();this.tweens.add({targets:item,scale:1.6,alpha:0,angle:180,duration:260,onComplete:()=>item.destroy()});return;} const valor=item.tipo==='bolinha'?this.fase.pontosBolinha:item.tipo==='queijo'?this.fase.pontosQueijo:this.fase.pontosFruta;audioJogo.efeito(item.tipo==='bolinha'?'bolinha':'comida');this.atualizarPontos(valor); this.feedbackPontos(item.x,item.y,valor);if(item.tipo!=='bolinha')this.particulas(item.x,item.y,item.tipo==='fruta'?0xff5d68:0xffd447,8); this.tweens.add({targets:item,scale:0,alpha:0,y:item.y-15,duration:220,onComplete:()=>item.destroy()}); }
    private tentarLetra(obj:LetraMapa):void {if(obj.coletada||!obj.letra||this.terminou)return;if(!this.sistemaPalavra.tentar(obj.letra))return;audioJogo.efeito('letra');obj.coletada=true;(obj.body as Phaser.Physics.Arcade.Body).enable=false;this.atualizarPontos(this.fase.pontosLetra);const indice=this.sistemaPalavra.indiceUltimaLetra,texto=this.caixasLetras[indice].list[3] as Phaser.GameObjects.Text;texto.setText(obj.letra);this.indicadoresProgresso[indice].setTint(this.tema.primaria);const restantes=this.fase.palavra.length-this.sistemaPalavra.letrasColetadas;this.textoRestantes.setText(`${restantes} restantes`);this.particulas(obj.x,obj.y,this.tema.primaria,18);this.cameras.main.shake(80,.002);this.tweens.add({targets:this.caixasLetras[indice],scale:1.35,yoyo:true,duration:180});const halo=obj.getData('halo') as Phaser.GameObjects.Image,brilho=obj.getData('brilho') as Phaser.GameObjects.Image;this.tweens.killTweensOf([obj,halo,brilho]);this.tweens.add({targets:[obj,halo,brilho],scale:1.7,alpha:0,angle:120,duration:300,ease:'Back.In',onComplete:()=>{obj.destroy();halo.destroy();brilho.destroy();}});if(this.sistemaPalavra.completa)this.finalizar();else this.mensagem.setText(`Muito bem! Faltam ${restantes} letras.`);}
    private agendarEstrela():void {this.time.delayedCall(Phaser.Math.Between(7000,15000),()=>{if(this.terminou)return;const existente=this.itens.getChildren().some(i=>(i as ItemColetavel).tipo==='estrela'&&(i as ItemColetavel).active);if(!this.invulneravel&&!existente){const ocupadas=this.itens.getChildren().filter(i=>(i as ItemColetavel).active).map(i=>`${Math.round((((i as ItemColetavel).y-TOPO)/TILE)-.5)},${Math.round((((i as ItemColetavel).x-120)/TILE)-.5)}`);const livres=this.embaralhar(this.corredoresLivres().filter(p=>!ocupadas.includes(`${p.linha},${p.coluna}`)));const p=livres[0];if(p){const m=this.mundo(p),estrela=new ItemColetavel(this,m.x,m.y,'estrela');this.itens.add(estrela);this.time.delayedCall(12000,()=>{if(estrela.active)this.tweens.add({targets:estrela,alpha:0,duration:500,onComplete:()=>estrela.destroy()});});}}this.agendarEstrela();});}
    private ativarInvencibilidade():void {if(this.invulneravel)return;audioJogo.tocarEstrela();this.invulneravel=true;this.itens.getChildren().filter(i=>(i as ItemColetavel).tipo==='estrela'&&(i as ItemColetavel).active).forEach(i=>{if(i.active)i.destroy();});this.timerInvencibilidade?.remove(false);this.mensagem.setText('Super rato! Invencível por 8 segundos!');this.rato.setTint(0xfff06a);this.tweens.add({targets:this.rato,scale:.23,yoyo:true,repeat:11,duration:320});this.timerInvencibilidade=this.time.delayedCall(8000,()=>{audioJogo.pararEstrela();this.invulneravel=false;this.rato.clearTint().setScale(.2);this.mensagem.setText('Continue pegando as letras!');});}
    private gatoPegou(gato:Gato):void { if(this.invulneravel||this.terminou)return; audioJogo.tocarMiado();this.cameras.main.shake(320,.014);this.cameras.main.flash(120,255,90,90);this.particulas(this.rato.x,this.rato.y,0xff6a62,12); this.invulneravel=true; this.rato.definirBloqueado(true); gato.setVelocity(0); this.mensagem.setText('Ops! O gato te encontrou!'); this.tweens.add({targets:this.rato,alpha:.25,yoyo:true,repeat:6,duration:160}); this.time.delayedCall(1200,()=>{gato.afastar(this.fase.posicoesIniciaisGatos[0]);this.rato.definirBloqueado(false);this.mensagem.setText('Vamos continuar! Pegue qualquer letra.');}); this.time.delayedCall(3200,()=>{this.invulneravel=false;this.rato.setAlpha(1);}); }
    private atualizarPontos(valor:number):void {const pontosDaPartida=this.pontos.adicionar(valor);this.textoPontos.setText(`TOTAL  ⭐  ${(this.pontosAcumulados+pontosDaPartida).toLocaleString('pt-BR')}`);}
    private feedbackPontos(x:number,y:number,v:number):void {const t=this.add.text(x,y,`+${v}`,{fontFamily:'Arial',fontSize:'20px',color:'#3b7d62',stroke:'#fff',strokeThickness:3}).setOrigin(.5).setDepth(10);this.tweens.add({targets:t,y:y-35,alpha:0,duration:550,onComplete:()=>t.destroy()});}
    private finalizar():void {this.timerInvencibilidade?.remove(false);this.timerInvencibilidade=undefined;audioJogo.tocarVitoria();this.invulneravel=false;this.terminou=true;const totalAcumulado=PontuacaoAcumulada.adicionar(this.pontos.total);this.rato.definirBloqueado(true);this.gatos.forEach(g=>g.setVelocity(0));this.mensagem.setText('Palavra completa!');this.particulas(480,58,0xffd83d,28);this.cameras.main.flash(350,255,245,160);this.time.delayedCall(700,()=>this.cameras.main.fadeOut(380,255,255,255,(_c:Phaser.Cameras.Scene2D.Camera,p:number)=>{if(p===1)this.scene.start('FimDaFase',{fase:this.indiceFase,palavra:this.fase.palavra,pontuacao:this.pontos.total,totalAcumulado,modo:this.modo});}));}
    // raster-exception: partículas efêmeras de feedback.
    private particulas(x:number,y:number,cor:number,quantidade:number):void {for(let i=0;i<quantidade;i++){const p=this.add.circle(x,y,Phaser.Math.Between(2,5),cor).setDepth(20);const angulo=Phaser.Math.FloatBetween(0,Math.PI*2),distancia=Phaser.Math.Between(22,70);this.tweens.add({targets:p,x:x+Math.cos(angulo)*distancia,y:y+Math.sin(angulo)*distancia,scale:0,alpha:0,duration:Phaser.Math.Between(300,600),ease:'Cubic.Out',onComplete:()=>p.destroy()});}}
    private mundo(p:PosicaoGrade):{x:number;y:number}{return{x:p.coluna*TILE+TILE/2+120,y:TOPO+p.linha*TILE+TILE/2};}
}
