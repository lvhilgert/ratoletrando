import type { NivelReino, PlataformaReino, PontoReino, RotaReino, TerrenoReino } from './LevelReino.ts';
import { gerarMoedasReino } from './MoedasReino.ts';

const ponto=(x:number,y:number):PontoReino=>({x,y});
const plataformasDaRota=(rotas:RotaReino[]):PlataformaReino[]=>rotas.flatMap(rota=>[...rota.segura.map(p=>({x:p.x,topo:p.y,largura:210})),...rota.agil.map(p=>({x:p.x,topo:p.y,largura:155}))]);
const gapsDosTerrenos=(terrenos:TerrenoReino[])=>terrenos.slice(0,-1).map((t,i)=>({inicio:t.x+t.largura/2,fim:terrenos[i+1].x-terrenos[i+1].largura/2})).filter(g=>g.fim>g.inicio);
const nivel=(seed:number,spawn:PontoReino,portal:PontoReino,portas:PontoReino[],checkpoints:PontoReino[],terrenos:TerrenoReino[],rotas:RotaReino[],extras:PlataformaReino[]=[],gapControlado?:{inicio:number;fim:number;controladoPor:string}):NivelReino=>{const plataformas=[...plataformasDaRota(rotas),...extras];return {seed,largura:6200,altura:1440,limiteQueda:1410,spawn,portal,portas,checkpoints,terrenos,rotas,plataformas,moedas:gerarMoedasReino(plataformas,terrenos),gaps:[...gapsDosTerrenos(terrenos).filter(g=>!gapControlado||g.fim<=gapControlado.inicio||g.inicio>=gapControlado.fim),...(gapControlado?[gapControlado]:[])],marcos:[spawn,...portas,portal],trechos:['intro','movel','rota-alta','portao','escada','movel','portao','rota-alta','ponte-quebrada','portao','final']};};

export const nivelCostaDosMoinhos=(seed:number):NivelReino=>{
    const terrenos:TerrenoReino[]=[{x:360,largura:720,topo:1260},{x:980,largura:500,topo:1120},{x:1510,largura:560,topo:990},{x:2040,largura:500,topo:990},{x:2620,largura:580,topo:840},{x:3230,largura:580,topo:680},{x:3780,largura:520,topo:680},{x:4380,largura:620,topo:510},{x:4990,largura:520,topo:390},{x:5660,largura:1080,topo:300}];
    const rotas:RotaReino[]=[
        {id:'moinho-baixo',inicio:ponto(620,1260),fim:ponto(1800,990),segura:[ponto(780,1220),ponto(980,1160),ponto(1200,1110),ponto(1430,1050),ponto(1640,1000)],agil:[ponto(760,1130),ponto(960,1040),ponto(1170,950),ponto(1390,900),ponto(1600,940)]},
        {id:'estaleiro',inicio:ponto(2180,990),fim:ponto(3440,680),segura:[ponto(2380,950),ponto(2580,890),ponto(2790,830),ponto(3000,770),ponto(3220,710)],agil:[ponto(2370,850),ponto(2580,760),ponto(2800,700),ponto(3020,650),ponto(3240,620)]},
        {id:'velas',inicio:ponto(3700,680),fim:ponto(5200,300),segura:[ponto(3900,640),ponto(4120,580),ponto(4340,520),ponto(4560,460),ponto(4780,400),ponto(5000,340)],agil:[ponto(3880,550),ponto(4100,460),ponto(4320,390),ponto(4540,330),ponto(4770,270),ponto(5000,300)]},
    ];
    return nivel(seed,ponto(120,1140),ponto(5960,220),[ponto(1900,909),ponto(3500,599),ponto(5050,309)],[ponto(2040,950),ponto(3660,640),ponto(5160,350)],terrenos,rotas,[{x:1060,topo:1010,largura:210,movel:'y',amplitude:70},{x:2920,topo:690,largura:210,movel:'y',amplitude:85}]);
};

