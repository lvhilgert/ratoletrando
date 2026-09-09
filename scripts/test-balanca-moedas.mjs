import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const url='http://127.0.0.1:4174',servidor=spawn(process.execPath,[resolve('node_modules/vite/bin/vite.js'),'--config',resolve('vite/config.dev.mjs'),'--host','127.0.0.1','--port','4174'],{stdio:'ignore'});
const esperarServidor=async()=>{for(let i=0;i<60;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,250));}throw new Error('Servidor Vite não respondeu.');};
const clicar=async(pagina,{x,y})=>{const caixa=await pagina.locator('canvas').boundingBox();assert.ok(caixa);await pagina.mouse.click(caixa.x+x/960*caixa.width,caixa.y+y/640*caixa.height);};
let navegador;
try{
    await esperarServidor();navegador=await chromium.launch({channel:'chrome',headless:true});
    for(const viewport of [{width:960,height:640},{width:390,height:844}]){
        const pagina=await navegador.newPage({viewport}),erros=[];pagina.on('pageerror',erro=>erros.push(erro.message));pagina.on('console',mensagem=>{if(mensagem.type()==='error')erros.push(mensagem.text());});
        await pagina.goto(url,{waitUntil:'networkidle'});await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('EducApp')?.scene.isActive());
        await pagina.evaluate(()=>window.__ratoletrando.scene.start('ConfiguracaoReino'));await pagina.waitForFunction(()=>window.__ratoletrando.scene.getScene('ConfiguracaoReino')?.scene.isActive());
        await pagina.evaluate(()=>{const cena=window.__ratoletrando.scene.getScene('ConfiguracaoReino'),estado=cena.estado;localStorage.setItem('educapp:reino-portas:v2',JSON.stringify({...estado,challenges:{...estado.challenges,EQUILIBRAR_BALANCA:{enabled:true,difficulty:'easy'}}}));window.__ratoletrando.scene.start('ReinoDasPortas',{fase:0});});await pagina.waitForFunction(()=>window.__ratoletrando.scene.getScene('ReinoDasPortas')?.scene.isActive());
        const blocos=await pagina.evaluate(()=>{const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas'),porta=cena.portas[0];porta.tipo='EQUILIBRAR_BALANCA';cena.abrirDesafio(porta);const pratos=cena.modal.list.filter(item=>item.name?.startsWith('balanca-prato')),somar=prato=>prato.list.filter(item=>item.name?.startsWith('balanca-bloco-fixo')).reduce((total,item)=>total+Number(item.name.split('-').at(-1)),0),alvo=Math.abs(somar(pratos[0])-somar(pratos[1])),moveis=cena.modal.list.filter(item=>item.name?.startsWith('balanca-bloco-movel'));return {certo:moveis.find(item=>item.name.endsWith('-'+alvo)).name,errado:moveis.find(item=>!item.name.endsWith('-'+alvo)).name};});
        const posicao=nome=>pagina.evaluate(nome=>{const item=window.__ratoletrando.scene.getScene('ReinoDasPortas').modal.list.find(obj=>obj.name===nome);return {x:item.x+480,y:item.y+320};},nome);
        await clicar(pagina,await posicao(blocos.errado));await pagina.waitForTimeout(650);await clicar(pagina,await posicao(blocos.errado));await pagina.waitForTimeout(350);assert.ok((await posicao(blocos.errado)).y>470,'bloco errado deve voltar à origem');
        await clicar(pagina,await posicao(blocos.certo));await pagina.waitForTimeout(1900);
        const estado=await pagina.evaluate(()=>{const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas');return {aberta:cena.portas[0].aberta,bloqueado:cena.bloqueado,modal:!!cena.modal,pausada:cena.physics.world.isPaused,moedasInvalidas:cena.nivel.moedas.filter(m=>cena.nivel.terrenos.some(t=>m.x+23>t.x-t.largura/2&&m.x-23<t.x+t.largura/2&&m.y+23>t.topo)).length};});
        assert.deepEqual(estado,{aberta:true,bloqueado:false,modal:false,pausada:false,moedasInvalidas:0});assert.deepEqual(erros,[]);await pagina.close();
    }
    console.log('Balança: troca, conclusão e moedas validadas em desktop e mobile.');
}finally{await navegador?.close();servidor.kill();}
