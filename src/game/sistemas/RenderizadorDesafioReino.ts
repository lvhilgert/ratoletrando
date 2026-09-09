import * as Phaser from 'phaser';
import { botaoRaster, circuloRaster, painelRaster } from './ArteRaster';
import { NOMES_DESAFIO, type InstanciaDesafio } from './DesafiosReino';
import { criarMiniJogoBalancaReino } from './MiniJogoBalancaReino';

const FONTE='Arial Rounded MT Bold, Arial Black, Arial';
export interface DesafioRenderizado {container:Phaser.GameObjects.Container;destruir:()=>void}

export const renderizarDesafioReino=(cena:Phaser.Scene,desafio:InstanciaDesafio,cor:number,aoResponder:(resposta:string[],botao:Phaser.GameObjects.Container)=>boolean,aoOuvir:()=>void):DesafioRenderizado=>{
    const container=cena.add.container(480,320).setScrollFactor(0).setDepth(100),selecionadas:string[]=[],botoes:Phaser.GameObjects.Container[]=[],limpezas:(()=>void)[]=[],zonas:Phaser.GameObjects.Zone[]=[];
    container.once('destroy',()=>{limpezas.forEach(fn=>fn());zonas.forEach(zona=>zona.destroy());});
    container.add([painelRaster(cena,0,0,960,640,0x12372e,.62).setInteractive(),painelRaster(cena,0,10,720,502,0x183d34,.2),painelRaster(cena,0,-5,730,512,cor),painelRaster(cena,0,-5,720,502,0xfffdf3),cena.add.text(0,-218,NOMES_DESAFIO[desafio.type].toUpperCase(),{fontFamily:FONTE,fontSize:'22px',fontStyle:'bold',color:`#${cor.toString(16).padStart(6,'0')}`}).setOrigin(.5)]);
    const ouvir=botao(-300,-218,54,42,'🔊',0x4b8e7b);ouvir.on('pointerdown',aoOuvir);
    if(desafio.presentation==='balanca'){const miniJogo=criarMiniJogoBalancaReino(cena,container,desafio,aoResponder);limpezas.push(miniJogo.destruir);container.setAlpha(0);cena.tweens.add({targets:container,alpha:1,duration:150});return {container,destruir:()=>container.destroy(true)};}
    const promptY=desafio.presentation==='montagem'?-155:-118;
    container.add(cena.add.text(0,promptY,desafio.prompt,{fontFamily:FONTE,fontSize:desafio.prompt.length>34?'23px':'30px',fontStyle:'bold',color:'#315f51',align:'center',wordWrap:{width:620}}).setOrigin(.5));
    let atualizarEscolhas=()=>{};
    if(desafio.presentation==='bau'){
        const alvo=(desafio.payload as {target:number}).target;container.add([painelRaster(cena,0,-41,162,98,0xffd76c),painelRaster(cena,0,-41,152,88,0x8d5a2f),painelRaster(cena,0,-48,152,28,0xd49a43),circuloRaster(cena,0,-41,16,0x59391f),cena.add.text(0,-65,String(alvo),{fontFamily:FONTE,fontSize:'32px',fontStyle:'bold',color:'#fff3b0'}).setOrigin(.5)]);
    }else if(desafio.presentation==='montagem'){
        const slots=cena.add.text(0,-62,Array.from({length:desafio.selectionCount},()=>'[  ?  ]').join('  '),{fontFamily:FONTE,fontSize:'24px',fontStyle:'bold',color:'#6d68a8'}).setOrigin(.5);container.add(slots);atualizarEscolhas=()=>slots.setText(Array.from({length:desafio.selectionCount},(_,i)=>`[ ${selecionadas[i]??'?'} ]`).join('  '));
    }
    const total=desafio.options.length,largura=total>=5?104:total===4?126:142,espaco=14,inicio=-(total*largura+(total-1)*espaco)/2+largura/2,y=desafio.presentation==='alternativas'||desafio.presentation==='sequencia'?48:92;
    desafio.options.forEach((valor,i)=>{const b=botao(inicio+i*(largura+espaco),y,largura,68,valor,cor);botoes.push(b);b.on('pointerdown',()=>{if(b.getData('usado'))return;selecionadas.push(valor);b.setData('usado',true).setAlpha(.45);atualizarEscolhas();if(selecionadas.length<desafio.selectionCount)return;const acertou=aoResponder([...selecionadas],b);if(acertou){botoes.forEach(item=>item.disableInteractive());return;}cena.time.delayedCall(520,()=>{selecionadas.length=0;botoes.forEach(item=>item.setData('usado',false).setAlpha(1));atualizarEscolhas();});});});
    let foco=0;const marcarFoco=()=>botoes.forEach((b,i)=>b.setScale(i===foco?1.08:1).setData('focado',i===foco)),mover=(delta:number)=>{foco=Phaser.Math.Wrap(foco+delta,0,botoes.length);marcarFoco();},confirmar=()=>botoes[foco]?.emit('pointerdown'),teclado=cena.input.keyboard!;
    const esquerda=()=>mover(-1),direita=()=>mover(1);teclado.on('keydown-LEFT',esquerda).on('keydown-RIGHT',direita).on('keydown-Z',confirmar).on('keydown-ENTER',confirmar);limpezas.push(()=>teclado.off('keydown-LEFT',esquerda).off('keydown-RIGHT',direita).off('keydown-Z',confirmar).off('keydown-ENTER',confirmar));marcarFoco();
    container.add(cena.add.text(0,180,desafio.selectionCount>1?'TOQUE NAS PEÇAS NA ORDEM DA RESPOSTA':'TOQUE NA RESPOSTA',{fontFamily:FONTE,fontSize:'12px',fontStyle:'bold',color:'#587166'}).setOrigin(.5));
    function botao(x:number,y:number,w:number,h:number,texto:string,corBotao:number):Phaser.GameObjects.Container {const c=cena.add.container(x,y).setSize(w,h);c.add([botaoRaster(cena,0,5,w,h,0x244c40,.16),botaoRaster(cena,0,0,w+8,h+8,0xffdc68,.95),botaoRaster(cena,0,0,w,h,corBotao),cena.add.text(0,0,texto,{fontFamily:FONTE,fontSize:texto.length>9?'14px':'22px',fontStyle:'bold',color:'#ffffff',align:'center',wordWrap:{width:w-10}}).setOrigin(.5)]);const zona=cena.add.zone(480+x,320+y,w,h).setScrollFactor(0).setDepth(110).setInteractive({useHandCursor:true});zona.on('pointerdown',()=>c.emit('pointerdown')).on('pointerover',()=>{c.setScale(1.08);c.emit('pointerover');}).on('pointerout',()=>{if(!c.getData('focado'))c.setScale(1);c.emit('pointerout');});zonas.push(zona);container.add(c);return c;}
    container.setAlpha(0);cena.tweens.add({targets:container,alpha:1,duration:150});return {container,destruir:()=>container.destroy(true)};
};
