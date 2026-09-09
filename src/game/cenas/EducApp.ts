import * as Phaser from 'phaser';
import { PreferenciaAudio } from '../../services/PreferenciaAudio';
import { PreferenciaVoz } from '../../services/PreferenciaVoz';
import { servicoVoz } from '../../services/ServicoVoz';
import { audioJogo } from '../sistemas/SistemaAudio';
import { barraRaster, botaoRaster, circuloRaster, painelRaster } from '../sistemas/ArteRaster';

type TipoIcone='rato'|'escrita'|'monta'|'contagem'|'soma'|'memoria'|'reino'|'detetive';
interface Aplicativo {tipo:TipoIcone;nome:string;area:string;descricao:string;cor:number;corClara:number;disponivel:boolean;cena?:string}
const FONTE_UI='Trebuchet MS, Verdana, Arial, sans-serif';

const APLICATIVOS:Aplicativo[]=[
    {tipo:'rato',nome:'RatoLetrando',area:'LINGUAGEM',descricao:'Colete letras e forme palavras',cor:0x278b69,corClara:0xdaf1e8,disponivel:true,cena:'Menu'},
    {tipo:'escrita',nome:'Ouvi e Escrevi',area:'LINGUAGEM',descricao:'Ouça e escreva na tela',cor:0x3f82a3,corClara:0xddeef4,disponivel:true,cena:'OuviEscrevi'},
    {tipo:'monta',nome:'MontaPalavra',area:'LINGUAGEM',descricao:'Arraste letras e sílabas',cor:0x4c998c,corClara:0xdff1ed,disponivel:true,cena:'MontaPalavra'},
    {tipo:'contagem',nome:'ContaComigo',area:'MATEMÁTICA',descricao:'Conte objetos brincando',cor:0xd58a32,corClara:0xf8ead4,disponivel:true,cena:'ContaComigo'},
    {tipo:'soma',nome:'SomaTrilha',area:'MATEMÁTICA',descricao:'Resolva somas e subtrações',cor:0xc97939,corClara:0xf7e6d9,disponivel:true,cena:'SomaTrilha'},
    {tipo:'memoria',nome:'MemóLetras',area:'MISTA',descricao:'Encontre pares por associação',cor:0x7668a9,corClara:0xe9e5f4,disponivel:true,cena:'MemoLetras'},
    {tipo:'reino',nome:'Reino das Portas',area:'MISTA',descricao:'Explore e abra portas mágicas',cor:0x397a69,corClara:0xdcefe7,disponivel:true,cena:'ConfiguracaoReino'},
    {tipo:'detetive',nome:'Detetive Mirim',area:'LINGUAGEM',descricao:'Investigue pistas e resolva casos',cor:0x55718c,corClara:0xe1eaf2,disponivel:true,cena:'CasosDetetive'}
];

export class EducApp extends Phaser.Scene {
    private aviso?:Phaser.GameObjects.Container;
    constructor(){super('EducApp');}
    create():void {
        this.cameras.main.setBackgroundColor(0xd9f1e5);this.criarFundoVivo();
        const cabecalho=this.add.container(480,58).setDepth(3),sombra=painelRaster(this,0,4,384,92,0x285d4b,.12),borda=painelRaster(this,0,0,386,94,0x76af98,.34),painel=painelRaster(this,0,0,384,92,0xffffff,.92);
        const marca=this.add.text(0,-25,'APRENDER • BRINCAR • DESCOBRIR',{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:'#287258',letterSpacing:1.4}).setOrigin(.5),titulo=this.add.text(0,1,'EducApp',{fontFamily:FONTE_UI,fontSize:'40px',fontStyle:'bold',color:'#175f48',stroke:'#ffffff',strokeThickness:2,shadow:{offsetY:2,color:'#8fbfad',blur:3,fill:true}}).setOrigin(.5),subtitulo=this.add.text(0,32,'Escolha uma aventura e aprenda brincando!',{fontFamily:FONTE_UI,fontSize:'15px',fontStyle:'bold',color:'#315e4e'}).setOrigin(.5);
        cabecalho.add([sombra,borda,painel,marca,titulo,subtitulo]);
        this.criarControleVoz();
        this.criarControleAudio();
        const catalogo=this.add.container(480,351).setDepth(2),sombraCatalogo=painelRaster(this,0,5,916,480,0x275845,.1),painelCatalogo=painelRaster(this,0,0,916,480,0xffffff,.44),secao=this.add.text(-425,-226,'AVENTURAS',{fontFamily:FONTE_UI,fontSize:'12px',fontStyle:'bold',color:'#205f48',letterSpacing:1.1}).setOrigin(0,.5),contador=this.add.text(425,-226,`${APLICATIVOS.length} JOGOS DISPONÍVEIS`,{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:'#3e6556'}).setOrigin(1,.5);catalogo.add([sombraCatalogo,painelCatalogo,secao,contador]);
        APLICATIVOS.forEach((app,i)=>this.criarCartao(app,120+(i%4)*240,232+Math.floor(i/4)*234,i));
        const rodape=this.add.container(480,614).setDepth(4),dica=this.add.text(0,0,'ESCOLHA UMA AVENTURA PARA COMEÇAR',{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:'#254f40',letterSpacing:.8}).setOrigin(.5);rodape.add([barraRaster(this,-161,0,147,2,0x3d8b6b,.2),barraRaster(this,161,0,147,2,0x3d8b6b,.2),dica]);this.aplicarNitidezTextos();
    }

