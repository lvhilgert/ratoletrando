export type CategoriaPalavra='animais'|'escola'|'alimentos'|'objetos'|'natureza'|'casa'|'brinquedos'|'transporte'|'corpo'|'cotidiano';

export interface PalavraReino {
    palavra:string;
    silabas:readonly string[];
    quantidadeSilabas:number;
    letraInicial:string;
    letraFinal:string;
    categoria:CategoriaPalavra;
    asset?:string;
}

const entrada=(palavra:string,silabas:string[],categoria:CategoriaPalavra,asset?:string):PalavraReino=>({palavra,silabas,quantidadeSilabas:silabas.length,letraInicial:Array.from(palavra)[0],letraFinal:Array.from(palavra).slice(-1)[0],categoria,asset});

export const CATALOGO_PALAVRAS_REINO:readonly PalavraReino[]=[
    entrada('GATO',['GA','TO'],'animais'),entrada('CAVALO',['CA','VA','LO'],'animais'),entrada('SAPO',['SA','PO'],'animais'),entrada('PATO',['PA','TO'],'animais'),entrada('COELHO',['CO','E','LHO'],'animais'),entrada('CACHORRO',['CA','CHOR','RO'],'animais'),entrada('MACACO',['MA','CA','CO'],'animais'),entrada('GIRAFA',['GI','RA','FA'],'animais'),entrada('ELEFANTE',['E','LE','FAN','TE'],'animais'),entrada('TARTARUGA',['TAR','TA','RU','GA'],'animais'),entrada('BORBOLETA',['BOR','BO','LE','TA'],'animais'),entrada('JOANINHA',['JO','A','NI','NHA'],'animais'),entrada('FORMIGA',['FOR','MI','GA'],'animais'),entrada('CORUJA',['CO','RU','JA'],'animais'),entrada('ZEBRA',['ZE','BRA'],'animais'),entrada('TIGRE',['TI','GRE'],'animais'),
    entrada('ESCOLA',['ES','CO','LA'],'escola'),entrada('LÁPIS',['LÁ','PIS'],'escola'),entrada('LIVRO',['LI','VRO'],'escola'),entrada('CADERNO',['CA','DER','NO'],'escola'),entrada('MOCHILA',['MO','CHI','LA'],'escola'),entrada('BORRACHA',['BOR','RA','CHA'],'escola'),entrada('TESOURA',['TE','SOU','RA'],'escola'),entrada('COLA',['CO','LA'],'escola'),entrada('RÉGUA',['RÉ','GUA'],'escola'),entrada('QUADRO',['QUA','DRO'],'escola'),
    entrada('BANANA',['BA','NA','NA'],'alimentos'),entrada('MAÇÃ',['MA','ÇÃ'],'alimentos'),entrada('ABACAXI',['A','BA','CA','XI'],'alimentos'),entrada('MELANCIA',['ME','LAN','CI','A'],'alimentos'),entrada('SORVETE',['SOR','VE','TE'],'alimentos'),entrada('PIPOCA',['PI','PO','CA'],'alimentos'),entrada('QUEIJO',['QUEI','JO'],'alimentos'),entrada('BOLO',['BO','LO'],'alimentos'),entrada('TOMATE',['TO','MA','TE'],'alimentos'),entrada('CENOURA',['CE','NOU','RA'],'alimentos'),
    entrada('BOLA',['BO','LA'],'objetos'),entrada('CHAVE',['CHA','VE'],'objetos'),entrada('MESA',['ME','SA'],'objetos'),entrada('CADEIRA',['CA','DEI','RA'],'objetos'),entrada('JANELA',['JA','NE','LA'],'objetos'),entrada('TELEFONE',['TE','LE','FO','NE'],'objetos'),entrada('PANELA',['PA','NE','LA'],'objetos'),entrada('COPO',['CO','PO'],'objetos'),entrada('GARFO',['GAR','FO'],'objetos'),entrada('PRATO',['PRA','TO'],'objetos'),
    entrada('ÁRVORE',['ÁR','VO','RE'],'natureza'),entrada('FLOR',['FLOR'],'natureza'),entrada('NUVEM',['NU','VEM'],'natureza'),entrada('CHUVA',['CHU','VA'],'natureza'),entrada('MONTANHA',['MON','TA','NHA'],'natureza'),entrada('RIO',['RI','O'],'natureza'),entrada('PRAIA',['PRAI','A'],'natureza'),entrada('FLORESTA',['FLO','RES','TA'],'natureza'),entrada('ESTRELA',['ES','TRE','LA'],'natureza'),entrada('LUA',['LU','A'],'natureza'),
    entrada('CASA',['CA','SA'],'casa'),entrada('PORTA',['POR','TA'],'casa'),entrada('TELHADO',['TE','LHA','DO'],'casa'),entrada('QUARTO',['QUAR','TO'],'casa'),entrada('COZINHA',['CO','ZI','NHA'],'casa'),entrada('BANHEIRO',['BA','NHEI','RO'],'casa'),entrada('TAPETE',['TA','PE','TE'],'casa'),entrada('ALMOFADA',['AL','MO','FA','DA'],'casa'),
    entrada('BONECA',['BO','NE','CA'],'brinquedos'),entrada('CARRINHO',['CAR','RI','NHO'],'brinquedos'),entrada('PIÃO',['PI','ÃO'],'brinquedos'),entrada('PETECA',['PE','TE','CA'],'brinquedos'),entrada('PIPA',['PI','PA'],'brinquedos'),entrada('ROBÔ',['RO','BÔ'],'brinquedos'),
    entrada('CARRO',['CAR','RO'],'transporte'),entrada('ÔNIBUS',['Ô','NI','BUS'],'transporte'),entrada('AVIÃO',['A','VI','ÃO'],'transporte'),entrada('BICICLETA',['BI','CI','CLE','TA'],'transporte'),entrada('TREM',['TREM'],'transporte'),entrada('BARCO',['BAR','CO'],'transporte'),
    entrada('BOCA',['BO','CA'],'corpo'),entrada('OLHO',['O','LHO'],'corpo'),entrada('NARIZ',['NA','RIZ'],'corpo'),entrada('CABEÇA',['CA','BE','ÇA'],'corpo'),entrada('BRAÇO',['BRA','ÇO'],'corpo'),entrada('PERNA',['PER','NA'],'corpo'),
    entrada('AMIGO',['A','MI','GO'],'cotidiano'),entrada('FAMÍLIA',['FA','MÍ','LI','A'],'cotidiano'),entrada('MENINO',['ME','NI','NO'],'cotidiano'),entrada('MENINA',['ME','NI','NA'],'cotidiano'),entrada('PARQUE',['PAR','QUE'],'cotidiano'),entrada('SAPATO',['SA','PA','TO'],'cotidiano'),entrada('CAMISA',['CA','MI','SA'],'cotidiano'),entrada('ESCOVA',['ES','CO','VA'],'cotidiano')
];
