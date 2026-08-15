import { ConfiguracaoFase } from '../tipos/jogo';
import { ModoPalavras, obterDicionario } from './palavras';

const BASE = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,1,0,1,1,0,0,0,1,0,1,0,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,0,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const mudancas: Array<Array<[number,number,number]>> = [
    [], [[3,5,0],[4,7,0],[6,7,1]], [[1,7,0],[5,4,0],[7,9,0],[4,6,1]],
    [[2,7,0],[4,3,1],[6,10,1],[8,7,0]], [[1,7,0],[3,5,0],[5,9,0],[7,5,0],[4,10,1]]
];
const semente = Math.floor(Math.random()*1000);

export function criarFase(indice:number, modo:ModoPalavras='ate4'): ConfiguracaoFase {
    const mapa=BASE.map(l=>[...l]);
    mudancas[indice%mudancas.length].forEach(([l,c,v])=>mapa[l][c]=v);
    const dicionario=obterDicionario(modo);
    const palavra=dicionario[(semente+indice*73)%dicionario.length];
    return {
        numero:indice+1,palavra,mapa,
        velocidadeRato:150,velocidadeGato:Math.min(112,72+indice*2),
        quantidadeGatos:1,quantidadeQueijos:3+indice%3,quantidadeFrutas:2+indice%2,
        pontosBolinha:10,pontosQueijo:50,pontosFruta:75,pontosLetra:100,
        posicaoInicialRato:{linha:1,coluna:1},posicoesIniciaisGatos:[{linha:8,coluna:13}],
        letrasIncorretas:[],tipoGato:'normal'
    };
}
