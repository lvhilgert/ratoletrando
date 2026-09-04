import * as Phaser from 'phaser';
import { audioJogo } from '../sistemas/SistemaAudio';
import { FASES_VOO, moverVooDragao } from '../sistemas/MovimentoVooDragao';

type DadosVoo={fase?:number;pontos?:number;estrelas?:number};

export class VooDragaoReino extends Phaser.Scene {
    private jogador!:Phaser.Physics.Arcade.Sprite;
    private visual!:Phaser.GameObjects.Container;
    private obstaculos!:Phaser.Physics.Arcade.Group;
    private estrelas!:Phaser.Physics.Arcade.Group;
    private cursores!:Phaser.Types.Input.Keyboard.CursorKeys;
    private cimaTouch=false;
    private baixoTouch=false;
    private proximoObstaculo=2500;
    private inicio=0;
    private vidas=3;
    private pontos=0;
    private estrelasColetadas=0;
    private invulneravelAte=0;
    private encerrado=false;
    private fase=0;
    private pontosBase=0;
    private estrelasBase=0;
    private obstaculosCriados=0;
    private proximoVento=4000;
    private ventoAte=0;
    private direcaoVento=0;
    private textoPontos!:Phaser.GameObjects.Text;
    private textoVidas!:Phaser.GameObjects.Text;
    private textoEstrelas!:Phaser.GameObjects.Text;
    private barra!:Phaser.GameObjects.Graphics;

    constructor(){super('VooDragaoReino');}
    init(dados?:DadosVoo):void {this.fase=Phaser.Math.Clamp(dados?.fase??0,0,FASES_VOO.length-1);this.pontosBase=dados?.pontos??0;this.estrelasBase=dados?.estrelas??0;}

    create():void {
        this.vidas=3;this.pontos=this.pontosBase;this.estrelasColetadas=this.estrelasBase;this.invulneravelAte=0;this.encerrado=false;this.proximoObstaculo=2500;this.obstaculosCriados=0;this.proximoVento=4000;this.ventoAte=0;this.direcaoVento=0;this.cimaTouch=false;this.baixoTouch=false;
        const fase=FASES_VOO[this.fase];
        this.physics.resume();this.physics.world.gravity.y=0;
        audioJogo.iniciarMusicaReino();
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>audioJogo.pararMusicaReino());
        this.add.tileSprite(480,320,960,640,`reino-fundo-${fase.fundo}`).setDisplaySize(960,640);
        this.add.rectangle(480,320,960,640,fase.cor,this.fase===2?.3:.16);
        this.criarCeu();

        this.jogador=this.physics.add.sprite(190,320,'reino-objetos',2).setVisible(false);
        const corpo=this.jogador.body as Phaser.Physics.Arcade.Body;corpo.setAllowGravity(false).setSize(54,36);
        const dragao=this.add.sprite(0,12,'reino-companheiro-dragao-mover',0).setDisplaySize(150,200).play('reino-companheiro-dragao-mover');
        const cavaleiro=this.add.sprite(-22,-43,'reino-cavaleiro',0).setDisplaySize(38,90).setAngle(-5);
        this.visual=this.add.container(this.jogador.x,this.jogador.y,[dragao,cavaleiro]).setDepth(8);
        this.obstaculos=this.physics.add.group({allowGravity:false,immovable:true});
        this.estrelas=this.physics.add.group({allowGravity:false,immovable:true});
        this.physics.add.overlap(this.jogador,this.obstaculos,()=>this.bater());
        this.physics.add.overlap(this.jogador,this.estrelas,(_jogador,estrela)=>this.coletarEstrela(estrela as Phaser.Physics.Arcade.Image));

