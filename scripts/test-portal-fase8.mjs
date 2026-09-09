import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const url='http://localhost:8081';
const saida='test-results/portal-fase8';
await mkdir(saida,{recursive:true});

const navegador=await chromium.launch({channel:'chrome',headless:true});
try{
    for(const [viewport,nome] of [[{width:960,height:640},'desktop'],[{width:390,height:844},'estreita']]){
        const contexto=await navegador.newContext({viewport}),pagina=await contexto.newPage(),erros=[];
        pagina.on('pageerror',erro=>erros.push(erro.message));
        pagina.on('console',mensagem=>{if(mensagem.type()==='error'&&!mensagem.text().startsWith('Texture key already in use:'))erros.push(mensagem.text());});
        await pagina.goto(url,{waitUntil:'networkidle'});
        await pagina.evaluate(()=>window.__ratoletrando.scene.start('ConfiguracaoReino'));
        await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('ConfiguracaoReino')?.scene.isActive());
        await pagina.evaluate(()=>window.__ratoletrando.scene.start('ReinoDasPortas',{fase:7}));
        await pagina.waitForFunction(()=>window.__ratoletrando?.scene.getScene('ReinoDasPortas')?.scene.isActive());
        await pagina.waitForTimeout(600);

        const bloqueado=await pagina.evaluate(()=>{
            const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas');
            cena.portas.forEach(porta=>{porta.aberta=true;porta.sprite.disableBody();});
            cena.atualizarEstadoPortal();
            const guardiao=cena.inimigos.find(inimigo=>inimigo.guardiao);
            return {guardiao:!!guardiao,portalPronto:cena.portalPronto};
        });
        assert.deepEqual(bloqueado,{guardiao:true,portalPronto:false},`${nome}: guardião vivo deve bloquear o portal`);

        await pagina.evaluate(()=>{
            const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas'),guardiao=cena.inimigos.find(inimigo=>inimigo.guardiao);
            guardiao.vida=1;cena.cavaleiro.olhando=1;cena.cavaleiro.setPosition(guardiao.x-60,guardiao.y).setVelocity(0);
        });
        await pagina.keyboard.press('j');
        await pagina.waitForFunction(()=>{
            const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas');
            return cena.eventosAventura.has('guardiao-derrotado')&&cena.portalPronto;
        });
        await pagina.evaluate(()=>{
            const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas');
            cena.cavaleiro.setPosition(cena.nivel.portal.x-300,cena.nivel.portal.y).setVelocity(0);
        });
        await pagina.waitForTimeout(700);
        await pagina.screenshot({path:`${saida}/portal-pronto-${nome}.png`});

        await pagina.evaluate(()=>{
            const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas');
            cena.scene.restart({fase:7});
        });
        await pagina.waitForTimeout(700);
        const reentrada=await pagina.evaluate(()=>{
            const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas'),guardiao=cena.inimigos.find(inimigo=>inimigo.guardiao);
            cena.portas.forEach(porta=>{porta.aberta=true;porta.sprite.disableBody();});cena.atualizarEstadoPortal();
            return {evento:cena.eventosAventura.has('guardiao-derrotado'),guardiaoDerrotado:guardiao?.derrotado,portalPronto:cena.portalPronto};
        });
        assert.deepEqual(reentrada,{evento:true,guardiaoDerrotado:true,portalPronto:true},`${nome}: reentrada deve restaurar o guardião derrotado`);
        await pagina.evaluate(()=>{
            const cena=window.__ratoletrando.scene.getScene('ReinoDasPortas');
            cena.cavaleiro.setPosition(cena.nivel.portal.x,cena.nivel.portal.y).setVelocity(0);
        });
        await pagina.waitForFunction(()=>JSON.parse(localStorage.getItem('educapp:reino-portas:v2')).faseAtual===8);
        await pagina.waitForTimeout(300);
        await pagina.screenshot({path:`${saida}/fase-concluida-${nome}.png`});
        assert.equal(erros.length,0,`${nome}: erros no console: ${[...new Set(erros)].join(' | ')}`);
        await contexto.close();
    }
    console.log('Portal da fase 8: bloqueio, derrota por ataque, ativação e liberação da fase 9 validados em duas viewports.');
}finally{await navegador.close();}
