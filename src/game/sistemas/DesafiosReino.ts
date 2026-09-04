import { CATALOGO_PALAVRAS_REINO, type PalavraReino } from '../dados/catalogoPalavrasReino.ts';

export type DificuldadeDesafio='easy'|'medium'|'hard';
export type DisciplinaDesafio='portugues'|'matematica';
export type TipoDesafio='CONTAR_SILABAS'|'MONTAR_PALAVRA'|'MESMO_INICIO'|'COMPLETAR_PALAVRA'|'SOMA_SUBTRACAO'|'EQUILIBRAR_BALANCA'|'SEQUENCIA_NUMERICA'|'COMBINACAO_ALVO';
export type ApresentacaoDesafio='alternativas'|'montagem'|'balanca'|'sequencia'|'bau';

export interface ConfiguracaoTipoDesafio {enabled:boolean;difficulty:DificuldadeDesafio}
export type ConfiguracaoDesafios=Record<TipoDesafio,ConfiguracaoTipoDesafio>;
export interface InstanciaDesafio {
    type:TipoDesafio;
    discipline:DisciplinaDesafio;
    difficulty:DificuldadeDesafio;
    presentation:ApresentacaoDesafio;
    prompt:string;
    options:string[];
    answer:string[];
    selectionCount:number;
    ordered:boolean;
    explanation:string;
    word?:PalavraReino;
    payload?:Record<string,unknown>;
}
export interface DadosBalancaReino {left:number[];right:number[];dropSide:'left'|'right';slots:number}

export const TIPOS_DESAFIO:readonly TipoDesafio[]=['CONTAR_SILABAS','MONTAR_PALAVRA','MESMO_INICIO','COMPLETAR_PALAVRA','SOMA_SUBTRACAO','EQUILIBRAR_BALANCA','SEQUENCIA_NUMERICA','COMBINACAO_ALVO'];
export const NOMES_DESAFIO:Record<TipoDesafio,string>={CONTAR_SILABAS:'Contar sílabas',MONTAR_PALAVRA:'Montar palavra',MESMO_INICIO:'Mesmo início',COMPLETAR_PALAVRA:'Completar palavra',SOMA_SUBTRACAO:'Soma e subtração',EQUILIBRAR_BALANCA:'Equilibrar balança',SEQUENCIA_NUMERICA:'Sequência numérica',COMBINACAO_ALVO:'Combinação do baú'};
export const DISCIPLINA_DESAFIO:Record<TipoDesafio,DisciplinaDesafio>={CONTAR_SILABAS:'portugues',MONTAR_PALAVRA:'portugues',MESMO_INICIO:'portugues',COMPLETAR_PALAVRA:'portugues',SOMA_SUBTRACAO:'matematica',EQUILIBRAR_BALANCA:'matematica',SEQUENCIA_NUMERICA:'matematica',COMBINACAO_ALVO:'matematica'};
export const DESAFIOS_PADRAO=():ConfiguracaoDesafios=>Object.fromEntries(TIPOS_DESAFIO.map(type=>[type,{enabled:true,difficulty:'medium'}])) as ConfiguracaoDesafios;

const inteiro=(min:number,max:number):number=>Math.floor(Math.random()*(max-min+1))+min;
const misturar=<T>(itens:readonly T[]):T[]=>itens.map(valor=>({valor,ordem:Math.random()})).sort((a,b)=>a.ordem-b.ordem).map(item=>item.valor);
const unicos=(resposta:number,minimo:number,maximo:number,quantidade:number):string[]=>{const valores=new Set([resposta]);for(let d=1;valores.size<quantidade;d++){if(resposta+d<=maximo)valores.add(resposta+d);if(resposta-d>=minimo&&valores.size<quantidade)valores.add(resposta-d);}return misturar([...valores]).map(String);};
const base=(type:TipoDesafio,difficulty:DificuldadeDesafio,campos:Omit<InstanciaDesafio,'type'|'discipline'|'difficulty'>):InstanciaDesafio=>({type,discipline:DISCIPLINA_DESAFIO[type],difficulty,...campos});

