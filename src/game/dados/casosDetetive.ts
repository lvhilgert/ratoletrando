import { FaseDetetiveConfig, TemaDetetive } from './tiposDetetive';
import { CASO_LAPIS_DOURADO } from './casos/caso01LapisDourado';
import { CASO_LIVRO_FORA_DO_LUGAR } from './casos/caso02LivroForaDoLugar';
import { CASO_BONE_VERMELHO } from './casos/caso03BoneVermelho';

export interface MetaCasoDetetive {id:string;numero:number;titulo:string;tema:TemaDetetive}

/**
 * Lista de todos os 15 casos planejados. Fases sem configuração completa em
 * `CASOS_JOGAVEIS` aparecem no menu como "em construção" mesmo quando desbloqueadas.
 * Para adicionar a fase 16: criar um novo arquivo em `dados/casos/`, exportar um
 * `FaseDetetiveConfig`, adicionar aqui os metadados e registrar em `CASOS_JOGAVEIS`.
 */
export const TODOS_OS_CASOS:MetaCasoDetetive[]=[
    {id:'lapis-dourado',numero:1,titulo:'O Mistério do Lápis Dourado',tema:'escola'},
    {id:'livro-fora-do-lugar',numero:2,titulo:'O Livro Fora do Lugar',tema:'escola'},
    {id:'bone-vermelho',numero:3,titulo:'O Mistério do Boné Vermelho',tema:'parquinho'},
    {id:'pegadas-no-bosque',numero:4,titulo:'Pegadas no Bosque',tema:'floresta'},
    {id:'bola-atras-da-cerca',numero:5,titulo:'A Bola Atrás da Cerca',tema:'parquinho'},
    {id:'castelo-de-areia',numero:6,titulo:'O Castelo de Areia Desfeito',tema:'praia'},
    {id:'chave-do-portao',numero:7,titulo:'A Chave do Portão',tema:'rpg'},
    {id:'trofeu-desaparecido',numero:8,titulo:'O Troféu Desaparecido',tema:'escola'},
    {id:'luz-da-cabana',numero:9,titulo:'A Luz da Cabana',tema:'floresta'},
    {id:'mapa-levado-pelo-vento',numero:10,titulo:'O Mapa Levado pelo Vento',tema:'praia'},
    {id:'po-de-estrelas',numero:11,titulo:'O Pó de Estrelas',tema:'fadas'},
    {id:'rubi-da-torre',numero:12,titulo:'O Rubi da Torre',tema:'rpg'},
    {id:'vela-do-corredor',numero:13,titulo:'A Vela do Corredor',tema:'mansao'},
    {id:'retrato-que-mudou',numero:14,titulo:'O Retrato Que Mudou',tema:'mansao'},
    {id:'segredo-do-castelo-encantado',numero:15,titulo:'O Segredo do Castelo Encantado',tema:'rpg'}
];

export const CASOS_JOGAVEIS:Record<string,FaseDetetiveConfig>={
    'lapis-dourado':CASO_LAPIS_DOURADO,
    'livro-fora-do-lugar':CASO_LIVRO_FORA_DO_LUGAR,
    'bone-vermelho':CASO_BONE_VERMELHO
};

export function obterCaso(id:string):FaseDetetiveConfig|undefined {return CASOS_JOGAVEIS[id];}
export function proximoCasoId(idAtual:string):string|undefined {const i=TODOS_OS_CASOS.findIndex(c=>c.id===idAtual);return i>=0?TODOS_OS_CASOS[i+1]?.id:undefined;}
