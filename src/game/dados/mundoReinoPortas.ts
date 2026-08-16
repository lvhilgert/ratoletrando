export type TemaReino='bosque'|'vila'|'caverna'|'montanha'|'pantano'|'biblioteca'|'castelo';
export type TipoInimigo='slime'|'saltador'|'guardiao'|'veloz'|'gelo'|'morcego'|'goblin'|'arqueiro'|'planta';

export interface RegiaoReino {id:TemaReino;nome:string;inicio:number;fim:number;cor:number;corDestaque:number}
export interface EquipamentoReino {id:string;nome:string;tipo:'arma'|'roupa'|'companheiro';descricao:string;preco:number}

export const REGIOES_REINO:RegiaoReino[]=[
    {id:'bosque',nome:'Bosque dos Números',inicio:0,fim:3200,cor:0x6e9b52,corDestaque:0xb6df72},
    {id:'vila',nome:'Vila das Palavras',inicio:3200,fim:7000,cor:0xb88758,corDestaque:0xf0c477},
    {id:'caverna',nome:'Caverna dos Ecos',inicio:7000,fim:11000,cor:0x447f91,corDestaque:0x65d9df},
    {id:'montanha',nome:'Montanha das Formas',inicio:11000,fim:15200,cor:0x7189a8,corDestaque:0xc8e4f4},
    {id:'pantano',nome:'Pântano das Poções',inicio:15200,fim:19400,cor:0x658752,corDestaque:0xb4cf6c},
    {id:'biblioteca',nome:'Biblioteca Encantada',inicio:19400,fim:23800,cor:0x765b96,corDestaque:0xd2adf0},
    {id:'castelo',nome:'Castelo do Rei Confuso',inicio:23800,fim:28000,cor:0xb98a45,corDestaque:0xffdc75}
];

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

export const POSICOES_INIMIGOS:Array<{x:number;tipo:TipoInimigo}>=[
    {x:900,tipo:'goblin'},{x:1800,tipo:'morcego'},{x:2700,tipo:'goblin'},{x:3100,tipo:'morcego'},
    {x:3650,tipo:'goblin'},{x:4550,tipo:'morcego'},{x:5550,tipo:'goblin'},{x:6200,tipo:'morcego'},
    {x:7450,tipo:'arqueiro'},{x:8400,tipo:'planta'},{x:9400,tipo:'veloz'},{x:10400,tipo:'gelo'},
    {x:11400,tipo:'planta'},{x:12450,tipo:'arqueiro'},{x:13500,tipo:'veloz'},{x:14600,tipo:'gelo'},
    {x:15600,tipo:'veloz'},{x:16650,tipo:'gelo'},{x:17700,tipo:'guardiao'},{x:18800,tipo:'veloz'},
    {x:19800,tipo:'guardiao'},{x:20900,tipo:'veloz'},{x:22000,tipo:'gelo'},{x:23200,tipo:'guardiao'},
    {x:24300,tipo:'veloz'},{x:25350,tipo:'gelo'},{x:26400,tipo:'guardiao'},{x:27400,tipo:'gelo'}
];

export const MISSOES_REINO=[
    {id:'moedas-5',texto:'Encontre 5 moedas',alvo:5},
    {id:'portas-3',texto:'Abra as 3 portas',alvo:3},
    {id:'explorador',texto:'Chegue ao castelo',alvo:1}
];
