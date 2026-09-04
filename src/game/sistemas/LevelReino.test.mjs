import assert from 'node:assert/strict';
import { AVENTURAS_REINO, gerarNivelReino, sobrepoeGap, validarAventurasReino, validarNivelReino } from './LevelReino.ts';

for(let fase=0;fase<8;fase++)for(let seed=1;seed<=100;seed++){
    const nivel=gerarNivelReino(fase,seed),repetido=gerarNivelReino(fase,seed);
    assert.deepEqual(nivel,repetido,'a mesma seed deve reproduzir o nível');
    assert.deepEqual(validarNivelReino(nivel),[],`fase ${fase+1}, seed ${seed}`);
    assert.ok(nivel.gaps.length>=2);
    assert.ok(nivel.plataformas.length>=4);
    assert.equal(nivel.checkpoints.length,2);
}
assert.ok(gerarNivelReino(0,1).plataformas.some(p=>p.especial==='impulso'));
assert.ok(gerarNivelReino(2,1).plataformas.some(p=>p.especial==='quebravel'));
assert.equal(AVENTURAS_REINO.length,8);
assert.deepEqual(validarAventurasReino(),[]);
assert.equal(sobrepoeGap({gaps:[{inicio:100,fim:200}]},80,50),true);
assert.equal(sobrepoeGap({gaps:[{inicio:100,fim:200}]},70,50),false);
for(let fase=0;fase<8;fase++){
    const nivel=gerarNivelReino(fase,7),aventura=AVENTURAS_REINO[fase];
    for(const x of aventura.posicoes)assert.ok(nivel.terrenos.some(t=>x>=t.x-t.largura/2&&x<=t.x+t.largura/2)||nivel.plataformas.some(p=>x>=p.x-p.largura/2&&x<=p.x+p.largura/2),`${aventura.id} fora de superfície`);
    if(['alavanca','corda'].includes(aventura.tipo))assert.ok(nivel.gaps.length>=2);
}
const aventuraSalva={fase:3,seed:77,eventos:['ponte-ativada']};assert.deepEqual(JSON.parse(JSON.stringify(aventuraSalva)),aventuraSalva);
console.log('levels: 800 gerações e 8 microaventuras validadas');