    private aplicarNitidezTextos():void {
        const visitar=(objeto:Phaser.GameObjects.GameObject):void=>{if(objeto instanceof Phaser.GameObjects.Text)objeto.setResolution(2);else if(objeto instanceof Phaser.GameObjects.Container)objeto.list.forEach(visitar);};
        this.children.list.forEach(visitar);
    }

    private criarFundoVivo():void {
        this.add.image(480,320,'educapp-fundo').setDisplaySize(960,640);
        // raster-exception: partículas ambientais efêmeras, sem significado próprio.
        for(let i=0;i<16;i++){const cor=i%3===0?0xffd56a:i%3===1?0x69c99e:0x8dbce5,particula=this.add.circle(Phaser.Math.Between(18,942),Phaser.Math.Between(105,615),Phaser.Math.Between(2,4),cor,.2).setDepth(1);this.tweens.add({targets:particula,y:particula.y-Phaser.Math.Between(18,42),x:particula.x+Phaser.Math.Between(-14,14),alpha:{from:.08,to:.35},yoyo:true,repeat:-1,duration:Phaser.Math.Between(2200,3900),delay:i*90,ease:'Sine.InOut'});}
    }

    private criarControleAudio():void {
        const controle=this.add.container(810,52).setDepth(10);
        const fundo=painelRaster(this,0,0,270,60,0xffffff,.92);
        const icone=this.add.image(-104,0,'ui-speaker').setDisplaySize(32,32).setTint(0x438b6d);
        controle.add([fundo,icone]);

        const criarSlider=(y:number,rotulo:string,valorInicial:number,aoAlterar:(valor:number)=>void):void=>{
            const xInicio=23,largura=91;
            const texto=this.add.text(-88,y,rotulo,{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:'#385e50'}).setOrigin(0,.5);
            const trilho=barraRaster(this,xInicio+largura/2,y,largura,6,0xc8dcd3);
            const preenchimento=barraRaster(this,xInicio,y,1,6,0x62b68d).setOrigin(0,.5);
            const botao=circuloRaster(this,xInicio+largura*valorInicial,y,16,0x438b6d);
            const percentual=this.add.text(129,y,'',{fontFamily:FONTE_UI,fontSize:'9px',fontStyle:'bold',color:'#246b50'}).setOrigin(1,.5);
            const zona=this.add.zone(xInicio+largura/2,y,largura+18,22).setInteractive({useHandCursor:true});
            const desenhar=(valor:number)=>{const v=Math.max(0,Math.min(1,valor));preenchimento.setSize(Math.max(1,largura*v),6);botao.x=xInicio+largura*v;percentual.setText(`${Math.round(v*100)}%`);aoAlterar(v);};
            const peloPonteiro=(pointer:Phaser.Input.Pointer)=>desenhar((pointer.worldX-controle.x-xInicio)/largura);
            zona.on('pointerdown',peloPonteiro).on('pointermove',(pointer:Phaser.Input.Pointer)=>{if(pointer.isDown)peloPonteiro(pointer);});
            controle.add([texto,trilho,preenchimento,botao,percentual,zona]);desenhar(valorInicial);
        };
        criarSlider(-13,'MÚSICA',PreferenciaAudio.obterVolumeMusica(),v=>audioJogo.definirVolumeMusica(v));
        criarSlider(13,'EFEITOS',PreferenciaAudio.obterVolumeEfeitos(),v=>audioJogo.definirVolumeEfeitos(v));
    }

