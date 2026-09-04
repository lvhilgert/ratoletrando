import * as Phaser from 'phaser';
import { PreferenciaAudio } from '../../services/PreferenciaAudio';
import { PreferenciaVoz } from '../../services/PreferenciaVoz';
import { servicoVoz } from '../../services/ServicoVoz';
import { audioJogo } from '../sistemas/SistemaAudio';

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
        const cabecalho=this.add.container(480,58).setDepth(3),sombra=this.add.graphics().fillStyle(0x285d4b,.12).fillRoundedRect(-192,-45,384,92,30),painel=this.add.graphics().fillStyle(0xffffff,.92).fillRoundedRect(-192,-49,384,92,30).lineStyle(1,0x76af98,.34).strokeRoundedRect(-192,-49,384,92,30);
        const marca=this.add.text(0,-25,'APRENDER • BRINCAR • DESCOBRIR',{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:'#287258',letterSpacing:1.4}).setOrigin(.5),titulo=this.add.text(0,1,'EducApp',{fontFamily:FONTE_UI,fontSize:'40px',fontStyle:'bold',color:'#175f48',stroke:'#ffffff',strokeThickness:2,shadow:{offsetY:2,color:'#8fbfad',blur:3,fill:true}}).setOrigin(.5),subtitulo=this.add.text(0,32,'Escolha uma aventura e aprenda brincando!',{fontFamily:FONTE_UI,fontSize:'15px',fontStyle:'bold',color:'#315e4e'}).setOrigin(.5);
        cabecalho.add([sombra,painel,marca,titulo,subtitulo]);
        this.criarControleVoz();
        this.criarControleAudio();
        const catalogo=this.add.container(480,351).setDepth(2),sombraCatalogo=this.add.graphics().fillStyle(0x275845,.1).fillRoundedRect(-458,-235,916,480,32),painelCatalogo=this.add.graphics().fillStyle(0xffffff,.44).fillRoundedRect(-458,-240,916,480,32).lineStyle(1,0xffffff,.9).strokeRoundedRect(-458,-240,916,480,32),secao=this.add.text(-425,-226,'AVENTURAS',{fontFamily:FONTE_UI,fontSize:'12px',fontStyle:'bold',color:'#205f48',letterSpacing:1.1}).setOrigin(0,.5),contador=this.add.text(425,-226,`${APLICATIVOS.length} JOGOS DISPONÍVEIS`,{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:'#3e6556'}).setOrigin(1,.5);catalogo.add([sombraCatalogo,painelCatalogo,secao,contador]);
        APLICATIVOS.forEach((app,i)=>this.criarCartao(app,120+(i%4)*240,232+Math.floor(i/4)*234,i));
        const rodape=this.add.container(480,614).setDepth(4),linha=this.add.graphics().lineStyle(2,0x3d8b6b,.2).lineBetween(-235,0,-88,0).lineBetween(88,0,235,0),dica=this.add.text(0,0,'ESCOLHA UMA AVENTURA PARA COMEÇAR',{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:'#254f40',letterSpacing:.8}).setOrigin(.5);rodape.add([linha,dica]);this.aplicarNitidezTextos();
    }

    private aplicarNitidezTextos():void {
        const visitar=(objeto:Phaser.GameObjects.GameObject):void=>{if(objeto instanceof Phaser.GameObjects.Text)objeto.setResolution(2);else if(objeto instanceof Phaser.GameObjects.Container)objeto.list.forEach(visitar);};
        this.children.list.forEach(visitar);
    }

    private criarFundoVivo():void {
        this.add.graphics().fillGradientStyle(0xfafffc,0xf4fcf7,0xcce9dc,0xb9dfd0,1).fillRect(0,0,960,640).fillStyle(0x4dad83,.08).fillEllipse(480,690,1120,310);
        const formas=this.add.graphics().setAlpha(.9);formas.fillStyle(0xffffff,.7).fillCircle(64,95,82).fillCircle(916,86,105).fillCircle(42,575,112).fillCircle(938,566,88);formas.fillStyle(0x75cba4,.18).fillCircle(135,126,35).fillCircle(852,155,31).fillCircle(80,415,27).fillCircle(894,390,38);formas.fillStyle(0xffd879,.16).fillCircle(30,260,18).fillCircle(925,267,24);
        for(let i=0;i<16;i++){const cor=i%3===0?0xffd56a:i%3===1?0x69c99e:0x8dbce5,particula=this.add.circle(Phaser.Math.Between(18,942),Phaser.Math.Between(105,615),Phaser.Math.Between(2,4),cor,.2).setDepth(1);this.tweens.add({targets:particula,y:particula.y-Phaser.Math.Between(18,42),x:particula.x+Phaser.Math.Between(-14,14),alpha:{from:.08,to:.35},yoyo:true,repeat:-1,duration:Phaser.Math.Between(2200,3900),delay:i*90,ease:'Sine.InOut'});}
    }

    private criarControleAudio():void {
        const controle=this.add.container(810,52).setDepth(10);
        const fundo=this.add.graphics().fillStyle(0xffffff,.92).fillRoundedRect(-135,-30,270,60,17).lineStyle(1,0x4b9a78,.42).strokeRoundedRect(-135,-30,270,60,17);
        const icone=this.add.graphics();
        icone.fillStyle(0x438b6d,1).fillRoundedRect(-120,-7,8,14,2).fillTriangle(-112,-7,-101,-14,-101,14);
        icone.lineStyle(2,0x438b6d,1).arc(-99,0,8,-.8,.8).strokePath();
        controle.add([fundo,icone]);

        const criarSlider=(y:number,rotulo:string,valorInicial:number,aoAlterar:(valor:number)=>void):void=>{
            const xInicio=23,largura=91;
            const texto=this.add.text(-88,y,rotulo,{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:'#385e50'}).setOrigin(0,.5);
            const trilho=this.add.graphics().fillStyle(0xc8dcd3,1).fillRoundedRect(xInicio,y-3,largura,6,3);
            const preenchimento=this.add.graphics();
            const botao=this.add.circle(xInicio+largura*valorInicial,y,8,0x438b6d).setStrokeStyle(2,0xffffff);
            const percentual=this.add.text(129,y,'',{fontFamily:FONTE_UI,fontSize:'9px',fontStyle:'bold',color:'#246b50'}).setOrigin(1,.5);
            const zona=this.add.zone(xInicio+largura/2,y,largura+18,22).setInteractive({useHandCursor:true});
            const desenhar=(valor:number)=>{const v=Math.max(0,Math.min(1,valor));preenchimento.clear().fillStyle(0x62b68d,1).fillRoundedRect(xInicio,y-3,Math.max(1,largura*v),6,3);botao.x=xInicio+largura*v;percentual.setText(`${Math.round(v*100)}%`);aoAlterar(v);};
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
        const fundo=this.add.graphics(),icone=this.add.graphics(),rotulo=this.add.text(-4,-8,'ACESSIBILIDADE POR VOZ',{fontFamily:FONTE_UI,fontSize:'9px',fontStyle:'bold',color:'#45685b',letterSpacing:.15}).setOrigin(.5),estado=this.add.text(-4,8,'',{fontFamily:FONTE_UI,fontSize:'11px',fontStyle:'bold'}).setOrigin(.5),trilho=this.add.graphics(),botao=this.add.circle(0,0,10,0xffffff);
        const desenhar=()=>{
            fundo.clear().fillStyle(ativa?0xf5fbf8:0xffffff,.92).fillRoundedRect(-125,-25,250,50,17).lineStyle(1,ativa?0x4b9a78:0xc2cec9,.45).strokeRoundedRect(-125,-25,250,50,17);
            icone.clear().fillStyle(ativa?0x438b6d:0x7a8b84,1).fillRoundedRect(-108,-7,9,14,2).fillTriangle(-99,-7,-87,-15,-87,15);
            icone.lineStyle(2,ativa?0x438b6d:0x7a8b84,1).arc(-85,0,9,-.8,.8).strokePath().arc(-85,0,15,-.7,.7).strokePath();
            if(!ativa)icone.lineStyle(3,0xb86666,1).lineBetween(-108,-15,-79,15);
            trilho.clear().fillStyle(ativa?0x62b68d:0xc8d2ce,1).fillRoundedRect(82,-12,38,24,12);botao.setPosition(ativa?108:94,0);
            estado.setText(ativa?'VOZ ATIVADA':'VOZ DESATIVADA').setColor(ativa?'#34785b':'#74867e');
        };
        controle.add([fundo,icone,rotulo,estado,trilho,botao]);desenhar();
        controle.on('pointerover',()=>this.tweens.add({targets:controle,scale:1.025,duration:90}));controle.on('pointerout',()=>this.tweens.add({targets:controle,scale:1,duration:90}));
        controle.on('pointerdown',()=>{ativa=!ativa;PreferenciaVoz.definir(ativa);if(ativa)servicoVoz.falar('Acessibilidade por voz ativada.');else servicoVoz.parar();desenhar();this.tweens.add({targets:botao,scale:1.2,yoyo:true,duration:100});});
    }

    private criarCartao(app:Aplicativo,x:number,y:number,indice:number):void {
        const cartao=this.add.container(x,y).setSize(210,216).setInteractive({useHandCursor:true}).setDepth(5).setAlpha(0).setScale(.9);
        const destaqueReino=app.tipo==='reino',sombra=this.add.graphics().fillStyle(0x234f3f,app.disponivel?.16:.08).fillRoundedRect(-105,-97,210,220,27),halo=this.add.graphics().lineStyle(4,app.cor,.24).strokeRoundedRect(-108,-111,216,226,29).setAlpha(0);
        const base=this.add.graphics().fillStyle(0xffffff,app.disponivel?1:.96).fillRoundedRect(-103,-106,206,216,25);base.lineStyle(destaqueReino?3:1,destaqueReino?0xd89a3f:0x78998c,destaqueReino?.85:.28).strokeRoundedRect(-103,-106,206,216,25);
        const faixa=this.add.graphics().fillStyle(app.cor,1).fillRoundedRect(-103,-72,6,142,3),topo=this.add.graphics().fillGradientStyle(app.corClara,app.corClara,0xffffff,0xffffff,1).fillRoundedRect(-94,-96,188,91,19).fillStyle(app.cor,.11).fillCircle(0,-51,44).lineStyle(1,0xffffff,.9).strokeCircle(0,-51,39);
        const categoria=this.criarTag(-57,-83,app.area,app.cor,app.corClara);
        const destaque=destaqueReino?this.criarTag(51,-83,'DESTAQUE',0xffffff,0xd48028):undefined;
        const icone=this.criarIcone(app.tipo,app.cor).setPosition(0,-48);
        if(app.disponivel)this.tweens.add({targets:icone,y:-53,yoyo:true,repeat:-1,duration:1350+indice*85,delay:indice*90,ease:'Sine.InOut'});
        const nome=this.add.text(0,10,app.nome,{fontFamily:FONTE_UI,fontSize:app.nome.length>15?'18px':'20px',fontStyle:'bold',color:'#123c2e'}).setOrigin(.5).setResolution(2);
        const descricao=this.add.text(0,40,app.descricao,{fontFamily:FONTE_UI,fontSize:'13px',color:'#365d4e',align:'center',lineSpacing:4,wordWrap:{width:182}}).setOrigin(.5).setResolution(2);
        cartao.add([halo,sombra,base,faixa,topo,categoria]);if(destaque)cartao.add(destaque);cartao.add([icone,nome,descricao]);
        if(app.disponivel){
            const botao=this.add.container(0,80),sombraBotao=this.add.graphics().fillStyle(0x173b2f,.22).fillRoundedRect(-82,-13,164,39,19),fundoBotao=this.add.graphics().fillStyle(app.cor,1).fillRoundedRect(-82,-18,164,39,19),brilho=this.add.graphics().fillStyle(0xffffff,.16).fillRoundedRect(-72,-14,144,8,4),texto=this.add.text(-8,0,'COMEÇAR',{fontFamily:FONTE_UI,fontSize:'14px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5).setResolution(2),seta=this.add.text(57,-1,'→',{fontFamily:FONTE_UI,fontSize:'20px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5).setResolution(2);
            botao.add([sombraBotao,fundoBotao,brilho,texto,seta]);cartao.add(botao);
        }else{
            const selo=this.add.container(0,80);selo.add([this.add.graphics().fillStyle(0xe9efec,1).fillRoundedRect(-57,-15,114,30,15),this.criarCadeado(-37,0,0x76877f),this.add.text(12,0,'EM BREVE',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#687a72'}).setOrigin(.5)]);cartao.add(selo);
        }
        this.tweens.add({targets:cartao,alpha:1,scale:1,duration:360,delay:110+indice*65,ease:'Back.Out'});
        cartao.on('pointerover',()=>{halo.setAlpha(1);this.tweens.add({targets:cartao,y:y-7,scale:1.035,duration:130,ease:'Sine.Out'});});
        cartao.on('pointerout',()=>{halo.setAlpha(0);this.tweens.add({targets:cartao,y,scale:1,duration:130,ease:'Sine.Out'});});
        cartao.on('pointerdown',()=>{this.tweens.add({targets:cartao,scale:.98,yoyo:true,duration:70});if(app.disponivel){this.cameras.main.fadeOut(220,255,255,255,(_camera:Phaser.Cameras.Scene2D.Camera,p:number)=>{if(p===1)this.scene.start(app.cena??'EducApp');});return;}this.mostrarEmBreve(app.nome,app.cor);});
    }

    private criarTag(x:number,y:number,texto:string,corTexto:number,fundo:number):Phaser.GameObjects.Container {
        const largura=texto.length*6.5+18,c=this.add.container(x,y);c.add([this.add.graphics().fillStyle(fundo,1).fillRoundedRect(-largura/2,-10,largura,20,10),this.add.text(0,0,texto,{fontFamily:FONTE_UI,fontSize:'10px',fontStyle:'bold',color:`#${corTexto.toString(16).padStart(6,'0')}`,letterSpacing:.25}).setOrigin(.5).setResolution(2)]);return c;
    }

    private criarIcone(tipo:TipoIcone,cor:number):Phaser.GameObjects.Container {
        const c=this.add.container(0,0),g=this.add.graphics();c.add(g);if(tipo==='rato'){c.add(this.add.image(0,1,'rato',1).setDisplaySize(76,76));return c;}if(tipo==='reino'){c.add(this.add.image(0,0,'reino-cavaleiro',0).setDisplaySize(36,92));return c;}if(tipo==='detetive'){c.add(this.add.image(0,0,'detetive-jogador',1).setDisplaySize(32,92));return c;}g.lineStyle(4,cor,1);
        if(tipo==='escrita'){g.fillStyle(0xffffff,1).fillRoundedRect(-27,-30,42,60,8).lineStyle(3,cor,.65).strokeRoundedRect(-27,-30,42,60,8);g.lineStyle(2,cor,.28).lineBetween(-20,-12,7,-12).lineBetween(-20,0,7,0).lineBetween(-20,12,7,12).lineBetween(-20,24,-2,24);c.add(this.add.image(13,6,'detetive-objetos',0).setDisplaySize(46,58).setAngle(-12));
        }else if(tipo==='monta'){[-29,2].forEach((px,i)=>{g.fillStyle(i?0xffffff:cor,1).fillRoundedRect(px,-18,27,35,7).lineStyle(3,cor,1).strokeRoundedRect(px,-18,27,35,7);c.add(this.add.text(px+13,-1,i?'B':'A',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'19px',color:i?`#${cor.toString(16).padStart(6,'0')}`:'#ffffff'}).setOrigin(.5));});
        }else if(tipo==='contagem'){(([[-25,9,'fruta-maca',37],[3,-9,'fruta-cereja',30],[27,11,'fruta-melancia',35]] as [number,number,string,number][])).forEach(([px,py,textura,tamanho])=>c.add(this.add.image(px,py,textura).setDisplaySize(tamanho,tamanho)));
        }else if(tipo==='soma'){g.fillStyle(cor,1).fillRoundedRect(-32,-5,51,27,7).fillRoundedRect(-17,-25,27,24,6);g.fillStyle(0xffffff,1).fillRect(-11,-20,15,10);g.fillStyle(0x52665d,1).fillCircle(-19,24,8).fillCircle(14,24,8);c.add(this.add.text(29,-9,'+',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'27px',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5));
        }else{g.fillStyle(cor,.92).fillRoundedRect(-31,-24,39,49,8);g.fillStyle(0xffffff,1).fillRoundedRect(-7,-20,39,49,8);g.lineStyle(3,cor,1).strokeRoundedRect(-7,-20,39,49,8);c.add(this.add.text(-12,1,'A',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',color:'#ffffff'}).setOrigin(.5));c.add(this.add.text(13,4,'A',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5));}return c;
    }

    private criarCadeado(x:number,y:number,cor:number):Phaser.GameObjects.Graphics {const g=this.add.graphics().setPosition(x,y);g.lineStyle(2,cor,1).arc(0,-3,5,Math.PI,0).strokePath();g.fillStyle(cor,1).fillRoundedRect(-7,-3,14,11,3);return g;}
    private mostrarEmBreve(nome:string,cor:number):void {this.aviso?.destroy(true);const fundo=this.add.graphics().fillStyle(0x183c31,.18).fillRoundedRect(-155,-29,310,66,19),painel=this.add.graphics().fillStyle(0xffffff,.99).fillRoundedRect(-155,-35,310,66,19).lineStyle(2,cor,.55).strokeRoundedRect(-155,-35,310,66,19),texto=this.add.text(0,-2,`${nome}\nchega em breve!`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',color:'#345c4d',align:'center',lineSpacing:3}).setOrigin(.5);this.aviso=this.add.container(480,585,[fundo,painel,texto]).setDepth(20).setAlpha(0).setScale(.9);this.tweens.add({targets:this.aviso,alpha:1,scale:1,duration:160,ease:'Back.Out'});this.time.delayedCall(1700,()=>{if(this.aviso)this.tweens.add({targets:this.aviso,alpha:0,y:576,duration:200,onComplete:()=>{this.aviso?.destroy(true);this.aviso=undefined;}});});}
}
