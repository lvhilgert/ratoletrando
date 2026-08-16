import * as Phaser from 'phaser';
import { PreferenciaVoz } from '../../services/PreferenciaVoz';
import { servicoVoz } from '../../services/ServicoVoz';

type TipoIcone='rato'|'escrita'|'monta'|'contagem'|'soma'|'memoria'|'reino'|'detetive';
interface Aplicativo {tipo:TipoIcone;nome:string;area:string;descricao:string;cor:number;corClara:number;disponivel:boolean;cena?:string}

const APLICATIVOS:Aplicativo[]=[
    {tipo:'rato',nome:'RatoLetrando',area:'LINGUAGEM',descricao:'Colete letras e forme palavras',cor:0x278b69,corClara:0xdaf1e8,disponivel:true,cena:'Menu'},
    {tipo:'escrita',nome:'Ouvi e Escrevi',area:'LINGUAGEM',descricao:'Ouça e escreva na tela',cor:0x3f82a3,corClara:0xddeef4,disponivel:true,cena:'OuviEscrevi'},
    {tipo:'monta',nome:'MontaPalavra',area:'LINGUAGEM',descricao:'Arraste letras e sílabas',cor:0x4c998c,corClara:0xdff1ed,disponivel:true,cena:'MontaPalavra'},
    {tipo:'contagem',nome:'ContaComigo',area:'MATEMÁTICA',descricao:'Conte objetos brincando',cor:0xd58a32,corClara:0xf8ead4,disponivel:true,cena:'ContaComigo'},
    {tipo:'soma',nome:'SomaTrilha',area:'MATEMÁTICA',descricao:'Resolva somas e subtrações',cor:0xc97939,corClara:0xf7e6d9,disponivel:true,cena:'SomaTrilha'},
    {tipo:'memoria',nome:'MemóLetras',area:'MISTA',descricao:'Encontre pares por associação',cor:0x7668a9,corClara:0xe9e5f4,disponivel:true,cena:'MemoLetras'},
    {tipo:'reino',nome:'Reino das Portas',area:'MISTA',descricao:'Explore e abra portas mágicas',cor:0x397a69,corClara:0xdcefe7,disponivel:true,cena:'ReinoDasPortas'},
    {tipo:'detetive',nome:'Detetive Mirim',area:'LINGUAGEM',descricao:'Investigue pistas e resolva casos',cor:0x55718c,corClara:0xe1eaf2,disponivel:true,cena:'DetetiveMirim'}
];

