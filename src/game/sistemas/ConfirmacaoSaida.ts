import * as Phaser from 'phaser';

interface OpcoesSaida {aoAbrir?:()=>void;aoCancelar?:()=>void}
const abertas=new WeakSet<Phaser.Scene>();

export function confirmarSaidaParaEducApp(cena:Phaser.Scene,opcoes:OpcoesSaida={}):void {
    if(abertas.has(cena))return;abertas.add(cena);const tecladoAtivo=cena.input.keyboard?.enabled??false;if(cena.input.keyboard)cena.input.keyboard.enabled=false;opcoes.aoAbrir?.();
    const c=cena.add.container(480,320).setScrollFactor(0).setDepth(2000),bloqueioVisual=cena.add.rectangle(0,0,960,640,0x142e2a,.68),painel=cena.add.graphics().fillStyle(0x173b34,.2).fillRoundedRect(-270,-126,540,270,28).fillStyle(0xfffdf4,1).fillRoundedRect(-270,-136,540,270,28).lineStyle(4,0xd6ae61,.9).strokeRoundedRect(-270,-136,540,270,28),titulo=cena.add.text(0,-78,'SAIR DO JOGO?',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'27px',fontStyle:'bold',color:'#365f52'}).setOrigin(.5),mensagem=cena.add.text(0,-30,'Tem certeza de que deseja voltar ao EducApp?',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'16px',color:'#61736c',align:'center',wordWrap:{width:440}}).setOrigin(.5);
    const botao=(x:number,rotulo:string,cor:number)=>{const b=cena.add.container(x,65);b.add([cena.add.graphics().fillStyle(0x24483f,.16).fillRoundedRect(-105,-21,210,52,22).fillStyle(cor,1).fillRoundedRect(-105,-26,210,52,22),cena.add.text(0,0,rotulo,{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'13px',fontStyle:'bold',color:'#ffffff'}).setOrigin(.5)]);return b;};
    const continuar=botao(-115,'CONTINUAR JOGANDO',0x4c9773),sair=botao(115,'SAIR PARA O EDUCAPP',0xb66c55);c.add([bloqueioVisual,painel,titulo,mensagem,continuar,sair]);
    const bloqueioClique=cena.add.zone(480,320,960,640).setScrollFactor(0).setDepth(1999).setInteractive(),zonaContinuar=cena.add.zone(365,385,210,52).setScrollFactor(0).setDepth(2001).setInteractive({useHandCursor:true}),zonaSair=cena.add.zone(595,385,210,52).setScrollFactor(0).setDepth(2001).setInteractive({useHandCursor:true});
    const limpar=()=>{bloqueioClique.destroy();zonaContinuar.destroy();zonaSair.destroy();};const restaurarTeclado=()=>{if(cena.input.keyboard)cena.input.keyboard.enabled=tecladoAtivo;};const fechar=()=>{abertas.delete(cena);limpar();c.destroy(true);restaurarTeclado();opcoes.aoCancelar?.();};zonaContinuar.on('pointerover',()=>continuar.setScale(1.035));zonaContinuar.on('pointerout',()=>continuar.setScale(1));zonaSair.on('pointerover',()=>sair.setScale(1.035));zonaSair.on('pointerout',()=>sair.setScale(1));zonaContinuar.on('pointerdown',fechar);zonaSair.on('pointerdown',()=>{abertas.delete(cena);limpar();restaurarTeclado();cena.scene.start('EducApp');});
    c.setAlpha(0).setScale(.92);cena.tweens.add({targets:c,alpha:1,scale:1,duration:170,ease:'Back.Out'});
}
