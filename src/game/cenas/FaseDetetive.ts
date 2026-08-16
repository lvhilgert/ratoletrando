import * as Phaser from 'phaser';
import { servicoVoz } from '../../services/ServicoVoz';
import { obterCaso, proximoCasoId, CASOS_JOGAVEIS } from '../dados/casosDetetive';
import { FaseDetetiveConfig, PersonagemConfig, PistaConfig } from '../dados/tiposDetetive';
import { DetetiveJogador } from '../entidades/DetetiveJogador';
import { audioJogo } from '../sistemas/SistemaAudio';
import { confirmarSaidaParaEducApp } from '../sistemas/ConfirmacaoSaida';
import { progressoDetetive } from '../sistemas/ProgressoDetetive';

interface Interacao {x:number;y:number;rotulo:string;executar:()=>void}
type Marcacao='neutro'|'descartado'|'suspeito';

export class FaseDetetive extends Phaser.Scene {
    private caso!:FaseDetetiveConfig;
    private jogador!:DetetiveJogador;private areaAtual='';private conteudo!:Phaser.GameObjects.Container;
    private cursores!:Phaser.Types.Input.Keyboard.CursorKeys;private teclas!:Record<string,Phaser.Input.Keyboard.Key>;
    private touch={esquerda:false,direita:false,cima:false,baixo:false};private bloqueado=true;private trocando=false;
    private interacoes:Interacao[]=[];private proxima?:Interacao;private botaoInteragir!:Phaser.GameObjects.Container;private textoInteragir!:Phaser.GameObjects.Text;
    private pistas=new Set<string>();private textoPistas!:Phaser.GameObjects.Text;private resolver?:Phaser.GameObjects.Container;
    private modal?:Phaser.GameObjects.Container;private marcacoes:Record<string,Marcacao>={};
    private contadorDicas=0;

    constructor(){super('FaseDetetive');}
    init(dados:{casoId:string}):void {this.caso=obterCaso(dados.casoId)!;}

