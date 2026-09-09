export type TipoTrechoReino='intro'|'colina'|'gap'|'rota-alta'|'escada'|'ponte-quebrada'|'movel'|'descanso'|'portao'|'final';
export interface PontoReino {x:number;y:number}
export interface TerrenoReino {x:number;largura:number;topo:number;gelo?:boolean}
export interface PlataformaReino {x:number;topo:number;largura:number;movel?:'x'|'y';especial?:'quebravel'|'impulso';gelo?:boolean;amplitude?:number}
export interface RotaReino {id:string;inicio:PontoReino;fim:PontoReino;segura:PontoReino[];agil:PontoReino[]}
export interface NivelReino {seed:number;largura:number;altura:number;limiteQueda:number;spawn:PontoReino;portal:PontoReino;portas:PontoReino[];trechos:TipoTrechoReino[];terrenos:TerrenoReino[];plataformas:PlataformaReino[];moedas:PontoReino[];gaps:{inicio:number;fim:number}[];checkpoints:PontoReino[];marcos:PontoReino[];rotas?:RotaReino[]}
export interface PerfilBiomaReino {chao:number;topo:number;detalhe:number;plataforma:number;atmosfera:'folhas'|'vida'|'cristais'|'vento'|'nevoa'|'magia'|'tochas'|'brasas'|'neve'}
export type TipoAventuraReino='chave'|'placa'|'cristais'|'alavanca'|'resgate'|'paginas'|'corda'|'guardiao';
export interface AventuraReino {id:string;tipo:TipoAventuraReino;nome:string;instrucao:string;icone:string;eventos:string[];posicoes:PontoReino[];bloqueio?:PontoReino}
export const AVENTURAS_REINO:AventuraReino[]=[
    {id:'chave-clareira',tipo:'chave',nome:'CHAVE DA CLAREIRA',instrucao:'Suba, encontre a chave e abra o portão.',icone:'🔑',eventos:['portao-ambiental'],posicoes:[{x:2100,y:900}],bloqueio:{x:3150,y:690}},
    {id:'engrenagem-praca',tipo:'placa',nome:'ENGRENAGEM DA PRAÇA',instrucao:'Empurre a caixa até a placa.',icone:'▣',eventos:['placa-ativada'],posicoes:[{x:2500,y:780},{x:2780,y:780}],bloqueio:{x:3150,y:630}},
    {id:'cristais-ecos',tipo:'cristais',nome:'CRISTAIS DOS ECOS',instrucao:'Ative os três cristais luminosos.',icone:'◆',eventos:['cristal-1','cristal-2','cristal-3'],posicoes:[{x:1800,y:580},{x:2600,y:830},{x:4000,y:860}]},
    {id:'ponte-ventos',tipo:'alavanca',nome:'PONTE DOS VENTOS',instrucao:'Ataque a alavanca para baixar a ponte.',icone:'⚙',eventos:['ponte-ativada'],posicoes:[{x:3500,y:580}]},
    {id:'amigo-perdido',tipo:'resgate',nome:'AMIGO PERDIDO',instrucao:'Encontre e liberte a criatura.',icone:'♡',eventos:['amigo-liberto'],posicoes:[{x:4300,y:510}]},
    {id:'paginas-magicas',tipo:'paginas',nome:'PÁGINAS MÁGICAS',instrucao:'Encontre as três páginas luminosas.',icone:'▤',eventos:['pagina-1','pagina-2','pagina-3'],posicoes:[{x:1900,y:870},{x:3300,y:560},{x:4700,y:290}]},
    {id:'travessia-muralha',tipo:'corda',nome:'TRAVESSIA DA MURALHA',instrucao:'Corte a corda para liberar a ponte.',icone:'✂',eventos:['corda-cortada'],posicoes:[{x:3500,y:550}]},
    {id:'guardiao-fornalha',tipo:'guardiao',nome:'GUARDIÃO DA FORNALHA',instrucao:'Derrote o guardião diante do portal.',icone:'♜',eventos:['guardiao-derrotado'],posicoes:[{x:5520,y:140}]},
    {id:'guardiao-picos',tipo:'guardiao',nome:'GUARDIÃO DOS PICOS',instrucao:'Supere o Mamute e alcance a aurora.',icone:'❄',eventos:['guardiao-derrotado'],posicoes:[{x:5520,y:160}]},
];
export const PERFIS_BIOMA_REINO:Record<string,PerfilBiomaReino>={
    bosque:{chao:0x765238,topo:0x72a94e,detalhe:0xb8d66c,plataforma:0x658b48,atmosfera:'folhas'},
    vila:{chao:0x8a6845,topo:0x9fbb67,detalhe:0xe0bd72,plataforma:0x9a744a,atmosfera:'vida'},
    caverna:{chao:0x344b5c,topo:0x54758c,detalhe:0x43d8e7,plataforma:0x476a7d,atmosfera:'cristais'},
    montanha:{chao:0x58656b,topo:0x84958f,detalhe:0xd9e5d9,plataforma:0x6e7c80,atmosfera:'vento'},
    pantano:{chao:0x4b5332,topo:0x78814b,detalhe:0xa4c369,plataforma:0x59643c,atmosfera:'nevoa'},
    biblioteca:{chao:0x584233,topo:0x8c6d48,detalhe:0xd3a85d,plataforma:0x73523b,atmosfera:'magia'},
    castelo:{chao:0x515967,topo:0x858e9b,detalhe:0xd0b36c,plataforma:0x68717e,atmosfera:'tochas'},
    fogo:{chao:0x3b3030,topo:0x6f4840,detalhe:0xff8b3d,plataforma:0x59413b,atmosfera:'brasas'},
    neve:{chao:0x7ba1b7,topo:0xf4fbff,detalhe:0x8ee7f2,plataforma:0xa9d9e8,atmosfera:'neve'},
};

