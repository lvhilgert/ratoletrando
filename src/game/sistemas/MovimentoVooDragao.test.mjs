import assert from 'node:assert/strict';
import { FASES_VOO, moverVooDragao } from './MovimentoVooDragao.ts';

assert.equal(moverVooDragao(320,-1,500),165);
assert.equal(moverVooDragao(320,1,500),475);
assert.equal(moverVooDragao(100,-1,1000),65);
assert.equal(moverVooDragao(500,1,1000),575);
assert.equal(FASES_VOO.length,3);
assert.ok(FASES_VOO.every((fase,i)=>i===0||(fase.velocidade>FASES_VOO[i-1].velocidade&&fase.abertura<FASES_VOO[i-1].abertura)));
assert.equal(new Set(FASES_VOO.map(fase=>fase.mecanica)).size,3);
console.log('Voo do dragão: movimento e 3 fases progressivas OK');
