import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const url='http://127.0.0.1:4173';
const saida='test-results/refatoracao';
const jogos=[
    ['ratoletrando',120,312,'Menu'],['ouvi-escrevi',360,312,'OuviEscrevi'],['monta-palavra',600,312,'MontaPalavra'],['conta-comigo',840,312,'ContaComigo'],
    ['soma-trilha',120,546,'SomaTrilha'],['memo-letras',360,546,'MemoLetras'],['reino-portas',600,546,'ConfiguracaoReino'],['detetive-mirim',840,546,'CasosDetetive']
];

const esperarServidor=async()=>{
    for(let tentativa=0;tentativa<60;tentativa++){
        try{if((await fetch(url)).ok)return;}catch{}
        await new Promise(resolve=>setTimeout(resolve,250));
    }
    throw new Error('Servidor Vite não respondeu.');
};

const cenaAtiva=page=>page.evaluate(()=>{
    const jogo=window.__ratoletrando;
    return jogo?.scene.getScenes(true).map(cena=>cena.scene.key)??[];
});

const clicarLogico=async(page,x,y)=>{
    const canvas=page.locator('canvas'),caixa=await canvas.boundingBox();
    if(!caixa)throw new Error('Canvas não encontrado.');
    await page.mouse.click(caixa.x+x/960*caixa.width,caixa.y+y/640*caixa.height);
};
const arrastarLogico=async(page,x1,y1,x2,y2)=>{
    const caixa=await page.locator('canvas').boundingBox();if(!caixa)throw new Error('Canvas não encontrado.');
    await page.mouse.move(caixa.x+x1/960*caixa.width,caixa.y+y1/640*caixa.height);await page.mouse.down();await page.mouse.move(caixa.x+x2/960*caixa.width,caixa.y+y2/640*caixa.height,{steps:5});await page.mouse.up();
};
const voltarEducApp=async page=>{
    await page.evaluate(()=>window.__ratoletrando?.scene.getScenes(true)[0]?.scene.start('EducApp'));
    await page.waitForFunction(()=>window.__ratoletrando?.scene.getScene('EducApp')?.scene.isActive(),null,{timeout:15000});
    await page.waitForTimeout(500);
};

await mkdir(saida,{recursive:true});
const servidor=spawn(process.execPath,[resolve('node_modules/vite/bin/vite.js'),'--config',resolve('vite/config.dev.mjs'),'--host','127.0.0.1','--port','4173'],{stdio:'ignore'});
let navegador;
try{
    await esperarServidor();
    navegador=await chromium.launch({channel:'chrome',headless:true});
    for(const [viewport,sufixo] of [[{width:960,height:640},'desktop'],[{width:390,height:844},'mobile']]){
        const contexto=await navegador.newContext({viewport});
        const pagina=await contexto.newPage(),erros=[];
        pagina.on('pageerror',erro=>erros.push(erro.message));
        pagina.on('console',mensagem=>{if(mensagem.type()==='error')erros.push(mensagem.text());});
        await pagina.goto(url,{waitUntil:'networkidle'});
        await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('EducApp')?.scene.isActive(),null,{timeout:15000});
        await pagina.waitForTimeout(900);
        await pagina.screenshot({path:`${saida}/educapp-${sufixo}.png`});
        for(const [nome,x,y,cena] of jogos){
            console.log(`Smoke ${sufixo}: ${nome}`);
            await pagina.goto(url,{waitUntil:'networkidle'});
            await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('EducApp')?.scene.isActive(),null,{timeout:15000});
            await pagina.waitForTimeout(900);
            await clicarLogico(pagina,x,y);
            try{
                await pagina.waitForFunction(chave=>window.__ratoletrando?.scene.getScene(chave)?.scene.isActive(),cena,{timeout:15000});
            }catch(erro){
                throw new Error(`${nome}: aguardava ${cena}; ativas: ${(await cenaAtiva(pagina)).join(', ')}`,{cause:erro});
            }
            await pagina.screenshot({path:`${saida}/${nome}-${sufixo}.png`});
            await voltarEducApp(pagina);
            await clicarLogico(pagina,x,y);
            await pagina.waitForFunction(chave=>window.__ratoletrando?.scene.getScene(chave)?.scene.isActive(),cena,{timeout:15000});
            if(nome==='ouvi-escrevi')await clicarLogico(pagina,480,130);
            else if(nome==='monta-palavra'){
                await arrastarLogico(pagina,414,403,395,272);
            }else if(nome==='conta-comigo')await clicarLogico(pagina,480,365);
            else if(nome==='soma-trilha')await clicarLogico(pagina,300,300);
            else if(nome==='memo-letras'){await clicarLogico(pagina,270,265);await clicarLogico(pagina,480,265);}
            else if(nome==='ratoletrando'){
                await clicarLogico(pagina,480,455);await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('Jogo')?.scene.isActive(),null,{timeout:15000});
                await pagina.keyboard.press('ArrowRight');await pagina.waitForTimeout(300);await pagina.screenshot({path:`${saida}/ratoletrando-jogo-${sufixo}.png`});
            }else if(nome==='reino-portas'){
                await clicarLogico(pagina,480,573);try{await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('ReinoDasPortas')?.scene.isActive(),null,{timeout:15000});}catch(erro){throw new Error(`reino-portas: aguardava ReinoDasPortas; ativas: ${(await cenaAtiva(pagina)).join(', ')}; erros: ${[...new Set(erros)].join(' | ')}`,{cause:erro});}
                await pagina.keyboard.press('ArrowRight');await pagina.waitForTimeout(500);await pagina.screenshot({path:`${saida}/reino-jogo-${sufixo}.png`});await clicarLogico(pagina,748,42);await pagina.waitForTimeout(250);await pagina.screenshot({path:`${saida}/reino-jornada-${sufixo}.png`});
            }else if(nome==='detetive-mirim'){
                await clicarLogico(pagina,140,195);await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('FaseDetetive')?.scene.isActive(),null,{timeout:15000});
                await clicarLogico(pagina,550,425);await pagina.keyboard.press('ArrowRight');await pagina.waitForTimeout(300);await pagina.screenshot({path:`${saida}/detetive-caso-${sufixo}.png`});
            }
        }
        if(erros.length)throw new Error(`${sufixo}: ${[...new Set(erros)].join(' | ')}`);
        await contexto.close();
    }
    console.log('Smoke EducApp: 8 jogos em desktop e mobile sem erros de runtime.');
}finally{
    await navegador?.close();
    servidor.kill();
}
