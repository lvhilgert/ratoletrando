import assert from 'node:assert/strict';
import { restaurarEstadoMecanismo } from './RegrasMecanismosExpansaoReino.ts';

for(let etapa=0;etapa<=4;etapa++){
    const eventos=new Set(Array.from({length:etapa},(_,i)=>`costa-manivela-1-${i+1}`));
    assert.equal(restaurarEstadoMecanismo(eventos,'costa-manivela-1',4),etapa);
}
assert.equal(restaurarEstadoMecanismo(new Set(['canion-rocha-2-1','canion-rocha-2-2']),'canion-rocha-2',3),2);
console.log('mecanismos: restauração idempotente de manivelas e rochas validada');