        this.cursores=this.input.keyboard!.createCursorKeys();
        this.input.keyboard!.on('keydown-ESC',()=>this.scene.start('ConfiguracaoReino',{tela:'fases'}));
        this.criarHUD();this.criarTouch();this.mostrarAbertura();
        this.inicio=0;
    }

    update(_tempo:number,delta:number):void {
        if(this.encerrado)return;
        if(!this.inicio)this.inicio=this.time.now;
        const fase=FASES_VOO[this.fase],cima=this.cimaTouch||this.cursores.up.isDown,baixo=this.baixoTouch||this.cursores.down.isDown,direcao=(baixo?1:0)-(cima?1:0),corpo=this.jogador.body as Phaser.Physics.Arcade.Body;
        this.jogador.y=moverVooDragao(this.jogador.y,direcao,delta);corpo.setVelocityY(0).updateFromGameObject();
        const decorrido=this.time.now-this.inicio;
        if(this.fase===1&&decorrido>=this.proximoVento){this.ativarVento();this.proximoVento=decorrido+Phaser.Math.Between(4000,5200);}
        if(this.time.now<this.ventoAte)this.jogador.y=moverVooDragao(this.jogador.y,this.direcaoVento,delta*.22);
        corpo.updateFromGameObject();
        this.visual.setPosition(this.jogador.x,this.jogador.y).setAngle(direcao*12);
        const velocidade=fase.velocidade+Math.min(fase.aceleracao,decorrido/400);
        this.moverObjetos(this.obstaculos,velocidade,delta,true);
        this.moverObjetos(this.estrelas,velocidade,delta,false);
        if(decorrido>=this.proximoObstaculo){this.criarObstaculo();this.proximoObstaculo=decorrido+Phaser.Math.Between(fase.intervalo[0],fase.intervalo[1]);}
        const progresso=Phaser.Math.Clamp(decorrido/fase.duracao,0,1);this.barra.clear().fillStyle(0x173d34,.7).fillRoundedRect(300,28,360,12,6).fillStyle(0xffd45f,1).fillRoundedRect(300,28,360*progresso,12,6);
        if(decorrido>=fase.duracao)this.terminar(true);
    }

    private criarCeu():void {
        const cor=this.fase===2?0xffc0a0:0xffffff;
        for(let i=0;i<8;i++){
            const nuvem=this.add.ellipse(Phaser.Math.Between(0,960),Phaser.Math.Between(90,560),Phaser.Math.Between(100,210),Phaser.Math.Between(28,58),cor,.2).setDepth(1);
            this.tweens.add({targets:nuvem,x:-160,duration:Phaser.Math.Between(6500,12000)-this.fase*600,delay:i*280,repeat:-1,onRepeat:()=>nuvem.setPosition(1080,Phaser.Math.Between(90,560))});
        }
        if(this.fase===1)for(let i=0;i<14;i++){const chuva=this.add.rectangle(Phaser.Math.Between(0,960),Phaser.Math.Between(80,620),2,Phaser.Math.Between(18,35),0xb9e7ea,.32).setAngle(18).setDepth(2);this.tweens.add({targets:chuva,x:-30,y:700,duration:Phaser.Math.Between(900,1500),delay:i*90,repeat:-1,onRepeat:()=>chuva.setPosition(Phaser.Math.Between(900,1100),Phaser.Math.Between(0,300))});}
        if(this.fase===2)for(let i=0;i<12;i++){const brasa=this.add.circle(Phaser.Math.Between(0,960),Phaser.Math.Between(250,620),Phaser.Math.Between(2,5),0xffb347,.7).setDepth(2);this.tweens.add({targets:brasa,x:-20,y:100,alpha:0,duration:Phaser.Math.Between(1800,3000),delay:i*140,repeat:-1,onRepeat:()=>brasa.setPosition(Phaser.Math.Between(900,1100),Phaser.Math.Between(350,620)).setAlpha(.7)});}
    }

    private moverObjetos(grupo:Phaser.Physics.Arcade.Group,velocidade:number,delta:number,pontuar:boolean):void {
        grupo.getChildren().forEach(objeto=>{const item=objeto as Phaser.Physics.Arcade.Image|Phaser.GameObjects.Rectangle;item.x-=velocidade*delta/1000;const visual=item.getData('visual') as Phaser.GameObjects.Image|undefined,yBase=item.getData('yBase') as number|undefined;if(yBase!==undefined)item.y=yBase+Math.sin(this.time.now/360+(item.getData('onda') as number))*48;if(visual)visual.x=item.x;if(pontuar&&!item.getData('pontuado')&&item.x<this.jogador.x){item.setData('pontuado',true);if(item.getData('pontua')){this.pontos++;this.textoPontos.setText(`DESVIOS: ${this.pontos}`);}}if(item.x<-100){visual?.destroy();item.destroy();}});
    }

    private criarObstaculo():void {
        const indice=this.obstaculosCriados++;
        if(this.fase===2&&indice%3===2){this.criarBolaFogo();return;}
        const fase=FASES_VOO[this.fase],centro=Phaser.Math.Between(175,465),limiteTopo=centro-fase.abertura/2,limiteBaixo=centro+fase.abertura/2,x=1030;
        const adicionar=(y:number,altura:number,textura:string,origemY:number,pontua=false)=>{const margem=18,corpo=this.add.rectangle(x,y+(origemY?-margem:margem),70,Math.max(24,altura-margem*2),0xffffff,0);this.obstaculos.add(corpo);(corpo.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true);const visual=this.add.image(x,origemY?640:0,textura).setOrigin(.5,origemY).setDisplaySize(135,Math.max(80,altura)).setDepth(5);if(this.fase===2)visual.setTint(0xff9a65);corpo.setData({visual,pontua,pontuado:false});};
        adicionar(limiteTopo/2,limiteTopo,'reino-caverna-estalactites',0,true);
        adicionar((limiteBaixo+640)/2,640-limiteBaixo,this.fase===2?'reino-lava':'reino-caverna-cristais',1);
        this.criarEstrelas(x+70,centro,this.fase+1);
    }

    private criarEstrelas(x:number,y:number,quantidade:number):void {for(let i=0;i<quantidade;i++){const estrela=this.estrelas.create(x+i*52,y+Math.sin(i*Math.PI/2)*32,'estrela-5') as Phaser.Physics.Arcade.Image;estrela.setDisplaySize(36,36).setDepth(7);(estrela.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setCircle(15);this.tweens.add({targets:estrela,angle:360,duration:1200,repeat:-1});}}
    private criarBolaFogo():void {const y=Phaser.Math.Between(120,520),bola=this.physics.add.image(1040,y,'estrela-5').setDisplaySize(74,74).setTint(0xff572d).setDepth(7);this.obstaculos.add(bola);(bola.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setImmovable(true).setCircle(22,155,177);bola.setData({pontua:true,pontuado:false,yBase:y,onda:Phaser.Math.FloatBetween(0,Math.PI*2)});this.tweens.add({targets:bola,angle:-360,scale:1.08,duration:700,yoyo:true,repeat:-1});this.criarEstrelas(1110,Phaser.Math.Clamp(640-y,100,540),2);}
    private ativarVento():void {this.direcaoVento=Phaser.Math.RND.sign();this.ventoAte=this.time.now+1800;const seta=this.direcaoVento<0?'↑':'↓',aviso=this.add.text(480,112,`RAJADA DE VENTO ${seta}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',fontStyle:'bold',color:'#e1fbff',stroke:'#244d42',strokeThickness:5}).setOrigin(.5).setDepth(19);this.tweens.add({targets:aviso,alpha:0,duration:1800,onComplete:()=>aviso.destroy()});for(let i=0;i<7;i++){const rastro=this.add.text(Phaser.Math.Between(250,850),this.direcaoVento<0?590:100,seta,{fontFamily:'Arial',fontSize:'28px',color:'#d6f9ff'}).setAlpha(.35).setDepth(3);this.tweens.add({targets:rastro,y:this.direcaoVento<0?50:590,alpha:0,duration:1500,delay:i*80,onComplete:()=>rastro.destroy()});}}

    private coletarEstrela(estrela:Phaser.Physics.Arcade.Image):void {if(!estrela.active)return;estrela.destroy();this.estrelasColetadas++;this.textoEstrelas.setText(`★ ${this.estrelasColetadas}`);audioJogo.efeito('moeda');}
    private bater():void {if(this.encerrado||this.time.now<this.invulneravelAte)return;this.vidas--;this.invulneravelAte=this.time.now+1100;this.textoVidas.setText('❤'.repeat(this.vidas)+'♡'.repeat(3-this.vidas));audioJogo.efeito('dano');this.cameras.main.shake(220,.012);this.cameras.main.flash(100,255,100,80);this.tweens.add({targets:this.visual,alpha:.25,yoyo:true,repeat:5,duration:90});if(this.vidas<=0)this.terminar(false);}

    private terminar(vitoria:boolean):void {
        if(this.encerrado)return;this.encerrado=true;this.physics.pause();audioJogo.efeito(vitoria?'conclusao':'dano');
        const ultima=this.fase===FASES_VOO.length-1,titulo=vitoria?(ultima?'TRÊS CÉUS CONQUISTADOS!':'FASE CONCLUÍDA!'):'TENTE OUTRA VEZ',painel=this.add.container(480,320).setDepth(50),fundo=this.add.graphics().fillStyle(0x102e29,.86).fillRect(-480,-320,960,640).fillStyle(0xfffdf3,1).fillRoundedRect(-285,-155,570,310,28).lineStyle(5,vitoria?0xffd45f:0xd06c5f).strokeRoundedRect(-285,-155,570,310,28);
        painel.add([fundo,this.add.text(0,-92,titulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'29px',fontStyle:'bold',color:vitoria?'#3f816c':'#a74e45'}).setOrigin(.5),this.add.text(0,-35,`${FASES_VOO[this.fase].nome}\n${this.pontos} desvios  •  ${this.estrelasColetadas} estrelas`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'18px',color:'#526a61',align:'center',lineSpacing:8}).setOrigin(.5)]);
        const texto=vitoria?(ultima?'JOGAR DE NOVO':'PRÓXIMA FASE'):'TENTAR NOVAMENTE',acao=vitoria?(ultima?()=>this.scene.restart({fase:0}):()=>this.scene.restart({fase:this.fase+1,pontos:this.pontos,estrelas:this.estrelasColetadas})):()=>this.scene.restart({fase:this.fase,pontos:this.pontosBase,estrelas:this.estrelasBase});
        this.botao(painel,-120,78,texto,0xc28c3d,acao);this.botao(painel,120,78,'ESCOLHER FASE',0x557f9c,()=>this.scene.start('ConfiguracaoReino',{tela:'fases'}));
    }

    private mostrarAbertura():void {const fase=FASES_VOO[this.fase],dica=this.add.text(480,320,`FASE ${this.fase+1} DE 3\n${fase.nome}\n${fase.mecanica}\n↑ SUBA   •   ↓ DESÇA`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'22px',fontStyle:'bold',color:'#ffffff',align:'center',lineSpacing:11,backgroundColor:'rgba(19,58,76,.88)',padding:{x:34,y:24}}).setOrigin(.5).setDepth(30);this.tweens.add({targets:dica,alpha:0,y:285,delay:1800,duration:350,onComplete:()=>dica.destroy()});}
    private criarHUD():void {this.textoVidas=this.add.text(38,35,'❤❤❤',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'27px',color:'#ff6767',stroke:'#5b302d',strokeThickness:4}).setDepth(20);this.textoEstrelas=this.add.text(40,76,`★ ${this.estrelasColetadas}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'19px',fontStyle:'bold',color:'#ffd45f',stroke:'#5b4930',strokeThickness:4}).setDepth(20);this.textoPontos=this.add.text(922,35,`DESVIOS: ${this.pontos}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',fontStyle:'bold',color:'#ffffff',stroke:'#244d42',strokeThickness:4}).setOrigin(1,.5).setDepth(20);this.barra=this.add.graphics().setDepth(20);this.add.text(480,51,`FASE ${this.fase+1}/3  •  ${FASES_VOO[this.fase].nome}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',fontStyle:'bold',color:'#fff4b8',stroke:'#244d42',strokeThickness:3}).setOrigin(.5).setDepth(20);this.add.text(922,76,'‹ FASES',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',fontStyle:'bold',color:'#ffffff',backgroundColor:'rgba(23,61,52,.78)',padding:{x:12,y:7}}).setOrigin(1,.5).setDepth(20).setInteractive({useHandCursor:true}).on('pointerdown',()=>this.scene.start('ConfiguracaoReino',{tela:'fases'}));}
    private criarTouch():void {if(!window.matchMedia('(pointer: coarse)').matches)return;const criar=(y:number,rotulo:string,down:()=>void,up:()=>void)=>{const botao=this.add.container(875,y).setDepth(25).setSize(72,72).setInteractive();botao.add([this.add.circle(0,0,34,0x315f7a,.78).setStrokeStyle(3,0xffffff,.7),this.add.text(0,0,rotulo,{fontFamily:'Arial',fontSize:'30px',color:'#ffffff'}).setOrigin(.5)]);botao.on('pointerdown',down).on('pointerup',up).on('pointerout',up);};criar(480,'↑',()=>this.cimaTouch=true,()=>this.cimaTouch=false);criar(560,'↓',()=>this.baixoTouch=true,()=>this.baixoTouch=false);}
    private botao(pai:Phaser.GameObjects.Container,x:number,y:number,texto:string,cor:number,acao:()=>void):void {const botao=this.add.container(x,y).setSize(205,50).setInteractive({useHandCursor:true});botao.add([this.add.graphics().fillStyle(cor,1).fillRoundedRect(-102,-25,204,50,25).lineStyle(2,0xffffff,.45).strokeRoundedRect(-102,-25,204,50,25),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5)]);botao.on('pointerdown',acao);pai.add(botao);}
}
