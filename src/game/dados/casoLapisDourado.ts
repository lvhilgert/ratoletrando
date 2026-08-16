export type AmbienteDetetive='sala'|'biblioteca'|'patio'|'refeitorio';
export type IdSuspeito='coelho'|'gato'|'pato'|'sapo';

export interface SuspeitoDetetive {id:IdSuspeito;nome:string;mochila:string;chapeu:boolean;ambiente:AmbienteDetetive;dialogo:string}
export interface PistaDetetive {id:string;titulo:string;texto:string;ambiente:AmbienteDetetive;tipo:'npc'|'objeto';fonte:IdSuspeito|'desenho'|'cenoura'}
export interface CasoDetetive {titulo:string;introducao:string;suspeitos:SuspeitoDetetive[];pistas:PistaDetetive[];culpado:IdSuspeito;solucao:string}

export const CASO_LAPIS_DOURADO:CasoDetetive={
    titulo:'O MISTÉRIO DO LÁPIS DOURADO',
    introducao:'O lápis dourado da turma desapareceu. Vamos descobrir o que aconteceu?',
    suspeitos:[
        {id:'coelho',nome:'COELHO',mochila:'vermelha',chapeu:false,ambiente:'biblioteca',dialogo:'Eu estava desenhando, mas fui chamado para outra atividade.'},
        {id:'gato',nome:'GATO',mochila:'azul',chapeu:true,ambiente:'sala',dialogo:'Vi quem pegou o lápis usando uma mochila vermelha.'},
        {id:'pato',nome:'PATO',mochila:'vermelha',chapeu:true,ambiente:'patio',dialogo:'Quem estava com o lápis não usava chapéu.'},
        {id:'sapo',nome:'SAPO',mochila:'verde',chapeu:false,ambiente:'refeitorio',dialogo:'Eu estava no refeitório o tempo todo. Que mistério curioso!'}
    ],
    pistas:[
        {id:'mochila',titulo:'MOCHILA VERMELHA',texto:'A pessoa usava uma mochila vermelha.',ambiente:'sala',tipo:'npc',fonte:'gato'},
        {id:'desenho',titulo:'PASSOU PELA BIBLIOTECA',texto:'Alguém esteve desenhando aqui.',ambiente:'biblioteca',tipo:'objeto',fonte:'desenho'},
        {id:'chapeu',titulo:'NÃO USAVA CHAPÉU',texto:'A pessoa não usava chapéu.',ambiente:'patio',tipo:'npc',fonte:'pato'},
        {id:'cenoura',titulo:'HAVIA UMA CENOURA PERTO DA MESA',texto:'Uma cenoura estava perto do desenho.',ambiente:'biblioteca',tipo:'objeto',fonte:'cenoura'}
    ],
    culpado:'coelho',
    solucao:'Eu usei o lápis para desenhar na biblioteca e esqueci de devolver. Desculpa!'
};