const CENTROS=[425,1200,1900,2600,3300,4000,4700,5550],LARGURAS=[850,650,650,650,650,650,650,1300];
const TOPOS_VERTICAIS=[
    [1260,1170,1030,900,760,600,450,300],
    [1260,1120,980,850,700,540,410,300],
    [260,430,650,900,1260,930,600,260],
    [1270,1140,980,820,650,500,350,220],
    [1250,1160,1020,900,730,580,430,300],
    [1260,1100,940,790,630,490,360,250],
    [1260,1090,930,780,620,480,340,230],
    [1270,1110,950,790,620,470,330,210],
] as const;
const EXTRAS_VERTICAIS:PlataformaReino[][]=[
    [{x:920,topo:1180,largura:205,especial:'impulso'}],
    [{x:3000,topo:650,largura:170,movel:'y',amplitude:75}],
    [{x:4100,topo:850,largura:170,movel:'y',amplitude:90},{x:4600,topo:570,largura:170,especial:'impulso'}],
    [{x:2850,topo:650,largura:165,movel:'x',amplitude:90},{x:4450,topo:280,largura:165,movel:'y',amplitude:75}],
    [{x:3050,topo:650,largura:180,movel:'x',amplitude:85},{x:4550,topo:330,largura:170,movel:'y',amplitude:70}],
    [{x:2650,topo:650,largura:175,movel:'y',amplitude:80},{x:4400,topo:290,largura:170,movel:'x',amplitude:75}],
    [{x:3100,topo:500,largura:175,movel:'y',amplitude:80}],
    [{x:2850,topo:560,largura:165,movel:'y',amplitude:85},{x:4600,topo:220,largura:155,especial:'quebravel'}],
];
const TRECHOS_VERTICAIS:TipoTrechoReino[][]=[
    ['intro','escada','rota-alta','portao','colina','escada','portao','rota-alta','escada','portao','final'],
    ['intro','colina','rota-alta','portao','movel','escada','portao','rota-alta','movel','portao','final'],
    ['intro','colina','gap','portao','movel','descanso','portao','escada','rota-alta','portao','final'],
    ['intro','escada','movel','portao','rota-alta','movel','portao','escada','rota-alta','portao','final'],
    ['intro','colina','movel','portao','rota-alta','movel','portao','escada','descanso','portao','final'],
    ['intro','escada','rota-alta','portao','movel','movel','portao','escada','rota-alta','portao','final'],
    ['intro','colina','rota-alta','portao','ponte-quebrada','movel','portao','escada','rota-alta','portao','final'],
    ['intro','escada','movel','portao','ponte-quebrada','movel','portao','rota-alta','ponte-quebrada','portao','final'],
];
const ponto=(x:number,y:number):PontoReino=>({x,y});
const criarRota=(id:string,inicio:PontoReino,fim:PontoReino,passos:number,variacao:number):RotaReino=>{
    const caminho=(altura:number)=>Array.from({length:passos},(_,i)=>{const t=(i+1)/(passos+1),onda=Math.sin(Math.PI*t)*altura;return ponto(Math.round(inicio.x+(fim.x-inicio.x)*t),Math.round(inicio.y+(fim.y-inicio.y)*t-onda));});
    return {id,inicio,fim,segura:caminho(35),agil:caminho(variacao)};
};
const criarNivelVertical=(fase:number,seed:number):NivelReino=>{
    const topos=TOPOS_VERTICAIS[fase],terrenos=topos.map((topo,i)=>({x:CENTROS[i],largura:LARGURAS[i],topo})),topoEm=(x:number)=>terrenos.find(t=>x>=t.x-t.largura/2&&x<=t.x+t.largura/2)?.topo??topos[topos.length-1];
    const rotas=[criarRota('bifurcacao-1',ponto(700,topos[0]),ponto(2050,topos[2]),5,125+fase*3),criarRota('bifurcacao-2',ponto(2200,topos[2]),ponto(4000,topos[5]),6,145+(fase%3)*15),criarRota('bifurcacao-3',ponto(4150,topos[5]),ponto(5400,topos[7]),6,135+(fase%2)*20)];
    const plataformas:PlataformaReino[]=[];rotas.forEach(r=>{r.segura.forEach(({x,y})=>plataformas.push({x,topo:y,largura:205}));r.agil.forEach(({x,y})=>plataformas.push({x,topo:y,largura:150}));});plataformas.push(...EXTRAS_VERTICAIS[fase]);
    const portas=[2050,4000,5400].map(x=>ponto(x,topoEm(x)-81)),portal=ponto(5950,topoEm(5950)-95),spawn=ponto(120,topoEm(120)-120),checkpoints=[2150,4200,5250].map(x=>ponto(x,topoEm(x)-10));
    const gaps=terrenos.slice(0,-1).map((t,i)=>({inicio:t.x+t.largura/2,fim:terrenos[i+1].x-terrenos[i+1].largura/2})).filter(g=>g.fim>g.inicio);
    return {seed,largura:6200,altura:1440,limiteQueda:1410,spawn,portal,portas,trechos:TRECHOS_VERTICAIS[fase],terrenos,plataformas,moedas:plataformas.map(p=>ponto(p.x,p.topo-48)),gaps,checkpoints,marcos:[spawn,...portas,portal],rotas};
};

