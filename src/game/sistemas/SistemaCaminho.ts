import { PosicaoGrade } from '../tipos/jogo';

const chave = (p: PosicaoGrade): string => `${p.linha},${p.coluna}`;

export function buscarCaminho(mapa: number[][], inicio: PosicaoGrade, fim: PosicaoGrade): PosicaoGrade[] {
    const fila: PosicaoGrade[] = [inicio];
    const anteriores = new Map<string, PosicaoGrade | null>([[chave(inicio), null]]);
    const direcoes = [[1,0],[-1,0],[0,1],[0,-1]];
    while (fila.length) {
        const atual = fila.shift()!;
        if (chave(atual) === chave(fim)) break;
        for (const [dl, dc] of direcoes) {
            const proxima = { linha: atual.linha + dl, coluna: atual.coluna + dc };
            if (mapa[proxima.linha]?.[proxima.coluna] === 0 && !anteriores.has(chave(proxima))) {
                anteriores.set(chave(proxima), atual); fila.push(proxima);
            }
        }
    }
    if (!anteriores.has(chave(fim))) return [];
    const rota: PosicaoGrade[] = []; let atual: PosicaoGrade | null = fim;
    while (atual) { rota.unshift(atual); atual = anteriores.get(chave(atual)) ?? null; }
    return rota.slice(1);
}