export const nivelRuinasDaLua=(seed:number):NivelReino=>{
    const terrenos:TerrenoReino[]=[{x:360,largura:720,topo:320},{x:980,largura:520,topo:500},{x:1510,largura:520,topo:620},{x:2040,largura:520,topo:620},{x:2650,largura:600,topo:820},{x:3260,largura:580,topo:1020},{x:3840,largura:560,topo:1020},{x:4440,largura:600,topo:860},{x:5010,largura:500,topo:650},{x:5650,largura:1100,topo:300}];
    const rotas:RotaReino[]=[
        {id:'parede-lunar',inicio:ponto(620,320),fim:ponto(1800,620),segura:[ponto(800,360),ponto(1000,420),ponto(1220,480),ponto(1440,540),ponto(1650,600)],agil:[ponto(790,260),ponto(1000,330),ponto(1210,400),ponto(1430,470),ponto(1640,540)]},
        {id:'aqueduto',inicio:ponto(2150,620),fim:ponto(3480,1020),segura:[ponto(2350,670),ponto(2560,730),ponto(2780,790),ponto(3000,860),ponto(3220,930)],agil:[ponto(2340,550),ponto(2560,620),ponto(2780,690),ponto(3000,760),ponto(3230,850)]},
        {id:'luz-da-raposa',inicio:ponto(3670,1020),fim:ponto(5200,650),segura:[ponto(3880,980),ponto(4100,920),ponto(4320,860),ponto(4540,800),ponto(4760,740),ponto(4980,680)],agil:[ponto(3880,900),ponto(4100,810),ponto(4320,730),ponto(4540,650),ponto(4770,590),ponto(5000,610)]},
    ];
    return nivel(seed,ponto(120,200),ponto(5960,220),[ponto(1850,539),ponto(3500,939),ponto(5050,569)],[ponto(1990,580),ponto(3630,980),ponto(5160,610)],terrenos,rotas,[{x:5480,topo:470,largura:210},{x:5680,topo:320,largura:200},{x:5860,topo:190,largura:190},{x:6020,topo:100,largura:180}]);
};

export const nivelCanionDosColossos=(seed:number):NivelReino=>{
    const terrenos:TerrenoReino[]=[{x:360,largura:720,topo:360},{x:960,largura:480,topo:560},{x:1480,largura:520,topo:820},{x:2040,largura:520,topo:820},{x:2640,largura:600,topo:1010},{x:3260,largura:600,topo:1180},{x:3860,largura:600,topo:1180},{x:4260,largura:200,topo:760},{x:4940,largura:580,topo:760},{x:5520,largura:780,topo:520},{x:5960,largura:400,topo:300}];
    const rotas:RotaReino[]=[
        {id:'parede-rachada',inicio:ponto(620,360),fim:ponto(1810,820),segura:[ponto(800,420),ponto(1000,500),ponto(1210,580),ponto(1420,660),ponto(1630,740)],agil:[ponto(790,300),ponto(990,380),ponto(1200,460),ponto(1410,540),ponto(1620,650)]},
        {id:'rampa-peso',inicio:ponto(2150,820),fim:ponto(3490,1180),segura:[ponto(2350,870),ponto(2570,930),ponto(2790,990),ponto(3010,1050),ponto(3230,1110)],agil:[ponto(2340,740),ponto(2560,820),ponto(2780,900),ponto(3000,980),ponto(3230,1060)]},
        {id:'ponte-colosso',inicio:ponto(3700,1180),fim:ponto(5160,760),segura:[ponto(3900,1120),ponto(4100,1040),ponto(4300,960),ponto(4520,880),ponto(4760,820),ponto(4980,780)],agil:[ponto(3890,1030),ponto(4100,920),ponto(4310,820),ponto(4520,730),ponto(4760,650),ponto(4980,700)]},
    ];
    return nivel(seed,ponto(120,240),ponto(5960,220),[ponto(1900,739),ponto(3600,1099),ponto(5100,679)],[ponto(2020,780),ponto(3710,1140),ponto(5220,720)],terrenos,rotas,[{x:4380,topo:700,largura:170},{x:4810,topo:700,largura:170},{x:5790,topo:350,largura:200},{x:5950,topo:250,largura:190}],{inicio:4470,fim:4750,controladoPor:'canion-ponte-formada'});
};
