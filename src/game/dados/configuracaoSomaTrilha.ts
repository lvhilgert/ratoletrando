export type OperacaoMatematica='soma'|'subtracao';
export type NivelSomaTrilha='somaFacil'|'somaIntermediaria'|'subtracaoFacil'|'subtracaoIntermediaria';

export interface ConfiguracaoNivelSomaTrilha {
    rotulo:string;
    operacao:OperacaoMatematica;
    valorMinimo:number;
    valorMaximo:number;
    resultadoMaximo:number;
    quantidadeDesafios:number;
}

export const NIVEIS_SOMA_TRILHA:Record<NivelSomaTrilha,ConfiguracaoNivelSomaTrilha>={
    somaFacil:{rotulo:'SOMA 10',operacao:'soma',valorMinimo:1,valorMaximo:9,resultadoMaximo:10,quantidadeDesafios:6},
    somaIntermediaria:{rotulo:'SOMA 20',operacao:'soma',valorMinimo:1,valorMaximo:19,resultadoMaximo:20,quantidadeDesafios:8},
    subtracaoFacil:{rotulo:'MENOS 10',operacao:'subtracao',valorMinimo:0,valorMaximo:10,resultadoMaximo:10,quantidadeDesafios:6},
    subtracaoIntermediaria:{rotulo:'MENOS 20',operacao:'subtracao',valorMinimo:0,valorMaximo:20,resultadoMaximo:20,quantidadeDesafios:8}
};
