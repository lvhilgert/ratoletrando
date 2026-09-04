export type TipoTrechoReino='intro'|'colina'|'gap'|'rota-alta'|'escada'|'ponte-quebrada'|'movel'|'descanso'|'portao'|'final';
export interface TerrenoReino {x:number;largura:number;topo:number}
export interface PlataformaReino {x:number;topo:number;largura:number;movel?:'x'|'y';especial?:'quebravel'|'impulso'}
export interface NivelReino {seed:number;trechos:TipoTrechoReino[];terrenos:TerrenoReino[];plataformas:PlataformaReino[];moedas:{x:number;y:number}[];gaps:{inicio:number;fim:number}[];checkpoints:number[]}
export interface PerfilBiomaReino {chao:number;topo:number;detalhe:number;plataforma:number;atmosfera:'folhas'|'vida'|'cristais'|'vento'|'nevoa'|'magia'|'tochas'|'brasas'}
export type TipoAventuraReino='chave'|'placa'|'cristais'|'alavanca'|'resgate'|'paginas'|'corda'|'guardiao';
export interface AventuraReino {id:string;tipo:TipoAventuraReino;nome:string;instrucao:string;icone:string;eventos:string[];posicoes:number[];bloqueio?:number}
export const AVENTURAS_REINO:AventuraReino[]=[
    {id:'chave-clareira',tipo:'chave',nome:'CHAVE DA CLAREIRA',instrucao:'Suba, encontre a chave e abra o portão.',icone:'🔑',eventos:['portao-ambiental'],posicoes:[2250],bloqueio:3000},
    {id:'engrenagem-praca',tipo:'placa',nome:'ENGRENAGEM DA PRAÇA',instrucao:'Empurre a caixa até a placa.',icone:'▣',eventos:['placa-ativada'],posicoes:[2700,2860],bloqueio:3000},
    {id:'cristais-ecos',tipo:'cristais',nome:'CRISTAIS DOS ECOS',instrucao:'Ative os três cristais luminosos.',icone:'◆',eventos:['cristal-1','cristal-2','cristal-3'],posicoes:[2100,2250,2400]},
    {id:'ponte-ventos',tipo:'alavanca',nome:'PONTE DOS VENTOS',instrucao:'Ataque a alavanca para baixar a ponte.',icone:'⚙',eventos:['ponte-ativada'],posicoes:[3450]},
    {id:'amigo-perdido',tipo:'resgate',nome:'AMIGO PERDIDO',instrucao:'Encontre e liberte a criatura.',icone:'♡',eventos:['amigo-liberto'],posicoes:[4250]},
    {id:'paginas-magicas',tipo:'paginas',nome:'PÁGINAS MÁGICAS',instrucao:'Encontre as três páginas luminosas.',icone:'▤',eventos:['pagina-1','pagina-2','pagina-3'],posicoes:[2100,2700,4250]},
    {id:'travessia-muralha',tipo:'corda',nome:'TRAVESSIA DA MURALHA',instrucao:'Corte a corda para liberar a ponte.',icone:'✂',eventos:['corda-cortada'],posicoes:[3450]},
    {id:'guardiao-fornalha',tipo:'guardiao',nome:'GUARDIÃO DA FORNALHA',instrucao:'Derrote o guardião diante do portal.',icone:'♜',eventos:['guardiao-derrotado'],posicoes:[5520]},
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
};

const TAMANHO=500,BASE=550;
const sequencias:TipoTrechoReino[][]=[
    ['intro','colina','gap','portao','rota-alta','descanso','portao','movel','escada','ponte-quebrada','portao','final'],
    ['intro','escada','gap','portao','colina','rota-alta','portao','ponte-quebrada','descanso','movel','portao','final'],
    ['intro','colina','ponte-quebrada','portao','rota-alta','escada','portao','gap','descanso','movel','portao','final'],
];

const rng=(seed:number)=>()=>{seed|=0;seed=seed+0x6d2b79f5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};

