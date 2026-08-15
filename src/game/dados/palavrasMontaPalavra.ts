export type DificuldadeMontaPalavra='facil'|'medio'|'dificil';

export interface PalavraMontaPalavra {
    palavra:string;
    silabas:readonly string[];
    distratores:readonly string[];
    tema:'cotidiano'|'animal'|'alimento';
}

// Conteúdo padrão. Cada item mantém os dados separados da mecânica do jogo.
export const PALAVRAS_MONTA_PALAVRA:readonly PalavraMontaPalavra[]=[
    {palavra:'CASA',silabas:['CA','SA'],distratores:['PA','TA','CO'],tema:'cotidiano'},
    {palavra:'GATO',silabas:['GA','TO'],distratores:['CA','PO','TU'],tema:'animal'},
    {palavra:'PATO',silabas:['PA','TO'],distratores:['BA','GO','TE'],tema:'animal'},
    {palavra:'BOLA',silabas:['BO','LA'],distratores:['CO','MA','LU'],tema:'cotidiano'},
    {palavra:'BANANA',silabas:['BA','NA','NA'],distratores:['CA','MA','DA'],tema:'alimento'},
    {palavra:'PRATO',silabas:['PRA','TO'],distratores:['PA','TRA','DO'],tema:'cotidiano'},
    {palavra:'CHAVE',silabas:['CHA','VE'],distratores:['CA','VA','CHE'],tema:'cotidiano'},
    {palavra:'BRUXA',silabas:['BRU','XA'],distratores:['BU','RA','CHA'],tema:'cotidiano'}
];

export const QUANTIDADE_DISTRATORES:Record<DificuldadeMontaPalavra,number>={facil:0,medio:2,dificil:3};