interface ContextoGeracao {palavra:(min:number,max:number,filtro?:(item:PalavraReino)=>boolean)=>PalavraReino;faixa:{minimo:number;maximo:number}}
type Gerador=(dificuldade:DificuldadeDesafio,contexto:ContextoGeracao)=>InstanciaDesafio;

const contarSilabas:Gerador=(difficulty,{palavra})=>{const limites=difficulty==='easy'?[1,2]:difficulty==='medium'?[2,3]:[3,4],item=palavra(limites[0],limites[1]);return base('CONTAR_SILABAS',difficulty,{presentation:'alternativas',prompt:`Quantas sílabas tem ${item.palavra}?`,options:unicos(item.quantidadeSilabas,1,5,difficulty==='easy'?3:4),answer:[String(item.quantidadeSilabas)],selectionCount:1,ordered:false,explanation:`${item.palavra}: ${item.silabas.join(' – ')}.`,word:item});};
const montarPalavra:Gerador=(difficulty,{palavra})=>{const limites=difficulty==='easy'?[2,2]:difficulty==='medium'?[2,3]:[3,4],item=palavra(limites[0],limites[1]),intrusas=difficulty==='hard'?misturar(CATALOGO_PALAVRAS_REINO.flatMap(p=>p.silabas).filter(s=>!item.silabas.includes(s))).slice(0,1):[];return base('MONTAR_PALAVRA',difficulty,{presentation:'montagem',prompt:`Monte ${item.palavra}`,options:misturar([...item.silabas,...intrusas]),answer:[...item.silabas],selectionCount:item.silabas.length,ordered:true,explanation:`${item.silabas.join(' + ')} = ${item.palavra}.`,word:item});};
const mesmoInicio:Gerador=(difficulty,{palavra})=>{const item=palavra(2,difficulty==='hard'?4:3,candidato=>CATALOGO_PALAVRAS_REINO.some(p=>p.palavra!==candidato.palavra&&p.letraInicial===candidato.letraInicial)),corretas=CATALOGO_PALAVRAS_REINO.filter(p=>p.palavra!==item.palavra&&p.letraInicial===item.letraInicial),correta=misturar(corretas)[0],quantidade=difficulty==='easy'?3:4,distratores=misturar(CATALOGO_PALAVRAS_REINO.filter(p=>p.letraInicial!==item.letraInicial&&p.palavra!==item.palavra)).slice(0,quantidade-1);return base('MESMO_INICIO',difficulty,{presentation:'alternativas',prompt:`Qual palavra começa como ${item.palavra}?`,options:misturar([correta,...distratores].map(p=>p.palavra)),answer:[correta.palavra],selectionCount:1,ordered:false,explanation:`${item.palavra} e ${correta.palavra} começam com ${item.letraInicial}.`,word:item});};
const completarPalavra:Gerador=(difficulty,{palavra})=>{const limites=difficulty==='easy'?[2,2]:difficulty==='medium'?[2,3]:[3,4],item=palavra(limites[0],limites[1]),indice=inteiro(0,item.silabas.length-1),resposta=item.silabas[indice],quantidade=difficulty==='easy'?3:4,distratores=misturar([...new Set(CATALOGO_PALAVRAS_REINO.flatMap(p=>p.silabas).filter(s=>s!==resposta))]).slice(0,quantidade-1),lacunas=item.silabas.map((s,i)=>i===indice?'__':s).join('  ');return base('COMPLETAR_PALAVRA',difficulty,{presentation:'alternativas',prompt:`Complete ${item.palavra}: ${lacunas}`,options:misturar([resposta,...distratores]),answer:[resposta],selectionCount:1,ordered:false,explanation:`${item.silabas.join(' + ')} = ${item.palavra}.`,word:item});};
const somaSubtracao:Gerador=(difficulty,{faixa})=>{const min=Math.max(0,faixa.minimo),teto=Math.max(min,Math.min(faixa.maximo,difficulty==='easy'?10:difficulty==='medium'?20:50)),soma=Math.random()>.4;if(soma){const total=inteiro(Math.max(2,min),Math.max(2,teto)),a=inteiro(0,total),b=total-a;return base('SOMA_SUBTRACAO',difficulty,{presentation:'alternativas',prompt:`${a} + ${b} = ?`,options:unicos(total,min,Math.max(teto,total+3),difficulty==='easy'?3:4),answer:[String(total)],selectionCount:1,ordered:false,explanation:`${a} mais ${b} é ${total}.`});}const a=inteiro(Math.max(2,min),Math.max(2,teto)),b=inteiro(0,a-min),resposta=a-b;return base('SOMA_SUBTRACAO',difficulty,{presentation:'alternativas',prompt:`${a} − ${b} = ?`,options:unicos(resposta,min,Math.max(teto,resposta+3),difficulty==='easy'?3:4),answer:[String(resposta)],selectionCount:1,ordered:false,explanation:`${a} menos ${b} é ${resposta}.`});};
const equilibrarBalanca:Gerador=(difficulty,{faixa})=>{const minimo=Math.max(difficulty==='hard'?10:4,faixa.minimo),limite=Math.max(minimo,Math.min(faixa.maximo,difficulty==='easy'?10:difficulty==='medium'?20:40)),total=inteiro(minimo,limite),dropSide=difficulty!=='easy'&&Math.random()>.5?'left':'right';let conhecidos:number[],respostas:number[],opcoes:string[];if(difficulty==='hard'){const conhecido=inteiro(1,total-5),restante=total-conhecido,parcelas=Array.from({length:restante-1},(_,i)=>i+1).filter(n=>n*2!==restante),a=parcelas[inteiro(0,parcelas.length-1)],b=restante-a,valores=[a,b];for(let candidato=0;valores.length<4&&candidato<=limite;candidato++)if(!valores.includes(candidato)&&valores.every(valor=>valor+candidato!==restante))valores.push(candidato);conhecidos=[conhecido];respostas=[a,b];opcoes=misturar(valores).map(String);}else {const conhecido=inteiro(1,total-1),faltante=total-conhecido;conhecidos=[conhecido];respostas=[faltante];opcoes=unicos(faltante,0,Math.max(limite,faltante+3),difficulty==='easy'?3:4);}const dados:DadosBalancaReino=dropSide==='right'?{left:[total],right:conhecidos,dropSide,slots:respostas.length}:{left:conhecidos,right:[total],dropSide,slots:respostas.length};return base('EQUILIBRAR_BALANCA',difficulty,{presentation:'balanca',prompt:'Coloque os blocos até os dois lados ficarem iguais.',options:opcoes,answer:respostas.map(String),selectionCount:respostas.length,ordered:false,explanation:`${conhecidos.join(' + ')} + ${respostas.join(' + ')} = ${total}.`,payload:dados as unknown as Record<string,unknown>});};
const sequenciaNumerica:Gerador=(difficulty)=>{const passos=difficulty==='easy'?[1,2]:difficulty==='medium'?[2,3,5]:[2,3,4,5],passo=passos[inteiro(0,passos.length-1)],regressiva=difficulty!=='easy'&&Math.random()<.3,tamanho=difficulty==='hard'?6:5,inicio=regressiva?inteiro(passo*tamanho,30):inteiro(0,8),valores=Array.from({length:tamanho},(_,i)=>inicio+(regressiva?-passo:passo)*i),indice=inteiro(1,tamanho-2),resposta=valores[indice],prompt=valores.map((n,i)=>i===indice?'?':n).join('  →  ');return base('SEQUENCIA_NUMERICA',difficulty,{presentation:'sequencia',prompt,options:unicos(resposta,Math.min(...valores)-2,Math.max(...valores)+2,difficulty==='easy'?3:4),answer:[String(resposta)],selectionCount:1,ordered:false,explanation:`A regra é ${regressiva?'diminuir':'somar'} ${passo} a cada passo.`,payload:{step:regressiva?-passo:passo,values:valores,missingIndex:indice}});};
const combinacaoAlvo:Gerador=(difficulty,{faixa})=>{const limite=Math.max(4,Math.min(faixa.maximo,difficulty==='easy'?10:difficulty==='medium'?20:40)),target=inteiro(4,limite),parcelas=Array.from({length:target-1},(_,i)=>i+1).filter(n=>n*2!==target),a=parcelas[inteiro(0,parcelas.length-1)],b=target-a,quantidade=difficulty==='easy'?4:5,opcoes=[a,b];for(let candidato=0;opcoes.length<quantidade&&candidato<=limite;candidato++)if(!opcoes.includes(candidato)&&opcoes.every(valor=>valor+candidato!==target))opcoes.push(candidato);return base('COMBINACAO_ALVO',difficulty,{presentation:'bau',prompt:`Escolha dois números para formar ${target}`,options:misturar(opcoes).map(String),answer:[String(a),String(b)],selectionCount:2,ordered:false,explanation:`${a} + ${b} = ${target}.`,payload:{target}});};

