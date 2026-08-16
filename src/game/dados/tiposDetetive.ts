export type TemaDetetive='escola'|'parquinho'|'floresta'|'praia'|'rpg'|'fadas'|'mansao';
export type IdItemDetetive='lanterna'|'ventilador'|'bumerangue'|'corda'|'ima';
export type DirecaoSaida='esquerda'|'direita'|'cima'|'baixo';
export type TipoRespostaCaso='personagem'|'evento'|'local'|'objeto'|'causa';

export interface AreaDetetiveConfig {
    id:string;
    nome:string;
    /** Chave da textura carregada (imagem única ou spritesheet). */
    textura:string;
    /** Frame dentro da textura, quando for spritesheet. */
    frame?:number;
    saidas:Partial<Record<DirecaoSaida,string>>;
    /** Decoração adicional desenhada por cima da imagem base (opcional, procedural). */
    decoracao?:(cena:Phaser.Scene, container:Phaser.GameObjects.Container)=>void;
}

export interface PersonagemConfig {
    id:string;
    nome:string;
    area:string;
    posicao:[number,number];
    /** Frame no spritesheet de personagens do tema, ou desenho procedural se ausente. */
    frame?:number;
    cor?:number;
    dialogo:string[];
    /** Pista revelada ao conversar pela primeira vez. */
    pistaId?:string;
}

export interface PistaConfig {
    id:string;
    titulo:string;
    texto:string;
    area:string;
    posicao:[number,number];
    frame?:number;
    cor?:number;
    opcional?:boolean;
    /** Só aparece/pode ser investigada se esta flag estiver ativa. */
    requerFlag?:string;
}

export interface InteracaoObjeto {
    itemNecessario?:IdItemDetetive;
    resultadoEstado:string;
    ativarFlag?:string;
    efeito?:'vento'|'luz'|'som'|'queda';
    mensagem?:string;
}

export interface ObjetoInterativoConfig {
    id:string;
    area:string;
    posicao:[number,number];
    estadoInicial:string;
    /** Cor/forma por estado (procedural) — chave = nome do estado. */
    aparenciaPorEstado:Record<string,{cor:number;forma:'retangulo'|'circulo'|'triangulo'}>;
    interacoes:InteracaoObjeto[];
    /** Texto mostrado ao interagir sem o item certo. */
    dicaSemItem?:string;
}

export interface ItemColetavelConfig {
    id:IdItemDetetive;
    nome:string;
    area:string;
    posicao:[number,number];
    /** Só aparece se esta flag estiver ativa (ex.: revelado por outro evento). */
    requerFlag?:string;
}

export interface ObjetivoConfig {
    id:string;
    descricao:string;
}

export interface FaseDetetiveConfig {
    id:string;
    numero:number;
    titulo:string;
    tema:TemaDetetive;
    introducao:string;
    areas:AreaDetetiveConfig[];
    areaInicial:string;
    posicaoInicial:[number,number];
    personagens:PersonagemConfig[];
    pistas:PistaConfig[];
    objetos:ObjetoInterativoConfig[];
    itens:ItemColetavelConfig[];
    objetivos:ObjetivoConfig[];
    perguntaFinal:string;
    tipoResposta:TipoRespostaCaso;
    /** Opções mostradas na tela de dedução (nome + id). Para casos "quem fez", use os personagens. */
    opcoesResposta:{id:string;rotulo:string;frame?:number}[];
    respostaCorreta:string;
    solucao:string;
    minPistasParaResolver:number;
    dicas:string[];
}
