export type NivelContaComigo='nivel1'|'nivel2'|'nivel3'|'nivel4';
export type CategoriaObjeto='frutas'|'estrelas'|'bolinhas';

export interface ConfiguracaoNivelContaComigo {
    rotulo:string;
    quantidadeMinima:number;
    quantidadeMaxima:number;
    numeroAlternativas:number;
    quantidadeDesafios:number;
    categorias:readonly CategoriaObjeto[];
}

export const NIVEIS_CONTA_COMIGO:Record<NivelContaComigo,ConfiguracaoNivelContaComigo>={
    nivel1:{rotulo:'1 A 5',quantidadeMinima:1,quantidadeMaxima:5,numeroAlternativas:3,quantidadeDesafios:5,categorias:['frutas','estrelas']},
    nivel2:{rotulo:'1 A 10',quantidadeMinima:1,quantidadeMaxima:10,numeroAlternativas:3,quantidadeDesafios:6,categorias:['frutas','estrelas','bolinhas']},
    nivel3:{rotulo:'1 A 20',quantidadeMinima:1,quantidadeMaxima:20,numeroAlternativas:4,quantidadeDesafios:8,categorias:['frutas','estrelas','bolinhas']},
    nivel4:{rotulo:'1 A 30',quantidadeMinima:10,quantidadeMaxima:30,numeroAlternativas:4,quantidadeDesafios:8,categorias:['frutas','estrelas','bolinhas']}
};
