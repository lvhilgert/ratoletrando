import assert from 'node:assert/strict';
import { CATALOGO_PALAVRAS_REINO } from '../dados/catalogoPalavrasReino.ts';
import { DESAFIOS_PADRAO, escolherTiposDaJornada, SessaoDesafiosReino, TIPOS_DESAFIO, validarRespostaDesafio } from './DesafiosReino.ts';

assert.ok(CATALOGO_PALAVRAS_REINO.length>=80);
for(const item of CATALOGO_PALAVRAS_REINO){assert.equal(item.silabas.join(''),item.palavra,item.palavra);assert.equal(item.quantidadeSilabas,item.silabas.length);assert.equal(item.letraInicial,Array.from(item.palavra)[0]);assert.equal(item.letraFinal,Array.from(item.palavra).slice(-1)[0]);}

for(const type of TIPOS_DESAFIO)for(const difficulty of ['easy','medium','hard'])for(let i=0;i<300;i++){
    const desafio=new SessaoDesafiosReino().gerar(type,difficulty,{minimo:0,maximo:50});
    assert.ok(validarRespostaDesafio(desafio,desafio.answer),`${type} sem resposta válida`);
    if(type!=='MONTAR_PALAVRA')assert.equal(new Set(desafio.options).size,desafio.options.length,`${type} possui alternativas repetidas`);
    for(const resposta of new Set(desafio.answer))assert.ok(desafio.options.includes(resposta),`${type} não oferece ${resposta}`);
    if(desafio.word)assert.equal(desafio.word.silabas.join(''),desafio.word.palavra);
    if(type==='MESMO_INICIO'){assert.equal(desafio.answer.length,1);assert.equal(desafio.options.filter(opcao=>opcao.startsWith(desafio.word.letraInicial)).length,1);}
    if(type==='EQUILIBRAR_BALANCA'){const {left,right,dropSide,slots}=desafio.payload,soma=itens=>itens.reduce((a,b)=>a+Number(b),0),fixo=dropSide==='left'?soma(right):soma(left),base=dropSide==='left'?soma(left):soma(right);assert.equal(base+soma(desafio.answer),fixo);assert.equal(desafio.answer.length,slots);const solucoes=[];for(let a=0;a<desafio.options.length;a++){if(slots===1&&base+Number(desafio.options[a])===fixo)solucoes.push([a]);for(let b=a+1;slots===2&&b<desafio.options.length;b++)if(base+Number(desafio.options[a])+Number(desafio.options[b])===fixo)solucoes.push([a,b]);}assert.equal(solucoes.length,1,'balança deve ter uma única solução');}
    if(type==='SEQUENCIA_NUMERICA'){const {step,values,missingIndex}=desafio.payload;assert.equal(values[missingIndex],Number(desafio.answer[0]));for(let j=1;j<values.length;j++)assert.equal(values[j]-values[j-1],step);}
    if(type==='COMBINACAO_ALVO'){const alvo=desafio.payload.target,pares=[];for(let a=0;a<desafio.options.length;a++)for(let b=a+1;b<desafio.options.length;b++)if(Number(desafio.options[a])+Number(desafio.options[b])===alvo)pares.push([a,b]);assert.equal(pares.length,1,'baú deve ter uma única combinação');}
}

const sessao=new SessaoDesafiosReino(),palavras=Array.from({length:30},()=>sessao.gerar('CONTAR_SILABAS','medium').word.palavra);assert.equal(new Set(palavras).size,palavras.length,'palavras repetidas cedo demais');
const tipos=escolherTiposDaJornada(DESAFIOS_PADRAO(),8);for(let i=1;i<tipos.length;i++){assert.notEqual(tipos[i],tipos[i-1]);assert.notEqual(tipos[i].startsWith('CONTAR')||['MONTAR_PALAVRA','MESMO_INICIO','COMPLETAR_PALAVRA'].includes(tipos[i]),tipos[i-1].startsWith('CONTAR')||['MONTAR_PALAVRA','MESMO_INICIO','COMPLETAR_PALAVRA'].includes(tipos[i-1]));}
console.log(`desafios: ${TIPOS_DESAFIO.length} famílias, ${CATALOGO_PALAVRAS_REINO.length} palavras e 7.200 gerações validadas`);
