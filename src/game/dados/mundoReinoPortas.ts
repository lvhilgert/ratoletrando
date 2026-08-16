export type TemaReino='bosque'|'vila'|'caverna'|'montanha'|'pantano'|'biblioteca'|'castelo';
export type TipoInimigo='slime'|'morcego'|'cogumelo'|'furacao'|'arqueiro'|'espantalho'|'goblin'|'planta';

export interface RegiaoReino {id:TemaReino;nome:string;cor:number;corDestaque:number}
export interface EquipamentoReino {id:string;nome:string;tipo:'arma'|'roupa'|'companheiro';descricao:string;preco:number}
export interface PosicaoInimigoReino {x:number;y:number;tipo:TipoInimigo}

export const REGIOES_REINO:RegiaoReino[]=[
    {id:'bosque',nome:'Bosque dos Números',cor:0x6e9b52,corDestaque:0xb6df72},
    {id:'vila',nome:'Vila das Palavras',cor:0xb88758,corDestaque:0xf0c477},
    {id:'caverna',nome:'Caverna dos Ecos',cor:0x447f91,corDestaque:0x65d9df},
    {id:'montanha',nome:'Montanha das Formas',cor:0x7189a8,corDestaque:0xc8e4f4},
    {id:'pantano',nome:'Pântano das Poções',cor:0x658752,corDestaque:0xb4cf6c},
    {id:'biblioteca',nome:'Biblioteca Encantada',cor:0x765b96,corDestaque:0xd2adf0},
    {id:'castelo',nome:'Castelo do Rei Confuso',cor:0xb98a45,corDestaque:0xffdc75}
];

const pontos=(tipos:TipoInimigo[],xs:number[]):PosicaoInimigoReino[]=>xs.map((x,i)=>({x,y:tipos[i]==='morcego'?330:tipos[i]==='furacao'?420:500,tipo:tipos[i]}));
export const INIMIGOS_POR_REGIAO:Record<TemaReino,PosicaoInimigoReino[]>={
    bosque:pontos(['slime','cogumelo','goblin','slime','cogumelo','morcego','goblin','furacao','slime','cogumelo'],[520,980,1340,1940,2380,2860,3540,3980,4620,5480]),
    vila:pontos(['goblin','slime','espantalho','cogumelo','goblin','arqueiro','slime','espantalho','goblin','cogumelo'],[500,920,1300,2080,2480,2920,3700,4100,4500,5480]),
    caverna:pontos(['morcego','planta','slime','morcego','planta','cogumelo','morcego','furacao','planta','morcego','goblin'],[500,920,1320,2040,2440,2860,3700,4140,4540,5380,5660]),
    montanha:pontos(['furacao','goblin','morcego','espantalho','furacao','arqueiro','slime','morcego','goblin','furacao','espantalho','arqueiro'],[500,900,1300,2020,2420,2860,3700,4060,4420,4700,5380,5660]),
    pantano:pontos(['planta','slime','morcego','planta','cogumelo','furacao','planta','morcego','goblin','slime','planta','morcego','cogumelo'],[500,880,1260,1980,2340,2700,2980,3700,4020,4340,4620,5380,5660]),
    biblioteca:pontos(['goblin','morcego','arqueiro','planta','espantalho','furacao','morcego','goblin','arqueiro','planta','espantalho','cogumelo','morcego','goblin'],[500,820,1260,1980,2260,2540,2860,3700,3980,4260,4540,4740,5380,5660]),
    castelo:pontos(['goblin','arqueiro','espantalho','morcego','planta','furacao','goblin','arqueiro','cogumelo','espantalho','morcego','planta','furacao','goblin','arqueiro','espantalho'],[480,780,1080,1360,1940,2220,2500,2780,3020,3660,3940,4220,4500,4740,5380,5660])
};

export const EQUIPAMENTOS_REINO:EquipamentoReino[]=[
    {id:'espada',nome:'Espada do Aprendiz',tipo:'arma',descricao:'Golpe equilibrado',preco:0},
    {id:'espada-rapida',nome:'Espada Veloz',tipo:'arma',descricao:'Combo mais rápido',preco:25},
    {id:'martelo',nome:'Martelo Real',tipo:'arma',descricao:'Quebra armaduras',preco:45},
    {id:'lanca',nome:'Lança Longa',tipo:'arma',descricao:'Maior alcance',preco:55},
    {id:'arco',nome:'Arco do Bosque',tipo:'arma',descricao:'Acerta alvos distantes',preco:70},
    {id:'armadura-verde',nome:'Armadura do Bosque',tipo:'roupa',descricao:'Visual verde',preco:20},
    {id:'armadura-azul',nome:'Armadura dos Ecos',tipo:'roupa',descricao:'Visual azul',preco:35},
    {id:'capa-mago',nome:'Capa das Palavras',tipo:'roupa',descricao:'Visual mágico',preco:50},
    {id:'coruja',nome:'Coruja Sábia',tipo:'companheiro',descricao:'Oferece dicas',preco:40},
    {id:'raposa',nome:'Raposa Curiosa',tipo:'companheiro',descricao:'Indica segredos',preco:60},
    {id:'tartaruga',nome:'Tartaruga Guardiã',tipo:'companheiro',descricao:'Escudo adicional',preco:75},
    {id:'dragao',nome:'Dragão de Luz',tipo:'companheiro',descricao:'Ilumina caminhos',preco:100}
];

export const MISSOES_REINO=[
    {id:'moedas-5',texto:'Encontre 5 moedas',alvo:5},
    {id:'portas-3',texto:'Abra as 3 portas',alvo:3},
    {id:'explorador',texto:'Chegue ao castelo',alvo:1}
];
