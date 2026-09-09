import type { PlataformaReino, PontoReino, TerrenoReino } from './LevelReino';

const MEIA_MOEDA=23,ALTURA_MOEDA=48;

export const moedaSobrepoeTerreno=({x,y}:PontoReino,terrenos:TerrenoReino[]):boolean=>terrenos.some(t=>x+MEIA_MOEDA>t.x-t.largura/2&&x-MEIA_MOEDA<t.x+t.largura/2&&y+MEIA_MOEDA>t.topo);

export const gerarMoedasReino=(plataformas:PlataformaReino[],terrenos:TerrenoReino[]):PontoReino[]=>plataformas.map(p=>({x:p.x,y:p.topo-ALTURA_MOEDA})).filter(m=>!moedaSobrepoeTerreno(m,terrenos));
