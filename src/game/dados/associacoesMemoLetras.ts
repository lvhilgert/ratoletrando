export type RegraAssociacao='sameInitialLetter'|'sameInitialSyllable'|'imageToWord'|'operationToResult'|'uppercaseToLowercase';
export type DificuldadeMemoLetras='inicial'|'intermediario'|'avancado';

export interface ItemAssociacao {texto:string;imagem?:string}
export interface ParAssociacao {grupo:string;itens:readonly [ItemAssociacao,ItemAssociacao]}
export interface ConjuntoAssociacao {regra:RegraAssociacao;titulo:string;pares:readonly ParAssociacao[]}

export const ASSOCIACOES_MEMO_LETRAS:ConjuntoAssociacao={
    regra:'sameInitialLetter',
    titulo:'MESMA LETRA INICIAL',
    pares:[
        {grupo:'R',itens:[{texto:'RATO'},{texto:'ROSA'}]},
        {grupo:'G',itens:[{texto:'GATO'},{texto:'GIRAFA'}]},
        {grupo:'P',itens:[{texto:'PATO'},{texto:'PIPA'}]},
        {grupo:'B',itens:[{texto:'BOLA'},{texto:'BOLO'}]},
        {grupo:'C',itens:[{texto:'CASA'},{texto:'CAVALO'}]},
        {grupo:'M',itens:[{texto:'MALA'},{texto:'MESA'}]}
    ]
};

export const PARES_POR_DIFICULDADE:Record<DificuldadeMemoLetras,number>={inicial:3,intermediario:4,avancado:6};