export const gerarNivelReino=(fase:number,seed:number):NivelReino=>{
    if(fase===8)return nivelPicosDasTrilhas(seed);
    return criarNivelVertical(fase,seed);
};

/** Layout autoral da fase 9; só generalize depois de existir outro bioma vertical. */
const nivelPicosDasTrilhas=(seed:number):NivelReino=>{
    const terrenos:TerrenoReino[]=[
        {x:430,largura:860,topo:1260},{x:1080,largura:360,topo:1180,gelo:true},{x:1580,largura:420,topo:1060},{x:1970,largura:360,topo:980},
        {x:2440,largura:520,topo:900},{x:3020,largura:420,topo:760},{x:3520,largura:420,topo:610},{x:4030,largura:460,topo:520,gelo:true},
        {x:4540,largura:430,topo:420},{x:5050,largura:430,topo:330},{x:5650,largura:1100,topo:315},
    ];
    const plataformas:PlataformaReino[]=[
        {x:820,topo:1160,largura:150},{x:980,topo:1080,largura:150},{x:1160,topo:1000,largura:160},{x:1370,topo:940,largura:170},
        {x:880,topo:1210,largura:190},{x:1120,topo:1170,largura:190},{x:1360,topo:1120,largura:190},
        {x:2180,topo:900,largura:180},{x:2370,topo:825,largura:170},{x:2570,topo:750,largura:170},{x:2790,topo:680,largura:180},
        {x:2220,topo:970,largura:210},{x:2480,topo:900,largura:210},{x:2740,topo:830,largura:210},{x:3010,topo:700,largura:150,movel:'y',amplitude:105},
        {x:3200,topo:650,largura:160},{x:3390,topo:585,largura:160},{x:3710,topo:545,largura:180,movel:'x',amplitude:90},
        {x:3820,topo:455,largura:190},{x:4100,topo:390,largura:170},{x:4370,topo:330,largura:170},{x:4660,topo:275,largura:150,especial:'quebravel'},
        {x:3820,topo:590,largura:220},{x:4100,topo:530,largura:220,gelo:true},{x:4380,topo:470,largura:220},{x:4780,topo:360,largura:170},
    ];
    const moedas:PontoReino[]=[...plataformas.map(p=>({x:p.x,y:p.topo-48})),{x:560,y:1195},{x:1870,y:910},{x:3470,y:545},{x:5000,y:260},{x:5480,y:245}];
    const rotas:RotaReino[]=[
        {id:'muralha',inicio:{x:780,y:1260},fim:{x:1600,y:1060},segura:[{x:880,y:1210},{x:1120,y:1170},{x:1360,y:1120}],agil:[{x:820,y:1160},{x:980,y:1080},{x:1160,y:1000},{x:1370,y:940}]},
        {id:'elevadores',inicio:{x:2140,y:980},fim:{x:3520,y:610},segura:[{x:2220,y:970},{x:2480,y:900},{x:2740,y:830},{x:3010,y:700},{x:3200,y:650},{x:3390,y:585}],agil:[{x:2180,y:900},{x:2370,y:825},{x:2570,y:750},{x:2790,y:680},{x:3010,y:700},{x:3200,y:650},{x:3390,y:585}]},
        {id:'crista',inicio:{x:3700,y:610},fim:{x:5050,y:330},segura:[{x:3820,y:590},{x:4100,y:530},{x:4380,y:470},{x:4540,y:420},{x:4780,y:360}],agil:[{x:3820,y:455},{x:4100,y:390},{x:4370,y:330},{x:4660,y:275},{x:4780,y:360}]},
    ];
    return {seed,largura:6200,altura:1440,limiteQueda:1410,spawn:{x:120,y:1140},portal:{x:5950,y:220},portas:[{x:1900,y:899},{x:3500,y:529},{x:5050,y:249}],trechos:['intro','rota-alta','portao','movel','escada','portao','ponte-quebrada','portao','final'],terrenos,plataformas,moedas,gaps:[{inicio:860,fim:900},{inicio:2110,fim:2180},{inicio:3650,fim:3760}],checkpoints:[{x:2070,y:860},{x:3590,y:490},{x:5120,y:210}],marcos:[{x:120,y:1140},{x:1900,y:899},{x:3500,y:529},{x:5050,y:249},{x:5950,y:220}],rotas};
};

