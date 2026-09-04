import assert from 'node:assert/strict';
import { medirLimitesOpacos, medirTopoApoiavel } from './GeometriaTerrestre.ts';

const pixels=new Uint8ClampedArray(2*4*4);
pixels[(1*2+1)*4+3]=9;
pixels[(2*2)*4+3]=255;
assert.deepEqual(medirLimitesOpacos(pixels,2,4),{topo:.25,base:.75});

const terreno=new Uint8ClampedArray(5*4*4);
terreno[3]=255;
for(let x=0;x<5;x++)terreno[(2*5+x)*4+3]=255;
assert.equal(medirTopoApoiavel(terreno,5,4),.5);
