export interface PosicaoGrade { linha: number; coluna: number }

export type TipoGato = 'normal';

export interface ConfiguracaoFase {
    numero: number;
    palavra: string;
    velocidadeRato: number;
    velocidadeGato: number;
    quantidadeGatos: number;
    quantidadeQueijos: number;
    quantidadeFrutas: number;
    pontosBolinha: number;
    pontosQueijo: number;
    pontosFruta: number;
    pontosLetra: number;
    mapa: number[][];
    posicaoInicialRato: PosicaoGrade;
    posicoesIniciaisGatos: PosicaoGrade[];
    letrasIncorretas: string[];
    tipoGato: TipoGato;
}

export interface DadosFimFase { fase: number; palavra: string; pontuacao: number; totalAcumulado: number }