    private criarControleVoz():void {
        let ativa=PreferenciaVoz.obter();
        const controle=this.add.container(150,52).setSize(250,50).setInteractive({useHandCursor:true}).setDepth(10);
        const fundo=painelRaster(this,0,0,250,50,0xffffff,.92),icone=this.add.image(-94,0,'ui-speaker').setDisplaySize(34,34),rotulo=this.add.text(-4,-8,'ACESSIBILIDADE POR VOZ',{fontFamily:FONTE_UI,fontSize:'9px',fontStyle:'bold',color:'#45685b',letterSpacing:.15}).setOrigin(.5),estado=this.add.text(-4,8,'',{fontFamily:FONTE_UI,fontSize:'11px',fontStyle:'bold'}).setOrigin(.5),trilho=botaoRaster(this,101,0,38,24,0xc8d2ce),botao=circuloRaster(this,94,0,20,0xffffff);
        const desenhar=()=>{
            fundo.setTint(ativa?0xf5fbf8:0xffffff);icone.setTexture(ativa?'ui-speaker':'ui-speaker-off').setTint(ativa?0x438b6d:0xb86666);
            trilho.setTint(ativa?0x62b68d:0xc8d2ce);botao.setPosition(ativa?108:94,0);
            estado.setText(ativa?'VOZ ATIVADA':'VOZ DESATIVADA').setColor(ativa?'#34785b':'#74867e');
        };
        controle.add([fundo,icone,rotulo,estado,trilho,botao]);desenhar();
        controle.on('pointerover',()=>this.tweens.add({targets:controle,scale:1.025,duration:90}));controle.on('pointerout',()=>this.tweens.add({targets:controle,scale:1,duration:90}));
        controle.on('pointerdown',()=>{ativa=!ativa;PreferenciaVoz.definir(ativa);if(ativa)servicoVoz.falar('Acessibilidade por voz ativada.');else servicoVoz.parar();desenhar();this.tweens.add({targets:botao,scale:1.2,yoyo:true,duration:100});});
    }