export const challengeRegistry:Record<TipoDesafio,{discipline:DisciplinaDesafio;generate:Gerador}>={
    CONTAR_SILABAS:{discipline:'portugues',generate:contarSilabas},MONTAR_PALAVRA:{discipline:'portugues',generate:montarPalavra},MESMO_INICIO:{discipline:'portugues',generate:mesmoInicio},COMPLETAR_PALAVRA:{discipline:'portugues',generate:completarPalavra},SOMA_SUBTRACAO:{discipline:'matematica',generate:somaSubtracao},EQUILIBRAR_BALANCA:{discipline:'matematica',generate:equilibrarBalanca},SEQUENCIA_NUMERICA:{discipline:'matematica',generate:sequenciaNumerica},COMBINACAO_ALVO:{discipline:'matematica',generate:combinacaoAlvo}
};

export const validarRespostaDesafio=(desafio:InstanciaDesafio,resposta:string[]):boolean=>{const normalizar=(itens:string[])=>desafio.ordered?itens:[...itens].sort();return JSON.stringify(normalizar(resposta))===JSON.stringify(normalizar(desafio.answer));};

export class SessaoDesafiosReino {
    private palavrasUsadas=new Set<string>();
    private assinaturas:string[]=[];
    gerar(type:TipoDesafio,difficulty:DificuldadeDesafio,faixa={minimo:0,maximo:50}):InstanciaDesafio {
        const palavra=(min:number,max:number,filtro:((item:PalavraReino)=>boolean)=()=>true)=>{let elegiveis=CATALOGO_PALAVRAS_REINO.filter(p=>p.quantidadeSilabas>=min&&p.quantidadeSilabas<=max&&filtro(p)&&!this.palavrasUsadas.has(p.palavra));if(!elegiveis.length){this.palavrasUsadas.clear();elegiveis=CATALOGO_PALAVRAS_REINO.filter(p=>p.quantidadeSilabas>=min&&p.quantidadeSilabas<=max&&filtro(p));}const escolhida=misturar(elegiveis)[0];this.palavrasUsadas.add(escolhida.palavra);return escolhida;};
        let desafio=challengeRegistry[type].generate(difficulty,{palavra,faixa}),tentativas=0,assinatura='';
        do {assinatura=`${type}:${desafio.prompt}:${desafio.answer.join(',')}`;if(!this.assinaturas.includes(assinatura))break;desafio=challengeRegistry[type].generate(difficulty,{palavra,faixa});} while(++tentativas<8);
        this.assinaturas.push(assinatura);this.assinaturas=this.assinaturas.slice(-12);return desafio;
    }
}

export const escolherTiposDaJornada=(config:ConfiguracaoDesafios,quantidade:number):TipoDesafio[]=>{const ativos=TIPOS_DESAFIO.filter(type=>config[type].enabled);if(!ativos.length)throw new Error('A jornada precisa de pelo menos um desafio ativo.');const resultado:TipoDesafio[]=[];let disciplina:DisciplinaDesafio='portugues';for(let i=0;i<quantidade;i++){const ultimo=resultado[resultado.length-1];let candidatos=ativos.filter(type=>DISCIPLINA_DESAFIO[type]===disciplina&&type!==ultimo);if(!candidatos.length)candidatos=ativos.filter(type=>type!==ultimo);if(!candidatos.length)candidatos=ativos;const escolhido=misturar(candidatos)[0];resultado.push(escolhido);disciplina=DISCIPLINA_DESAFIO[escolhido]==='portugues'?'matematica':'portugues';}return resultado;};