    create():void {
        this.areaAtual=this.caso.areaInicial;this.pistas=new Set();this.bloqueado=true;this.contadorDicas=0;this.trocando=false;
        this.modal=undefined;this.resolver=undefined;this.proxima=undefined;this.interacoes=[];
        this.marcacoes={};this.caso.personagens.forEach(p=>this.marcacoes[p.id]='neutro');
        this.cameras.main.setBackgroundColor(0xe9ddbd);this.criarAnimacoes();
        this.conteudo=this.add.container(0,0);
        const [px,py]=this.caso.posicaoInicial;this.jogador=new DetetiveJogador(this,px,py);
        this.cursores=this.input.keyboard!.createCursorKeys();this.teclas=this.input.keyboard!.addKeys('W,A,S,D,E,SPACE') as Record<string,Phaser.Input.Keyboard.Key>;this.input.keyboard!.on('keydown-E',()=>this.interagir());
        this.criarHUD();this.criarControles();this.renderizarArea();this.mostrarIntroducao();
        audioJogo.iniciarMusicaDetetive();this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{audioJogo.pararMusicaDetetive();servicoVoz.parar();});
    }
    update():void {
        if(this.bloqueado)return;
        const dx=(this.touch.direita||this.cursores.right.isDown||this.teclas.D.isDown?1:0)-(this.touch.esquerda||this.cursores.left.isDown||this.teclas.A.isDown?1:0);
        const dy=(this.touch.baixo||this.cursores.down.isDown||this.teclas.S.isDown?1:0)-(this.touch.cima||this.cursores.up.isDown||this.teclas.W.isDown?1:0);
        this.jogador.mover(dx,dy);this.verificarTransicao(dx,dy);this.atualizarInteracao();
    }
    private criarAnimacoes():void {
        const criar=(key:string,frames:number[])=>{if(!this.anims.exists(key))this.anims.create({key,frames:this.anims.generateFrameNumbers('detetive-jogador',{frames}),frameRate:7,repeat:-1});};criar('detetive-baixo',[0,1,2]);criar('detetive-cima',[3,4,5]);criar('detetive-lado',[6,7,8,9,10,11]);
    }
    private area():import('../dados/tiposDetetive').AreaDetetiveConfig {return this.caso.areas.find(a=>a.id===this.areaAtual)!;}
    private renderizarArea():void {
        this.conteudo.removeAll(true);this.interacoes=[];
        const area=this.area();
        if(area.textura==='procedural'){area.decoracao?.(this,this.conteudo);}
        else {this.conteudo.add(this.add.image(480,320,area.textura,area.frame).setDisplaySize(960,640).setDepth(0));area.decoracao?.(this,this.conteudo);}
        this.conteudo.add(this.add.rectangle(480,91,320,39,0x234f49,.82).setStrokeStyle(2,0xffffff,.55).setDepth(2));
        this.conteudo.add(this.add.text(480,91,area.nome,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5).setDepth(3));
        this.criarSetasSaida(area.saidas);
        this.caso.personagens.filter(p=>p.area===this.areaAtual).forEach(p=>this.criarNPC(p));
        this.caso.pistas.filter(p=>p.area===this.areaAtual&&!(p.posicao[0]===0&&p.posicao[1]===0)).forEach(p=>this.criarObjetoPista(p));
    }
    private criarSetasSaida(saidas:Partial<Record<'esquerda'|'direita'|'cima'|'baixo',string>>):void {
        (Object.keys(saidas) as Array<keyof typeof saidas>).forEach(dir=>{const pos={esquerda:[22,340,'◀'],direita:[938,340,'▶'],cima:[480,110,'▲'],baixo:[480,612,'▼']}[dir] as [number,number,string];this.conteudo.add(this.add.text(pos[0],pos[1],pos[2],{fontFamily:'Arial',fontSize:'25px',color:'#ffffff',backgroundColor:'#347568',padding:{x:7,y:4}}).setOrigin(.5).setDepth(5).setAlpha(.78));});
    }
    private criarNPC(p:PersonagemConfig):void {
        const [x,y]=p.posicao;
        const npc=p.frame!==undefined?this.add.image(x,y,'detetive-suspeitos',p.frame).setDisplaySize(122,162).setDepth(7):this.desenharAvatar(x,y,p.cor??0x8899aa);
        this.conteudo.add(npc);const fala=this.add.image(x+45,y-78,'detetive-objetos',5).setDisplaySize(37,37).setDepth(8);this.conteudo.add(fala);this.tweens.add({targets:fala,y:y-84,yoyo:true,repeat:-1,duration:700});
        this.interacoes.push({x,y,rotulo:'💬 CONVERSAR',executar:()=>this.dialogar(p)});
    }
    private desenharAvatar(x:number,y:number,cor:number):Phaser.GameObjects.Container {
        const g=this.add.graphics();g.fillStyle(cor,1).fillCircle(0,0,44).fillStyle(0xffffff,1).fillCircle(-14,-6,9).fillCircle(14,-6,9).fillStyle(0x2a2a2a,1).fillCircle(-14,-4,4).fillCircle(14,-4,4);g.lineStyle(4,0x2a2a2a,1).beginPath().arc(0,10,16,0.15,Math.PI-0.15,false).strokePath();
        return this.add.container(x,y,[g]).setDepth(7);
    }
    private criarObjetoPista(p:PistaConfig):void {
        const [x,y]=p.posicao;const obj=p.frame!==undefined?this.add.image(x,y,'detetive-objetos',p.frame).setDisplaySize(60,74).setDepth(6):this.add.circle(x,y,24,p.cor??0xf0d955).setStrokeStyle(3,0xffffff,.7).setDepth(6);
        this.conteudo.add(obj);
        if(!this.pistas.has(p.id)){const brilho=this.add.star(x+28,y-28,4,6,13,0xfff2a0,.95).setDepth(8);this.conteudo.add(brilho);this.tweens.add({targets:brilho,scale:1.3,alpha:.4,angle:60,yoyo:true,repeat:-1,duration:650});}
        this.interacoes.push({x,y,rotulo:'🔍 INVESTIGAR',executar:()=>this.investigar(p)});
    }
    private verificarTransicao(dx:number,dy:number):void {
        if(this.trocando)return;const saidas=this.area().saidas;let destino:string|undefined;const px=this.jogador.x,py=this.jogador.y;
        if(dx>0&&px>=916)destino=saidas.direita;if(dx<0&&px<=44)destino=saidas.esquerda;if(dy>0&&py>=582)destino=saidas.baixo;if(dy<0&&py<=108)destino=saidas.cima;
        if(!destino)return;this.trocando=true;
        this.cameras.main.fadeOut(120,255,255,255,(_c:Phaser.Cameras.Scene2D.Camera,p:number)=>{if(p!==1)return;this.areaAtual=destino!;this.renderizarArea();this.jogador.setPosition(dx>0?65:dx<0?895:this.jogador.x,dy>0?130:dy<0?555:this.jogador.y).setDepth(12);this.cameras.main.fadeIn(140,255,255,255);this.time.delayedCall(180,()=>this.trocando=false);});
    }
    private atualizarInteracao():void {
        this.proxima=this.interacoes.reduce<Interacao|undefined>((melhor,i)=>{const d=Phaser.Math.Distance.Between(this.jogador.x,this.jogador.y,i.x,i.y);return d<135&&(!melhor||d<Phaser.Math.Distance.Between(this.jogador.x,this.jogador.y,melhor.x,melhor.y))?i:melhor;},undefined);
        this.botaoInteragir.setVisible(Boolean(this.proxima));if(this.proxima)this.textoInteragir.setText(this.proxima.rotulo);
    }
    private interagir():void {if(!this.bloqueado)this.proxima?.executar();}
    private dialogar(p:PersonagemConfig):void {audioJogo.efeito('dialogo');this.abrirDialogo(p.nome,p.dialogo,()=>{if(p.pistaId){const pista=this.caso.pistas.find(pi=>pi.id===p.pistaId);if(pista)this.registrarPista(pista);}});}
    private investigar(p:PistaConfig):void {if(this.pistas.has(p.id)){this.abrirDialogo('ANOTAÇÃO',[p.texto]);return;}this.registrarPista(p);this.abrirDialogo('NOVA PISTA!',[p.texto]);}
    private registrarPista(p:PistaConfig):void {
        if(this.pistas.has(p.id))return;this.pistas.add(p.id);audioJogo.efeito('pista');this.textoPistas.setText(`🔍  PISTAS: ${this.pistas.size}/${this.caso.pistas.length}`);this.criarCelebracao();
        if(this.pistas.size>=this.caso.minPistasParaResolver&&!this.resolver)this.criarBotaoResolver();
        this.renderizarArea();
    }
    private abrirDialogo(titulo:string,linhas:string[],aoFechar?:()=>void):void {
        if(this.modal)return;this.bloqueado=true;let indice=0;
        const c=this.criarBaseModal(480,390,700,250);this.modal=c;
        const textoTitulo=this.add.text(-305,-80,titulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',fontStyle:'bold',color:'#34695f'}).setOrigin(0,.5);
        const textoCorpo=this.add.text(-305,-20,linhas[0],{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'20px',color:'#3f544d',wordWrap:{width:600},lineSpacing:7}).setOrigin(0,.5);
        c.add([textoTitulo,textoCorpo]);
        const ouvir=this.botao(-230,76,110,42,'🔊 OUVIR',0x548aa0);c.add(ouvir);ouvir.on('pointerdown',()=>servicoVoz.falar(linhas[indice],{obrigatoria:true}));
        const ok=this.botao(215,76,130,42,linhas.length>1?'PRÓXIMO':'ENTENDI',0x429272);c.add(ok);
        const textoOk=ok.getData('texto') as Phaser.GameObjects.Text;
        ok.on('pointerdown',()=>{
            if(indice<linhas.length-1){indice++;textoCorpo.setText(linhas[indice]);textoOk.setText(indice<linhas.length-1?'PRÓXIMO':'ENTENDI');return;}
            c.destroy(true);this.modal=undefined;this.bloqueado=false;aoFechar?.();
        });
    }
    private criarHUD():void {
        const hud=this.add.container(0,0).setDepth(40);hud.add(this.add.rectangle(480,34,930,56,0x173e38,.82).setStrokeStyle(2,0xffffff,.3));
        this.textoPistas=this.add.text(45,34,`🔍  PISTAS: 0/${this.caso.pistas.length}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',fontStyle:'bold',color:'#ffffff'}).setOrigin(0,.5);hud.add(this.textoPistas);
        const dica=this.botao(560,34,110,42,'💡 DICA',0xc48a3d),caderno=this.botao(700,34,150,42,'📒 CADERNO',0x4f836e),sair=this.botao(870,34,130,42,'‹ EDUCAPP',0x55778a);
        hud.add([dica,caderno,sair]);dica.on('pointerdown',()=>this.mostrarDica());caderno.on('pointerdown',()=>this.abrirCaderno());sair.on('pointerdown',()=>confirmarSaidaParaEducApp(this,{aoAbrir:()=>this.bloqueado=true,aoCancelar:()=>this.bloqueado=false}));
    }
    private mostrarDica():void {if(this.modal)return;const texto=this.caso.dicas[Math.min(this.contadorDicas,this.caso.dicas.length-1)];this.contadorDicas++;this.abrirDialogo('💡 DICA',[texto]);}
    private criarControles():void {
        const press=(x:number,y:number,label:string,chave:keyof typeof this.touch)=>{const c=this.add.container(x,y).setDepth(45).setSize(64,64).setInteractive({useHandCursor:true});c.add([this.add.circle(0,3,30,0x173e38,.25),this.add.circle(0,0,30,0x36796b,.7).setStrokeStyle(2,0xffffff,.6),this.add.text(0,0,label,{fontFamily:'Arial',fontSize:'22px',color:'#ffffff'}).setOrigin(.5)]);const on=()=>{this.touch[chave]=true;c.setScale(.92);},off=()=>{this.touch[chave]=false;c.setScale(1);};c.on('pointerdown',on).on('pointerup',off).on('pointerout',off);};
        press(75,545,'◀','esquerda');press(145,545,'▶','direita');press(110,475,'▲','cima');press(110,605,'▼','baixo');
        this.botaoInteragir=this.botao(800,555,230,58,'💬 INTERAGIR',0xbd7b3f).setDepth(45).setVisible(false);this.textoInteragir=this.botaoInteragir.getData('texto') as Phaser.GameObjects.Text;this.botaoInteragir.on('pointerdown',()=>this.interagir());
    }
    private mostrarIntroducao():void {
        const c=this.criarBaseModal(480,320,710,380);this.modal=c;
        c.add([this.add.image(-250,-85,'detetive-objetos',4).setDisplaySize(130,130),this.add.text(70,-120,this.caso.titulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'25px',fontStyle:'bold',color:'#315f56',align:'center',wordWrap:{width:470}}).setOrigin(.5),this.add.text(70,-30,this.caso.introducao,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'19px',color:'#536a62',align:'center',wordWrap:{width:430},lineSpacing:7}).setOrigin(.5)]);
        const comecar=this.botao(70,105,220,55,'COMEÇAR  🔍',0x3d9271);c.add(comecar);comecar.on('pointerdown',()=>{c.destroy(true);this.modal=undefined;this.bloqueado=false;});
    }
    private abrirCaderno():void {
        if(this.modal)return;audioJogo.efeito('caderno');this.bloqueado=true;const c=this.criarBaseModal(480,330,850,540);this.modal=c;
        const titulo=this.add.text(0,-225,'📒  CADERNO DO DETETIVE',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'24px',fontStyle:'bold',color:'#315f56'}).setOrigin(.5),area=this.add.container(0,10);c.add([titulo,area]);
        const mostrarPistas=()=>{area.removeAll(true);const lista=this.pistas.size?[...this.pistas].map(id=>`✓ ${this.caso.pistas.find(p=>p.id===id)!.titulo}`).join('\n\n'):'Nenhuma pista encontrada ainda.';area.add(this.add.text(-355,-135,lista,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'17px',color:'#40584f',lineSpacing:6,wordWrap:{width:710}}));};
        const mostrarSuspeitos=()=>{area.removeAll(true);this.caso.personagens.forEach((p,i)=>this.criarCardSuspeito(area,p,-270+(i%4)*180,Math.floor(i/4)*260));};
        const pistas=this.botao(-110,-178,180,40,'PISTAS',0x4c8d72),suspeitos=this.botao(110,-178,180,40,'PERSONAGENS',0x657fa0),fechar=this.botao(0,225,160,42,'FECHAR',0x7b817e);
        c.add([pistas,suspeitos,fechar]);pistas.on('pointerdown',mostrarPistas);suspeitos.on('pointerdown',mostrarSuspeitos);fechar.on('pointerdown',()=>{c.destroy(true);this.modal=undefined;this.bloqueado=false;});mostrarPistas();
    }
    private criarCardSuspeito(area:Phaser.GameObjects.Container,p:PersonagemConfig,x:number,y:number):void {
        const card=this.add.container(x,y),bg=this.add.graphics().fillStyle(0xf4f0df,1).fillRoundedRect(-78,-125,156,250,19).lineStyle(3,0x78968a,.5).strokeRoundedRect(-78,-125,156,250,19);
        const img=p.frame!==undefined?this.add.image(0,-62,'detetive-suspeitos',p.frame).setDisplaySize(86,105):this.desenharAvatar(0,-62,p.cor??0x8899aa);
        const info=this.add.text(0,20,p.nome,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',color:'#40584f',align:'center',lineSpacing:4}).setOrigin(.5);
        const marcar=this.botao(0,90,132,36,'SEM MARCA',0x75827d);card.add([bg,img,info,marcar]);area.add(card);
        const atualizar=()=>{const estado=this.marcacoes[p.id];(marcar.getData('texto') as Phaser.GameObjects.Text).setText(estado==='neutro'?'SEM MARCA':estado==='descartado'?'❌ DESCARTADO':'⭐ SUSPEITO');};
        marcar.on('pointerdown',()=>{this.marcacoes[p.id]=this.marcacoes[p.id]==='neutro'?'descartado':this.marcacoes[p.id]==='descartado'?'suspeito':'neutro';atualizar();});atualizar();
    }
    private criarBotaoResolver():void {this.resolver=this.botao(400,34,255,42,'🔎 RESOLVER O CASO',0xb17439).setDepth(45);this.resolver.on('pointerdown',()=>this.abrirDeducao());this.tweens.add({targets:this.resolver,scale:1.05,yoyo:true,repeat:3,duration:220});}
    private abrirDeducao():void {
        if(this.modal)return;this.bloqueado=true;const c=this.criarBaseModal(480,330,850,520);this.modal=c;
        c.add(this.add.text(0,-205,this.caso.perguntaFinal,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:this.caso.perguntaFinal.length>26?'21px':'26px',fontStyle:'bold',color:'#315f56',align:'center',wordWrap:{width:760}}).setOrigin(.5));
        if(this.caso.tipoResposta==='personagem'){
            this.caso.opcoesResposta.forEach((op,i)=>{const x=-285+i*190,b=this.add.container(x,25).setSize(160,250).setInteractive({useHandCursor:true}),g=this.add.graphics().fillStyle(0xf7f2df,1).fillRoundedRect(-76,-120,152,240,20).lineStyle(3,0xd1ad61,.65).strokeRoundedRect(-76,-120,152,240,20),img=op.frame!==undefined?this.add.image(0,-38,'detetive-suspeitos',op.frame).setDisplaySize(120,150):this.desenharAvatar(0,-38,0x8899aa),nome=this.add.text(0,82,op.rotulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',fontStyle:'bold',color:'#40584f'}).setOrigin(.5);b.add([g,img,nome]);c.add(b);b.on('pointerdown',()=>this.escolherResposta(op.id,c));});
        } else {
            this.caso.opcoesResposta.forEach((op,i)=>{const b=this.botao(0,-90+i*80,650,64,op.rotulo,0x4c8d72);c.add(b);b.on('pointerdown',()=>this.escolherResposta(op.id,c));});
        }
        const voltar=this.botao(0,205,180,40,'VOLTAR',0x71807a);c.add(voltar);voltar.on('pointerdown',()=>{c.destroy(true);this.modal=undefined;this.bloqueado=false;});
    }
    private escolherResposta(id:string,c:Phaser.GameObjects.Container):void {
        if(id!==this.caso.respostaCorreta){audioJogo.efeito('erro');const aviso=this.add.text(0,168,'Essa pista ainda não combina. Vamos pensar outra vez?',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',color:'#a05248',backgroundColor:'#fff1e9',padding:{x:15,y:8}}).setOrigin(.5);c.add(aviso);this.time.delayedCall(1800,()=>aviso.destroy());return;}
        c.destroy(true);this.modal=undefined;this.mostrarFinal();
    }
    private mostrarFinal():void {
        audioJogo.efeito('caso');this.bloqueado=true;progressoDetetive.concluirFase(this.caso.id);
        const c=this.criarBaseModal(480,320,790,480);this.modal=c;
        c.add([this.add.image(-260,-20,'detetive-objetos',4).setDisplaySize(150,150),this.add.text(75,-155,'CASO RESOLVIDO!',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'31px',fontStyle:'bold',color:'#34805f'}).setOrigin(.5),this.add.text(75,-45,this.caso.solucao,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',color:'#40584f',align:'center',wordWrap:{width:420},lineSpacing:7}).setOrigin(.5)]);
        const proximoId=proximoCasoId(this.caso.id),temProximo=Boolean(proximoId&&CASOS_JOGAVEIS[proximoId]);
        const ouvir=this.botao(temProximo?-95:-10,125,120,44,'🔊 OUVIR',0x568ca0);c.add(ouvir);ouvir.on('pointerdown',()=>servicoVoz.falar(this.caso.solucao,{obrigatoria:true}));
        if(temProximo){const proximo=this.botao(75,125,150,44,'PRÓXIMO CASO',0x478d6d);c.add(proximo);proximo.on('pointerdown',()=>this.scene.start('FaseDetetive',{casoId:proximoId}));}
        const casos=this.botao(temProximo?245:150,125,145,44,'CASOS',0x557f9c);c.add(casos);casos.on('pointerdown',()=>this.scene.start('CasosDetetive'));
        this.criarCelebracao(36);
    }
    private criarBaseModal(x:number,y:number,w:number,h:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setDepth(100);c.add([this.add.rectangle(0,0,960,640,0x193a34,.55),this.add.graphics().fillStyle(0x183e36,.2).fillRoundedRect(-w/2,-h/2+9,w,h,28).fillStyle(0xfffdf4,1).fillRoundedRect(-w/2,-h/2,w,h,28).lineStyle(4,0xd2ae62,.9).strokeRoundedRect(-w/2,-h/2,w,h,28)]);c.setAlpha(0).setScale(.94);this.tweens.add({targets:c,alpha:1,scale:1,duration:180,ease:'Back.Out'});return c;}
    private criarCelebracao(q=16):void {for(let i=0;i<q;i++){const p=this.add.image(Phaser.Math.Between(220,740),Phaser.Math.Between(120,450),'detetive-objetos',6).setDisplaySize(Phaser.Math.Between(15,30),Phaser.Math.Between(15,30)).setDepth(130);this.tweens.add({targets:p,y:p.y-Phaser.Math.Between(50,130),x:p.x+Phaser.Math.Between(-55,55),alpha:0,angle:180,duration:Phaser.Math.Between(500,950),onComplete:()=>p.destroy()});}}
    private botao(x:number,y:number,w:number,h:number,texto:string,cor:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setSize(w,h).setInteractive({useHandCursor:true}),g=this.add.graphics().fillStyle(0x244b42,.18).fillRoundedRect(-w/2,-h/2+4,w,h,h/2).fillStyle(cor,1).fillRoundedRect(-w/2,-h/2,w,h,h/2),t=this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5);c.add([g,t]);c.setData('texto',t);return c;}
}
