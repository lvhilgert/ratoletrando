import * as Phaser from 'phaser';
import type { PontoReino } from './LevelReino';
import { assentarTerrestre } from './TerrestreReino';
export { restaurarEstadoMecanismo } from './RegrasMecanismosExpansaoReino';
import { restaurarEstadoMecanismo } from './RegrasMecanismosExpansaoReino';

export interface MecanismoExpansao {x:number;y:number;evento:string;acao:()=>void}
type Registrar=(evento:string)=>boolean;

export const criarManivela=(cena:Phaser.Scene,ponto:PontoReino,indice:number,eventos:Set<string>,assistencia:boolean,registrar:Registrar,aoConcluir:()=>void):MecanismoExpansao=>{
    const prefixo=`costa-manivela-${indice}`,etapaInicial=restaurarEstadoMecanismo(eventos,prefixo,4),visual=assentarTerrestre(cena.add.image(ponto.x,ponto.y,'reino-objetos-expansao',0).setDisplaySize(92,92).setDepth(8),ponto.y).setAngle(etapaInicial*90),dica=cena.add.text(ponto.x,ponto.y-122,'ATAQUE PARA GIRAR',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',fontStyle:'bold',color:'#fff4bd',stroke:'#315f66',strokeThickness:5}).setOrigin(.5).setDepth(10).setVisible(false);let etapa=etapaInicial;
    if(etapa===4)aoConcluir();
    return {x:ponto.x,y:ponto.y-72,evento:`${prefixo}-4`,acao:()=>{dica.setVisible(true);cena.time.delayedCall(2500,()=>dica.active&&dica.setVisible(false));const alvo=assistencia?4:Math.min(4,etapa+1);while(etapa<alvo){etapa++;registrar(`${prefixo}-${etapa}`);}cena.tweens.add({targets:visual,angle:etapa*90,duration:240,ease:'Back.Out'});if(etapa===4)aoConcluir();}};
};

export const criarParedeMovel=(cena:Phaser.Scene,jogador:Phaser.GameObjects.GameObject,ponto:PontoReino,eventos:Set<string>,evento:string,registrar:Registrar,automatico=false,aoAbrir=()=>{}):MecanismoExpansao=>{
    // raster-exception: collider invisível da parede raster, desativado antes do movimento.
    const aberta=eventos.has(evento),visual=assentarTerrestre(cena.add.image(ponto.x+145,ponto.y,'reino-objetos-expansao',5).setDisplaySize(145,180).setDepth(7),ponto.y),corpo=cena.add.rectangle(ponto.x+145,ponto.y-90,110,180,0xffffff,0);cena.physics.add.existing(corpo,true);cena.physics.add.collider(jogador,corpo);(corpo.body as Phaser.Physics.Arcade.StaticBody).enable=!aberta;if(aberta)visual.setY(visual.y-170);
    const acao=()=>{if(eventos.has(evento)||!registrar(evento))return;(corpo.body as Phaser.Physics.Arcade.StaticBody).enable=false;cena.tweens.add({targets:visual,y:visual.y-170,duration:700,ease:'Sine.InOut'});aoAbrir();};
    if(automatico){const placa=assentarTerrestre(cena.add.image(ponto.x,ponto.y,'reino-objetos-expansao',4).setDisplaySize(110,42).setDepth(5),ponto.y),zona=cena.add.zone(ponto.x,ponto.y-35,110,100);if(aberta)placa.setTint(0xd8c1ff);cena.physics.add.existing(zona,true);cena.physics.add.overlap(jogador,zona,()=>{acao();placa.setTint(0xd8c1ff);});}
    return {x:ponto.x,y:ponto.y-70,evento,acao};
};

export const criarGradeComTravas=(cena:Phaser.Scene,ponto:PontoReino,eventos:Set<string>,registrar:Registrar,aoLibertar:()=>void):MecanismoExpansao[]=>{
    const grade=assentarTerrestre(cena.add.image(ponto.x,ponto.y,'reino-objetos-expansao',7).setDisplaySize(230,190).setDepth(7),ponto.y),mecanismos:MecanismoExpansao[]=[];
    for(let i=1;i<=3;i++){const evento=`lua-trava-${i}`,x=ponto.x+(i-2)*78;if(!eventos.has(evento))mecanismos.push({x,y:ponto.y-70,evento,acao:()=>{if(!registrar(evento))return;const restantes=[1,2,3].some(n=>!eventos.has(`lua-trava-${n}`));cena.tweens.add({targets:grade,scaleX:1.03,duration:120,yoyo:true});if(!restantes&&registrar('lua-raposa-liberta')){cena.tweens.add({targets:grade,y:grade.y-210,alpha:.15,duration:650,ease:'Sine.InOut'});aoLibertar();}}});}
    if(eventsCompletos(eventos,['lua-trava-1','lua-trava-2','lua-trava-3']))grade.setY(grade.y-210).setAlpha(.15);
    return mecanismos;
};

export const criarRochaGuiada=(cena:Phaser.Scene,jogador:Phaser.GameObjects.GameObject&Phaser.GameObjects.Components.Transform,ponto:PontoReino,indice:number,eventos:Set<string>,assistencia:boolean,registrar:Registrar,aoConcluir:()=>void):MecanismoExpansao=>{
    const prefixo=`canion-rocha-${indice}`,etapaInicial=restaurarEstadoMecanismo(eventos,prefixo,3),visual=assentarTerrestre(cena.add.image(ponto.x+etapaInicial*54,ponto.y,'reino-objetos-expansao',8).setDisplaySize(100,100).setDepth(8),ponto.y),dica=cena.add.text(ponto.x,ponto.y-125,'ATAQUE A PEDRA  →',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',fontStyle:'bold',color:'#fff3c4',stroke:'#633d2a',strokeThickness:5}).setOrigin(.5).setDepth(10).setVisible(false);let etapa=etapaInicial;if(etapa===3)aoConcluir();
    const mecanismo:MecanismoExpansao={x:ponto.x+etapa*54,y:ponto.y-65,evento:`${prefixo}-3`,acao:()=>{dica.setVisible(true);cena.time.delayedCall(2500,()=>dica.active&&dica.setVisible(false));if(jogador.x>visual.x+15){cena.tweens.add({targets:visual,x:visual.x-8,duration:80,yoyo:true,repeat:2});return;}const alvo=assistencia?3:Math.min(3,etapa+1);while(etapa<alvo){etapa++;registrar(`${prefixo}-${etapa}`);}mecanismo.x=ponto.x+etapa*54;cena.tweens.add({targets:visual,x:mecanismo.x,angle:etapa*110,duration:280,ease:'Sine.Out'});if(etapa===3)aoConcluir();}};return mecanismo;
};

export const criarPonteFinal=(cena:Phaser.Scene,jogador:Phaser.GameObjects.GameObject,ponto:PontoReino,eventos:Set<string>,registrar:Registrar):MecanismoExpansao=>{
    // raster-exception: superfície física invisível alinhada à ponte raster.
    const pronta=eventos.has('canion-ponte-formada'),visual=cena.add.image(4610,ponto.y,'reino-objetos-expansao',11).setDisplaySize(300,120).setOrigin(.5,1).setDepth(7).setVisible(pronta),corpo=cena.add.rectangle(4610,ponto.y+12,300,24,0xffffff,0);cena.physics.add.existing(corpo,true);cena.physics.add.collider(jogador,corpo);(corpo.body as Phaser.Physics.Arcade.StaticBody).enable=pronta;
    return {x:ponto.x,y:ponto.y-70,evento:'canion-ponte-formada',acao:()=>{if(!eventos.has('canion-rocha-3-3')||!registrar('canion-ponte-formada'))return;visual.setVisible(true).setY(ponto.y-240);cena.tweens.add({targets:visual,y:ponto.y,duration:650,ease:'Bounce.Out',onComplete:()=>{(corpo.body as Phaser.Physics.Arcade.StaticBody).enable=true;cena.cameras.main.shake(180,.008);}});}};
};

const eventsCompletos=(eventos:Set<string>,ids:string[])=>ids.every(id=>eventos.has(id));