export const validarNivelReino=(nivel:NivelReino):string[]=>{
    const erros:string[]=[];
    if(!nivel.terrenos.some(t=>t.x-t.largura/2<=nivel.spawn.x&&t.x+t.largura/2>=nivel.spawn.x))erros.push('spawn sem piso');
    nivel.gaps.forEach(g=>{if(g.fim-g.inicio>180)erros.push('gap impossível');if(nivel.portas.some(p=>p.x>g.inicio&&p.x<g.fim))erros.push('portão no gap');});
    nivel.plataformas.forEach(p=>{if(p.topo<80||p.topo>nivel.altura-80)erros.push('plataforma fora do mundo');});
    nivel.checkpoints.forEach(p=>{if(!nivel.terrenos.some(t=>p.x>=t.x-t.largura/2+30&&p.x<=t.x+t.largura/2-30))erros.push('checkpoint inseguro');});
    if(nivel.rotas&&nivel.rotas.length!==3)erros.push('fase vertical sem três bifurcações');
    const alturas=[...nivel.terrenos.map(t=>t.topo),...nivel.plataformas.map(p=>p.topo)];if(nivel.altura>=1280&&Math.max(...alturas)-Math.min(...alturas)<900)erros.push('progressão vertical insuficiente');
    nivel.rotas?.forEach(rota=>[rota.segura,rota.agil].forEach(caminho=>{const pontos=[rota.inicio,...caminho,rota.fim];for(let i=1;i<pontos.length;i++)if(pontos[i].x-pontos[i-1].x>330||pontos[i-1].y-pontos[i].y>170)erros.push(`salto impossível: ${rota.id}`);}));
    return erros;
};

export const progressoPorMarcos=(nivel:NivelReino,x:number,y:number,portasAbertas:number):number=>{
    const avancados=nivel.marcos.filter((marco,i)=>i<=portasAbertas||x>=marco.x-120||y<=marco.y+100).length-1;
    return Math.max(0,Math.min(1,avancados/(nivel.marcos.length-1)));
};

export const sobrepoeGap=(nivel:Pick<NivelReino,'gaps'>,centro:number,largura=0):boolean=>nivel.gaps.some(g=>centro+largura/2>g.inicio&&centro-largura/2<g.fim);

export const validarAventurasReino=():string[]=>{
    const erros:string[]=[],ids=new Set<string>();
    AVENTURAS_REINO.forEach((a,fase)=>{if(ids.has(a.id))erros.push(`aventura repetida: ${a.id}`);ids.add(a.id);if(!a.eventos.length)erros.push(`aventura sem objetivo: ${a.id}`);if(a.posicoes.some(({x,y})=>x<120||x>5900||y<0||y>1440))erros.push(`posição inválida: ${a.id}`);if(a.bloqueio!==undefined&&a.posicoes[0].x>=a.bloqueio.x)erros.push(`mecanismo depois do bloqueio: ${a.id}`);if((a.tipo==='alavanca'||a.tipo==='corda')&&fase<3)erros.push(`ponte em fase inválida: ${a.id}`);});
    return erros;
};
