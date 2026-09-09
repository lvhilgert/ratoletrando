import assert from 'node:assert/strict';
import { AVENTURAS_REINO, gerarNivelReino, progressoPorMarcos, sobrepoeGap, validarAventurasReino, validarNivelReino } from './LevelReino.ts';

for(let fase=0;fase<9;fase++)for(let seed=1;seed<=100;seed++){
    const nivel=gerarNivelReino(fase,seed),repetido=gerarNivelReino(fase,seed);
    assert.deepEqual(nivel,repetido,'a mesma seed deve reproduzir o nível');
    assert.deepEqual(validarNivelReino(nivel),[],`fase ${fase+1}, seed ${seed}`);
    assert.ok(nivel.gaps.length>=2);
    assert.ok(nivel.plataformas.length>=4);
    assert.equal(nivel.checkpoints.length,3);
    assert.equal(nivel.altura,1440);
    assert.equal(nivel.rotas?.length,3);
    const alturas=[...nivel.terrenos.map(t=>t.topo),...nivel.plataformas.map(p=>p.topo)];
    assert.ok(Math.max(...alturas)-Math.min(...alturas)>=900);
}
assert.ok(gerarNivelReino(0,1).plataformas.some(p=>p.especial==='impulso'));
assert.ok(gerarNivelReino(7,1).plataformas.some(p=>p.especial==='quebravel'));
const neve=gerarNivelReino(8,1);
assert.equal(neve.altura,1440);
assert.equal(neve.rotas?.length,3);
assert.ok(neve.spawn.y-neve.portal.y>=900);
assert.equal(progressoPorMarcos(neve,120,1140,0),0);
assert.equal(progressoPorMarcos(neve,5950,220,3),1);
assert.equal(AVENTURAS_REINO.length,9);
assert.deepEqual(validarAventurasReino(),[]);
assert.equal(sobrepoeGap({gaps:[{inicio:100,fim:200}]},80,50),true);
assert.equal(sobrepoeGap({gaps:[{inicio:100,fim:200}]},70,50),false);
for(let fase=0;fase<9;fase++){
    const nivel=gerarNivelReino(fase,7),aventura=AVENTURAS_REINO[fase];
    for(const {x} of aventura.posicoes)assert.ok(nivel.terrenos.some(t=>x>=t.x-t.largura/2&&x<=t.x+t.largura/2)||nivel.plataformas.some(p=>x>=p.x-p.largura/2&&x<=p.x+p.largura/2),`${aventura.id} fora de superfície`);
    if(['alavanca','corda'].includes(aventura.tipo))assert.ok(nivel.gaps.length>=2);
}
const aventuraSalva={fase:3,seed:77,eventos:['ponte-ativada']};assert.deepEqual(JSON.parse(JSON.stringify(aventuraSalva)),aventuraSalva);
console.log('levels: 900 gerações, fase vertical e 9 microaventuras validadas');
