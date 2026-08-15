export type TipoExercicioEscrita='letra'|'sílaba'|'palavra';

export interface ExercicioEscrita {
    tipo:TipoExercicioEscrita;
    conteudo:string;
    partes:readonly string[];
}

// Conteúdo padrão. No futuro, esta lista pode ser substituída por exercícios da turma.
export const EXERCICIOS_OUVI_ESCREVI:readonly ExercicioEscrita[]=[
    {tipo:'letra',conteudo:'A',partes:['A']},{tipo:'letra',conteudo:'B',partes:['B']},{tipo:'letra',conteudo:'R',partes:['R']},
    {tipo:'sílaba',conteudo:'CA',partes:['CA']},{tipo:'sílaba',conteudo:'PA',partes:['PA']},{tipo:'sílaba',conteudo:'BO',partes:['BO']},
    {tipo:'palavra',conteudo:'CASA',partes:['CA','SA']},{tipo:'palavra',conteudo:'BOLA',partes:['BO','LA']},{tipo:'palavra',conteudo:'RATO',partes:['RA','TO']}
];
