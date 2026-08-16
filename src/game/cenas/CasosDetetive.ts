import * as Phaser from 'phaser';
import { TODOS_OS_CASOS, CASOS_JOGAVEIS } from '../dados/casosDetetive';
import { TemaDetetive } from '../dados/tiposDetetive';
import { progressoDetetive } from '../sistemas/ProgressoDetetive';

const CORES_TEMA:Record<TemaDetetive,number>={escola:0xc9955a,parquinho:0x6fb955,floresta:0x3f8f5a,praia:0x4fa8d8,rpg:0x8a6bd8,fadas:0xd889c9,mansao:0x5a5088};
const NOMES_TEMA:Record<TemaDetetive,string>={escola:'ESCOLA',parquinho:'PARQUINHO',floresta:'FLORESTA',praia:'PRAIA',rpg:'RPG',fadas:'FADAS',mansao:'MANSÃO'};

export class CasosDetetive extends Phaser.Scene {
    constructor(){super('CasosDetetive');}
    create():void {
        const estado=progressoDetetive.carregar();
        this.add.graphics().fillGradientStyle(0xf3ede0,0xf3ede0,0xe3d8c4,0xe3d8c4,1).fillRect(0,0,960,640);
        this.add.text(480,38,'CASOS DO DETETIVE MIRIM',{fontFamily:'Arial Rounded MT Bold, Arial Black, Arial',fontSize:'30px',fontStyle:'bold',color:'#3d3020'}).setOrigin(.5);
        this.add.text(480,70,'Escolha um mistério para investigar',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'15px',color:'#6b5c45'}).setOrigin(.5);
        const voltar=this.botao(78,34,130,42,'‹ EDUCAPP',0x55778a);voltar.on('pointerdown',()=>this.scene.start('EducApp'));

        TODOS_OS_CASOS.forEach((meta,i)=>{
            const coluna=i%5,linha=Math.floor(i/5),x=140+coluna*172,y=195+linha*158;
            const concluida=estado.fasesConcluidas.includes(meta.id);
            const anterior=TODOS_OS_CASOS[i-1];
            const desbloqueada=i===0||concluida||(anterior?estado.fasesConcluidas.includes(anterior.id):false);
            const disponivel=Boolean(CASOS_JOGAVEIS[meta.id]);
            const cor=CORES_TEMA[meta.tema];
            const card=this.add.container(x,y).setSize(158,148).setInteractive({useHandCursor:desbloqueada&&disponivel});
            const g=this.add.graphics();
            g.fillStyle(0x2c2210,.16).fillRoundedRect(-79,-70,158,148,20);
            g.fillStyle(desbloqueada?0xfffdf6:0xe4ddcd,1).fillRoundedRect(-79,-74,158,148,20);
            g.lineStyle(3,desbloqueada?cor:0xb9ae98,desbloqueada?.85:.5).strokeRoundedRect(-79,-74,158,148,20);
            if(desbloqueada)g.fillStyle(cor,.16).fillRoundedRect(-79,-74,158,44,20);
            card.add(g);
            card.add(this.add.text(0,-52,`${meta.numero}`,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'15px',fontStyle:'bold',color:desbloqueada?'#3d3020':'#96897a'}).setOrigin(.5));
            card.add(this.add.text(0,-30,desbloqueada?NOMES_TEMA[meta.tema]:'?',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'10px',fontStyle:'bold',color:desbloqueada?'#5c4a2c':'#96897a'}).setOrigin(.5));
            card.add(this.add.text(0,10,desbloqueada?meta.titulo:'Bloqueado',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',fontStyle:'bold',color:desbloqueada?'#40382a':'#96897a',align:'center',wordWrap:{width:138}}).setOrigin(.5));
            const selo=concluida?'✓ CONCLUÍDO':!desbloqueada?'🔒':!disponivel?'🔜 EM BREVE':'▶ JOGAR';
            const corSelo=concluida?'#2e8f5c':!desbloqueada?'#8a7c68':!disponivel?'#a3742f':'#2e6f8f';
            card.add(this.add.text(0,58,selo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'11px',fontStyle:'bold',color:corSelo}).setOrigin(.5));
            if(desbloqueada&&disponivel){
                card.on('pointerover',()=>this.tweens.add({targets:card,scale:1.045,duration:90}));
                card.on('pointerout',()=>this.tweens.add({targets:card,scale:1,duration:90}));
                card.on('pointerdown',()=>{this.tweens.add({targets:card,scale:.96,yoyo:true,duration:70});this.time.delayedCall(80,()=>this.scene.start('FaseDetetive',{casoId:meta.id}));});
            } else if(desbloqueada&&!disponivel){
                card.on('pointerdown',()=>this.mostrarAviso('Este caso ainda está sendo escrito. Volte em breve!'));
            }
        });
    }
    private mostrarAviso(texto:string):void {
        const t=this.add.text(480,600,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'14px',fontStyle:'bold',color:'#ffffff',backgroundColor:'#5a4a2c',padding:{x:16,y:9}}).setOrigin(.5).setDepth(50).setAlpha(0);
        this.tweens.add({targets:t,alpha:1,duration:150,yoyo:true,hold:1400,onComplete:()=>t.destroy()});
    }
    private botao(x:number,y:number,w:number,h:number,texto:string,cor:number):Phaser.GameObjects.Container {const c=this.add.container(x,y).setSize(w,h).setInteractive({useHandCursor:true});c.add([this.add.graphics().fillStyle(0x234d3d,.2).fillRoundedRect(-w/2,-h/2+4,w,h,h/2).fillStyle(cor,1).fillRoundedRect(-w/2,-h/2,w,h,h/2),this.add.text(0,0,texto,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'12px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5)]);c.on('pointerover',()=>this.tweens.add({targets:c,scale:1.035,duration:90}));c.on('pointerout',()=>this.tweens.add({targets:c,scale:1,duration:90}));return c;}
}