export class EducApp extends Phaser.Scene {
    private aviso?:Phaser.GameObjects.Container;
    constructor(){super('EducApp');}
    create():void {
        this.cameras.main.setBackgroundColor(0xeaf5ee);
        this.add.graphics().fillGradientStyle(0xf7fbf8,0xf7fbf8,0xdceee3,0xdceee3,1).fillRect(0,0,960,640);
        const decoracao=this.add.graphics().setAlpha(.45);
        decoracao.fillStyle(0xffffff,.72).fillCircle(84,74,54).fillCircle(895,110,70).fillCircle(70,568,76).fillCircle(908,570,50);
        decoracao.fillStyle(0xb8ddca,.3).fillCircle(130,34,20).fillCircle(842,40,15).fillCircle(34,455,18).fillCircle(930,390,24);
        this.add.text(480,45,'EducApp',{fontFamily:'Arial Rounded MT Bold, Arial Black, Arial',fontSize:'43px',fontStyle:'bold',color:'#245d49',shadow:{offsetY:2,color:'#ffffff',blur:0,fill:true}}).setOrigin(.5);
        this.add.text(480,82,'Escolha uma aventura para aprender!',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'17px',color:'#587568'}).setOrigin(.5);
        this.criarControleVoz();
        APLICATIVOS.forEach((app,i)=>this.criarCartao(app,120+(i%4)*240,211+Math.floor(i/4)*244));
    }

    private criarControleVoz():void {
        let ativa=PreferenciaVoz.obter();
        const controle=this.add.container(150,52).setSize(250,50).setInteractive({useHandCursor:true}).setDepth(10);
        const fundo=this.add.graphics(),icone=this.add.graphics(),rotulo=this.add.text(-4,-8,'ACESSIBILIDADE POR VOZ',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'8px',color:'#60776e',letterSpacing:.25}).setOrigin(.5),estado=this.add.text(-4,8,'',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'10px',fontStyle:'bold'}).setOrigin(.5),trilho=this.add.graphics(),botao=this.add.circle(0,0,10,0xffffff);
        const desenhar=()=>{
            fundo.clear().fillStyle(ativa?0xf5fbf8:0xffffff,.94).fillRoundedRect(-125,-25,250,50,17).lineStyle(2,ativa?0x4b9a78:0xc2cec9,.7).strokeRoundedRect(-125,-25,250,50,17);
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

    private criarCartao(app:Aplicativo,x:number,y:number):void {
        const cartao=this.add.container(x,y).setSize(210,216).setInteractive({useHandCursor:true});
        const sombra=this.add.graphics().fillStyle(0x315e4b,app.disponivel?.17:.1).fillRoundedRect(-103,-99,206,216,25);
        const base=this.add.graphics().fillStyle(0xffffff,app.disponivel?1:.96).fillRoundedRect(-103,-106,206,216,25);
        base.lineStyle(app.disponivel?3:2,app.cor,app.disponivel?.66:.28).strokeRoundedRect(-103,-106,206,216,25);
        const topo=this.add.graphics().fillStyle(app.corClara,1).fillRoundedRect(-94,-96,188,91,19).fillStyle(app.cor,.1).fillCircle(0,-51,43);
        const categoria=this.criarTag(-57,-83,app.area,app.cor,app.corClara);
        const destaque=app.disponivel?this.criarTag(51,-83,'JOGUE AGORA',0xffffff,app.cor):undefined;
        const icone=this.criarIcone(app.tipo,app.cor).setPosition(0,-48);
        if(app.disponivel)this.tweens.add({targets:icone,y:-52,yoyo:true,repeat:-1,duration:1500,ease:'Sine.InOut'});
        const nome=this.add.text(0,10,app.nome,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:app.nome.length>15?'17px':'19px',fontStyle:'bold',color:'#294f40'}).setOrigin(.5);
        const descricao=this.add.text(0,39,app.descricao,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',color:'#657d73',align:'center',wordWrap:{width:180}}).setOrigin(.5);
        cartao.add([sombra,base,topo,categoria]);if(destaque)cartao.add(destaque);cartao.add([icone,nome,descricao]);
        if(app.disponivel){
            const botao=this.add.container(0,80),sombraBotao=this.add.graphics().fillStyle(0x234d3d,.2).fillRoundedRect(-78,-14,156,37,18),fundoBotao=this.add.graphics().fillStyle(app.cor,1).fillRoundedRect(-78,-18,156,37,18),brilho=this.add.graphics().fillStyle(0xffffff,.14).fillRoundedRect(-68,-14,136,9,5),texto=this.add.text(0,0,'▶  JOGAR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'15px',color:'#ffffff'}).setOrigin(.5);
            botao.add([sombraBotao,fundoBotao,brilho,texto]);cartao.add(botao);
        }else{
            const selo=this.add.container(0,80);selo.add([this.add.graphics().fillStyle(0xe9efec,1).fillRoundedRect(-57,-15,114,30,15),this.criarCadeado(-37,0,0x76877f),this.add.text(12,0,'EM BREVE',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',color:'#687a72'}).setOrigin(.5)]);cartao.add(selo);
        }
        cartao.on('pointerover',()=>this.tweens.add({targets:cartao,y:y-5,scale:1.025,duration:130,ease:'Sine.Out'}));
        cartao.on('pointerout',()=>this.tweens.add({targets:cartao,y,scale:1,duration:130,ease:'Sine.Out'}));
        cartao.on('pointerdown',()=>{this.tweens.add({targets:cartao,scale:.98,yoyo:true,duration:70});if(app.disponivel){this.cameras.main.fadeOut(220,255,255,255,(_camera:Phaser.Cameras.Scene2D.Camera,p:number)=>{if(p===1)this.scene.start(app.cena??'EducApp');});return;}this.mostrarEmBreve(app.nome,app.cor);});
    }

    private criarTag(x:number,y:number,texto:string,corTexto:number,fundo:number):Phaser.GameObjects.Container {
        const largura=texto.length*6.1+17,c=this.add.container(x,y);c.add([this.add.graphics().fillStyle(fundo,1).fillRoundedRect(-largura/2,-10,largura,20,10),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'9px',color:`#${corTexto.toString(16).padStart(6,'0')}`,letterSpacing:.5}).setOrigin(.5)]);return c;
    }

    private criarIcone(tipo:TipoIcone,cor:number):Phaser.GameObjects.Container {
        const c=this.add.container(0,0),g=this.add.graphics();c.add(g);if(tipo==='rato'){c.add(this.add.image(0,1,'rato',1).setDisplaySize(76,76));return c;}if(tipo==='reino'){c.add(this.add.image(0,0,'reino-cavaleiro',0).setDisplaySize(36,92));return c;}if(tipo==='detetive'){c.add(this.add.image(0,0,'detetive-jogador',1).setDisplaySize(32,92));return c;}g.lineStyle(4,cor,1);
        if(tipo==='escrita'){g.fillStyle(0xffffff,1).fillRoundedRect(-27,-22,39,48,8).lineStyle(3,cor,.7).strokeRoundedRect(-27,-22,39,48,8);g.lineStyle(6,cor,1).lineBetween(-5,20,23,-15);g.fillStyle(cor,1).fillTriangle(18,-19,27,-10,29,-22);g.lineStyle(3,cor,.75).arc(24,-3,12,-.75,.75).arc(27,-3,20,-.7,.7);
        }else if(tipo==='monta'){[-29,2].forEach((px,i)=>{g.fillStyle(i?0xffffff:cor,1).fillRoundedRect(px,-18,27,35,7).lineStyle(3,cor,1).strokeRoundedRect(px,-18,27,35,7);c.add(this.add.text(px+13,-1,i?'B':'A',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'19px',color:i?`#${cor.toString(16).padStart(6,'0')}`:'#ffffff'}).setOrigin(.5));});
        }else if(tipo==='contagem'){[-23,0,23].forEach((px,i)=>{g.fillStyle(i===1?0xf09b42:0xe56e58,1).fillCircle(px,i===1?3:8,14);g.fillStyle(0x549b63,1).fillEllipse(px+6,i===1?-14:-9,10,6);});
        }else if(tipo==='soma'){g.fillStyle(cor,1).fillRoundedRect(-32,-5,51,27,7).fillRoundedRect(-17,-25,27,24,6);g.fillStyle(0xffffff,1).fillRect(-11,-20,15,10);g.fillStyle(0x52665d,1).fillCircle(-19,24,8).fillCircle(14,24,8);c.add(this.add.text(29,-9,'+',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'27px',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5));
        }else{g.fillStyle(cor,.92).fillRoundedRect(-31,-24,39,49,8);g.fillStyle(0xffffff,1).fillRoundedRect(-7,-20,39,49,8);g.lineStyle(3,cor,1).strokeRoundedRect(-7,-20,39,49,8);c.add(this.add.text(-12,1,'A',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',color:'#ffffff'}).setOrigin(.5));c.add(this.add.text(13,4,'A',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5));}return c;
    }

    private criarCadeado(x:number,y:number,cor:number):Phaser.GameObjects.Graphics {const g=this.add.graphics().setPosition(x,y);g.lineStyle(2,cor,1).arc(0,-3,5,Math.PI,0).strokePath();g.fillStyle(cor,1).fillRoundedRect(-7,-3,14,11,3);return g;}
    private mostrarEmBreve(nome:string,cor:number):void {this.aviso?.destroy(true);const fundo=this.add.graphics().fillStyle(0x183c31,.18).fillRoundedRect(-155,-29,310,66,19),painel=this.add.graphics().fillStyle(0xffffff,.99).fillRoundedRect(-155,-35,310,66,19).lineStyle(2,cor,.55).strokeRoundedRect(-155,-35,310,66,19),texto=this.add.text(0,-2,`${nome}\nchega em breve!`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',color:'#345c4d',align:'center',lineSpacing:3}).setOrigin(.5);this.aviso=this.add.container(480,585,[fundo,painel,texto]).setDepth(20).setAlpha(0).setScale(.9);this.tweens.add({targets:this.aviso,alpha:1,scale:1,duration:160,ease:'Back.Out'});this.time.delayedCall(1700,()=>{if(this.aviso)this.tweens.add({targets:this.aviso,alpha:0,y:576,duration:200,onComplete:()=>{this.aviso?.destroy(true);this.aviso=undefined;}});});}
}
