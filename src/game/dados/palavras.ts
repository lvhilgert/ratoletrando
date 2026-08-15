// Substantivos concretos do universo infantil (6-8 anos), com a grafia correta em português.
export type ModoPalavras = 'ate4' | 'ate5' | 'aleatorio';

// Palavras com ate 4 letras.
export const PALAVRAS_ATE_4 = [
    'ANEL','ARCO','BALA','BOLA','BOTA','CAMA','CAPA','COLA','COPO','DADO',
    'FACA','FITA','FOTO','LATA','LUPA','MALA','MOLA','PANO','PIPA','POTE',
    'REDE','RODA','SACO','SINO','SOFÁ','TACO','TELA','VASO','VELA','PATO',
    'GATO','RATO','SAPO','LOBO','URSO','FOCA','MICO','TATU','VACA','BODE',
    'LEÃO','ONÇA','ANTA','PERU','GALO','PUMA','LULA','SIRI','ATUM','RAIA',
    'ORCA','ALCE','BOLO','CAFÉ','PERA','KIWI','CAJU','COCO','LIMA','FLOR',
    'ROSA','RAIZ','MATO','LAGO','ILHA','ONDA','NEVE','GELO','FOGO','BOCA',
    'OLHO','UNHA','PELE','OSSO','CASA','MURO','TETO','PISO','SALA','MESA',
    'MAPA','MOTO','TREM','JATO','BIKE','PIÃO','CUBO','AZUL','ROXO','SAIA',
    'MEIA','LUVA','FADA','ANÃO','LOJA','VARA','TAÇA','RABO','BICO','PATA',
    'PENA','OVOS','RAIO','VALE','FIGO','ALHO','NABO','FONE','ROBO','POÇO',
    'TUBO','ÁGUA','ALÇA','ASAS','BOIA','BULE','DEDO','DUNA','ÉGUA','FACE',
    'GIBI','GOLA','IOIÔ','JIPE','KART','LAMA','LODO','MULA','NAVE','REMO',
    'SELO','SOLO','SOPA','SUCO','TÁXI','TUBA','AÇAÍ','BIFE','CUCA','DOCE',
    'NATA','OURO','JADE','JACA','BOTO','PACA','LAÇO','PINO','PLUG','CÃES',
    'PÃES','AVES','BOIS','REIS','BEBÊ','TOCO','TORA','PICO','FENO','ARCA',
    'ANJO','MAGO','OGRO','ELFO','JOGO','MARÉ','LUAR','IRMÃ','AVÓS','LEOA',
    'TIOS','NETO','BOTE','TUTU','BONÉ','PAÍS','MÃES','TIME','JUIZ','PEÇA',
    'LUAS','SÓIS','CÉUS','COLO','AULA','LAVA','DINO','JOIA','GEMA','NOTA',
    'CHÃO','TOPO','GOTA','MAR','GIZ','FIO'
] as const;

// Palavras adicionais de 5 letras (o modo "ate5" usa estas + todas as de "ate4").
const PALAVRAS_NOVAS_ATE_5 = [
    'PORTA','PRAIA','COBRA','ZEBRA','TIGRE','PANDA','NUVEM','CHUVA','AREIA','BALÃO',
    'AVIÃO','BARCO','CIRCO','BRUXA','CORDA','GARFO','PRATO','BOLSA','CHAVE','PENTE',
    'CESTO','BALDE','ARARA','MILHO','RÉGUA','GESSO','FRUTA','MOEDA','COROA','PRATA',
    'FOLHA','GALHO','TREVO','FAROL','MOLHO','TRAVE','JAULA','NAVIO','FESTA','LIVRO',
    'ROUPA','CINTO','AMIGO'
] as const;

export const PALAVRAS_ATE_5: readonly string[] = [...PALAVRAS_ATE_4, ...PALAVRAS_NOVAS_ATE_5];

// Palavras adicionais de 6+ letras (o modo "aleatorio" usa estas + todas as de "ate5").
const PALAVRAS_NOVAS_ALEATORIO = [
    'GALINHA','CACHORRO','COELHO','CAVALO','GIRAFA','MACACO','ELEFANTE','BORBOLETA','JOANINHA','TARTARUGA',
    'PINGUIM','CANGURU','JACARÉ','TUCANO','PIRATA','DRAGÃO','CASTELO','PRINCESA','FANTASMA','GIGANTE',
    'SEREIA','PALHAÇO','CORUJA','ARANHA','FORMIGA','BONECA','BICICLETA','FUTEBOL','CHOCOLATE','SORVETE',
    'PIPOCA','MACARRÃO','QUEIJO','ESCOLA','JANELA','FAMÍLIA'
] as const;

export const PALAVRAS_ALEATORIO: readonly string[] = [...PALAVRAS_ATE_5, ...PALAVRAS_NOVAS_ALEATORIO];

export function obterDicionario(modo: ModoPalavras): readonly string[] {
    if (modo === 'ate4') return PALAVRAS_ATE_4;
    if (modo === 'ate5') return PALAVRAS_ATE_5;
    return PALAVRAS_ALEATORIO;
}
