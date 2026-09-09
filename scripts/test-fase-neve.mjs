import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const url='http://127.0.0.1:4174',saida='test-results/fase-neve';
const servidor=spawn(process.execPath,[resolve('node_modules/vite/bin/vite.js'),'--config',resolve('vite/config.dev.mjs'),'--host','127.0.0.1','--port','4174'],{stdio:'ignore'});
const esperarServidor=async()=>{for(let i=0;i<60;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,250));}throw new Error('Servidor Vite não respondeu.');};

await mkdir(saida,{recursive:true});
let navegador;
try{
    await esperarServidor();
    navegador=await chromium.launch({channel:'chrome',headless:true});
    for(const [viewport,nome] of [[{width:960,height:640},'960x640'],[{width:390,height:844},'estreita']]){
        const contexto=await navegador.newContext({viewport}),pagina=await contexto.newPage(),erros=[];
        pagina.on('pageerror',erro=>erros.push(erro.message));
        pagina.on('console',mensagem=>{if(mensagem.type()==='error'&&!mensagem.text().startsWith('Texture key already in use:'))erros.push(mensagem.text());});
        await pagina.goto(url,{waitUntil:'networkidle'});
        await pagina.evaluate(()=>window.__ratoletrando.scene.start('ConfiguracaoReino'));
        await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('ConfiguracaoReino')?.scene.isActive());
        await pagina.evaluate(()=>window.__ratoletrando.scene.start('ReinoDasPortas',{fase:8}));
        await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('ReinoDasPortas')?.scene.isActive());
        await pagina.waitForTimeout(700);

        const estado=await pagina.evaluate(()=>{
            const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas');
            const texturas=['reino-fundo-neve','reino-pinguim','reino-gnomo-neve','reino-mamute','reino-objetos-neve'];
            return {
                texturas:Object.fromEntries(texturas.map(chave=>[chave,cena.textures.exists(chave)])),
                inimigos:cena.inimigos.map(inimigo=>inimigo.texture?.key),
                terrenos:cena.children.list.filter(obj=>obj.texture?.key==='reino-terrenos-biomas').map(obj=>Number(obj.frame.name)),
                fundo:cena.children.list.some(obj=>obj.texture?.key==='reino-fundo-neve'),
                viewport:{width:innerWidth,height:innerHeight,scrollX:document.documentElement.scrollWidth>document.documentElement.clientWidth,scrollY:document.documentElement.scrollHeight>document.documentElement.clientHeight}
            };
        });
        assert.ok(Object.values(estado.texturas).every(Boolean),`${nome}: todos os PNGs de neve devem carregar`);
        assert.ok(['reino-pinguim','reino-gnomo-neve','reino-mamute'].every(chave=>estado.inimigos.includes(chave)),`${nome}: inimigos de neve devem usar sprites próprios`);
        assert.ok(estado.terrenos.length>0&&estado.terrenos.every(frame=>frame===3),`${nome}: terreno deve usar neve (frame 3), nunca lava (frame 7)`);
        assert.equal(estado.fundo,true,`${nome}: fundo de neve visível`);
        assert.deepEqual([estado.viewport.scrollX,estado.viewport.scrollY],[false,false],`${nome}: jogo sem rolagem externa`);

        await pagina.keyboard.down('ArrowRight');await pagina.waitForTimeout(450);await pagina.keyboard.up('ArrowRight');
        await pagina.waitForTimeout(450);await pagina.screenshot({path:`${saida}/base-pinguim-${nome}.png`});
        for(const [alvo,x,y] of [['gnomo',2460,720],['mamute',5350,210]]){
            await pagina.evaluate(({x,y})=>{const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas');cena.cavaleiro.setPosition(x,y).setVelocity(0);},{x,y});
            await pagina.keyboard.press('ArrowRight');await pagina.waitForTimeout(850);await pagina.screenshot({path:`${saida}/${alvo}-${nome}.png`});
        }
        assert.equal(erros.length,0,`${nome}: erros no console: ${[...new Set(erros)].join(' | ')}`);
        await contexto.close();
    }
    console.log('Fase de neve: fundo, terreno e três inimigos validados em 960x640 e viewport estreita.');
}finally{await navegador?.close();servidor.kill();}