/** Gramática curta e determinística; portões sempre ficam em trechos planos. */
export const gerarNivelReino=(fase:number,seed:number):NivelReino=>{
    const sorteio=rng(seed+fase*997),trechos=[...sequencias[Math.floor(sorteio()*sequencias.length)]],terrenos:TerrenoReino[]=[],plataformas:PlataformaReino[]=[],moedas:{x:number;y:number}[]=[],gaps:{inicio:number;fim:number}[]=[],checkpoints=[2700,4350];
    const moeda=(x:number,y:number)=>moedas.push({x,y});
    trechos.forEach((tipo,i)=>{
        const inicio=i*TAMANHO,meio=inicio+250,dificuldade=Math.min(fase,7),gap=92+dificuldade*8;
        if(tipo==='colina'){
            terrenos.push({x:inicio+85,largura:170,topo:BASE},{x:inicio+250,largura:160,topo:BASE-34},{x:inicio+415,largura:170,topo:BASE-68});
            [inicio+100,inicio+250,inicio+410].forEach((x,j)=>moeda(x,BASE-70-j*34));
        }else if(tipo==='gap'||tipo==='ponte-quebrada'||tipo==='movel'){
            const largura=tipo==='ponte-quebrada'?Math.min(176,gap+38):gap,inicioGap=meio-largura/2;
            terrenos.push({x:(inicio+inicioGap)/2,largura:inicioGap-inicio,topo:BASE},{x:(inicioGap+largura+inicio+TAMANHO)/2,largura:inicio+TAMANHO-(inicioGap+largura),topo:BASE});gaps.push({inicio:inicioGap,fim:inicioGap+largura});
            if(tipo==='movel')plataformas.push({x:meio,topo:BASE-72,largura:Math.max(110,largura-18),movel:i%2?'y':'x'});
            if(tipo==='ponte-quebrada')plataformas.push({x:meio-48,topo:BASE-48,largura:64},{x:meio+48,topo:BASE-48,largura:64});
            [-1,0,1].forEach((n)=>moeda(meio+n*55,BASE-95-Math.abs(n)*20));
        }else {
            terrenos.push({x:meio,largura:TAMANHO,topo:tipo==='descanso'?BASE-18:BASE});
            if(tipo==='rota-alta'){
                [-155,0,155].forEach((dx,j)=>{const topo=BASE-95-(j===1?48:0);plataformas.push({x:meio+dx,topo,largura:145,especial:fase>=2&&j===1?'quebravel':undefined});moeda(meio+dx,topo-48);});
            }else if(tipo==='escada')[-150,-35,85,190].forEach((dx,j)=>{const topo=BASE-55-j*35;plataformas.push({x:meio+dx,topo,largura:105,especial:(fase===0||fase===4)&&j===0?'impulso':undefined});moeda(meio+dx,topo-45);});
            else if(tipo!=='portao')moeda(meio,BASE-58);
        }
    });
    terrenos.push({x:6100,largura:200,topo:BASE});
    return {seed,trechos,terrenos,plataformas,moedas,gaps,checkpoints};
};

export const validarNivelReino=(nivel:NivelReino):string[]=>{
    const erros:string[]=[];
    if(!nivel.terrenos.some(t=>t.x-t.largura/2<=120&&t.x+t.largura/2>=120))erros.push('spawn sem piso');
    nivel.gaps.forEach(g=>{if(g.fim-g.inicio>180)erros.push('gap impossível');if([1600,3300,5000].some(x=>x>g.inicio&&x<g.fim))erros.push('portão no gap');});
    nivel.plataformas.forEach(p=>{if(p.topo<300||p.topo>530)erros.push('plataforma fora do alcance');});
    nivel.checkpoints.forEach(x=>{if(!nivel.terrenos.some(t=>x>=t.x-t.largura/2+45&&x<=t.x+t.largura/2-45))erros.push('checkpoint inseguro');});
    return erros;
};

export const sobrepoeGap=(nivel:NivelReino,centro:number,largura=0):boolean=>nivel.gaps.some(g=>centro+largura/2>g.inicio&&centro-largura/2<g.fim);

export const validarAventurasReino=():string[]=>{
    const erros:string[]=[],ids=new Set<string>();
    AVENTURAS_REINO.forEach((a,fase)=>{if(ids.has(a.id))erros.push(`aventura repetida: ${a.id}`);ids.add(a.id);if(!a.eventos.length)erros.push(`aventura sem objetivo: ${a.id}`);if(a.posicoes.some(x=>x<120||x>5900))erros.push(`posição inválida: ${a.id}`);if(a.bloqueio!==undefined&&a.posicoes[0]>=a.bloqueio)erros.push(`mecanismo depois do bloqueio: ${a.id}`);if((a.tipo==='alavanca'||a.tipo==='corda')&&fase<3)erros.push(`ponte em fase inválida: ${a.id}`);});
    return erros;
};