    private criarCartao(app:Aplicativo,x:number,y:number,indice:number):void {
        const cartao=this.add.container(x,y).setSize(210,216).setInteractive({useHandCursor:true}).setDepth(5).setAlpha(0).setScale(.9);
        const destaqueReino=app.tipo==='reino',sombra=painelRaster(this,0,13,210,220,0x234f3f,app.disponivel?.16:.08),halo=painelRaster(this,0,0,216,226,app.cor,.24).setAlpha(0);
        const borda=painelRaster(this,0,2,210,220,destaqueReino?0xd89a3f:0x78998c,destaqueReino?.85:.28),base=painelRaster(this,0,2,204,214,0xffffff,app.disponivel?1:.96);
        const faixa=barraRaster(this,-100,-1,6,142,app.cor),topo=painelRaster(this,0,-51,188,91,app.corClara),medalhao=circuloRaster(this,0,-51,88,app.cor,.11);
        const categoria=this.criarTag(-57,-83,app.area,app.cor,app.corClara);
        const destaque=destaqueReino?this.criarTag(51,-83,'DESTAQUE',0xffffff,0xd48028):undefined;
        const icone=this.criarIcone(app.tipo,app.cor).setPosition(0,-48);
        if(app.disponivel)this.tweens.add({targets:icone,y:-53,yoyo:true,repeat:-1,duration:1350+indice*85,delay:indice*90,ease:'Sine.InOut'});
        const nome=this.add.text(0,10,app.nome,{fontFamily:FONTE_UI,fontSize:app.nome.length>15?'18px':'20px',fontStyle:'bold',color:'#123c2e'}).setOrigin(.5).setResolution(2);
        const descricao=this.add.text(0,40,app.descricao,{fontFamily:FONTE_UI,fontSize:'13px',color:'#365d4e',align:'center',lineSpacing:4,wordWrap:{width:182}}).setOrigin(.5).setResolution(2);
        cartao.add([halo,sombra,borda,base,faixa,topo,medalhao,categoria]);if(destaque)cartao.add(destaque);cartao.add([icone,nome,descricao]);
        if(app.disponivel){
            const botao=this.add.container(0,80),sombraBotao=botaoRaster(this,0,5,164,39,0x173b2f,.22),fundoBotao=botaoRaster(this,0,0,164,39,app.cor),brilho=barraRaster(this,0,-10,144,8,0xffffff,.16),texto=this.add.text(-8,0,'COMEÇAR',{fontFamily:FONTE_UI,fontSize:'14px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5).setResolution(2),seta=this.add.text(57,-1,'→',{fontFamily:FONTE_UI,fontSize:'20px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5).setResolution(2);
            botao.add([sombraBotao,fundoBotao,brilho,texto,seta]);cartao.add(botao);
        }else{
            const selo=this.add.container(0,80);selo.add([botaoRaster(this,0,0,114,30,0xe9efec),this.criarCadeado(-37,0,0x76877f),this.add.text(12,0,'EM BREVE',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#687a72'}).setOrigin(.5)]);cartao.add(selo);
        }
        this.tweens.add({targets:cartao,alpha:1,scale:1,duration:360,delay:110+indice*65,ease:'Back.Out'});
        cartao.on('pointerover',()=>{halo.setAlpha(1);this.tweens.add({targets:cartao,y:y-7,scale:1.035,duration:130,ease:'Sine.Out'});});
        cartao.on('pointerout',()=>{halo.setAlpha(0);this.tweens.add({targets:cartao,y,scale:1,duration:130,ease:'Sine.Out'});});
        cartao.on('pointerdown',()=>{this.tweens.add({targets:cartao,scale:.98,yoyo:true,duration:70});if(app.disponivel){this.cameras.main.fadeOut(220,255,255,255,(_camera:Phaser.Cameras.Scene2D.Camera,p:number)=>{if(p===1)this.scene.start(app.cena??'EducApp');});return;}this.mostrarEmBreve(app.nome,app.cor);});
    }

    private criarTag(x:number,y:number,texto:string,corTexto:number,fundo:number):Phaser.GameObjects.Container {
        const largura=texto.length*6.5+18,c=this.add.container(x,y);c.add([botaoRaster(this,0,0,largura,20,fundo),this.add.text(0,0,texto,{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:`#${corTexto.toString(16).padStart(6,'0')}`,letterSpacing:.25}).setOrigin(.5).setResolution(2)]);return c;
    }

    private criarIcone(tipo:TipoIcone,cor:number):Phaser.GameObjects.Container {
        const c=this.add.container(0,0);if(tipo==='rato'){c.add(this.add.image(0,1,'rato',1).setDisplaySize(76,76));return c;}if(tipo==='reino'){c.add(this.add.image(0,0,'reino-cavaleiro',0).setDisplaySize(36,92));return c;}if(tipo==='detetive'){c.add(this.add.image(0,0,'detetive-jogador',1).setDisplaySize(32,92));return c;}
        if(tipo==='escrita'){c.add(this.add.image(0,0,'detetive-objetos',0).setDisplaySize(52,66).setAngle(-12));
        }else if(tipo==='monta'){c.add([this.add.image(-17,0,'letra-A').setDisplaySize(38,38),this.add.image(17,0,'letra-B').setDisplaySize(38,38)]);
        }else if(tipo==='contagem'){(([[-25,9,'fruta-maca',37],[3,-9,'fruta-cereja',30],[27,11,'fruta-melancia',35]] as [number,number,string,number][])).forEach(([px,py,textura,tamanho])=>c.add(this.add.image(px,py,textura).setDisplaySize(tamanho,tamanho)));
        }else if(tipo==='soma'){c.add([this.add.image(-24,0,'fruta-maca').setDisplaySize(36,36),this.add.image(2,0,'ui-plus').setDisplaySize(18,18).setTint(cor),this.add.image(28,0,'fruta-cereja').setDisplaySize(34,34)]);
        }else c.add([this.add.image(-17,0,'letra-A').setDisplaySize(39,39),this.add.image(17,0,'letra-A').setDisplaySize(39,39).setTint(cor)]);return c;
    }

    private criarCadeado(x:number,y:number,cor:number):Phaser.GameObjects.Image {return this.add.image(x,y,'ui-lock').setDisplaySize(18,18).setTint(cor);}
    private mostrarEmBreve(nome:string,cor:number):void {this.aviso?.destroy(true);const fundo=painelRaster(this,0,6,310,66,0x183c31,.18),borda=painelRaster(this,0,0,314,70,cor,.55),painel=painelRaster(this,0,0,310,66,0xffffff,.99),texto=this.add.text(0,-2,`${nome}\nchega em breve!`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',color:'#345c4d',align:'center',lineSpacing:3}).setOrigin(.5);this.aviso=this.add.container(480,585,[fundo,borda,painel,texto]).setDepth(20).setAlpha(0).setScale(.9);this.tweens.add({targets:this.aviso,alpha:1,scale:1,duration:160,ease:'Back.Out'});this.time.delayedCall(1700,()=>{if(this.aviso)this.tweens.add({targets:this.aviso,alpha:0,y:576,duration:200,onComplete:()=>{this.aviso?.destroy(true);this.aviso=undefined;}});});}
}
