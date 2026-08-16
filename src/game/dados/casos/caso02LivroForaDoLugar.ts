import { FaseDetetiveConfig } from '../tiposDetetive';

const decorarSalaLeitura=(cena:Phaser.Scene,c:Phaser.GameObjects.Container):void => {
    c.add(cena.add.rectangle(480,320,960,640,0xf3e0bd).setDepth(0));
    c.add(cena.add.rectangle(480,110,960,120,0xead9b8).setDepth(0));
    c.add(cena.add.ellipse(480,430,560,260,0xd9a86b).setDepth(1));
    const almofada=(x:number,y:number,cor:number)=>{c.add(cena.add.ellipse(x,y,120,80,cor).setStrokeStyle(4,0x00000022).setDepth(2));};
    almofada(330,420,0xe8735f);almofada(620,460,0x5f9ee8);almofada(470,500,0xe8c95f);
    const estante=cena.add.graphics().setDepth(2);estante.fillStyle(0x8a5a34,1).fillRect(760,150,150,320);for(let i=0;i<4;i++){estante.fillStyle(0x6b4023,1).fillRect(770,180+i*72,130,10);}
    for(let i=0;i<10;i++){estante.fillStyle([0xd85c5c,0x5c9dd8,0xe8c25c,0x6bbf6b,0x9a6bd8][i%5],1).fillRect(775+i*13,150+Math.floor(i/5)*72+15,10,50);}
    c.add(estante);
    c.add(cena.add.text(480,60,'Cantinho macio para ler histórias',{fontFamily:'Arial Rounded MT Bold, Arial',fontSize:'15px',color:'#6b4f30'}).setOrigin(.5).setDepth(2));
};

export const CASO_LIVRO_FORA_DO_LUGAR:FaseDetetiveConfig={
    id:'livro-fora-do-lugar',numero:2,titulo:'O Livro Fora do Lugar',tema:'escola',
    introducao:'Um livro de histórias sumiu da biblioteca! Vamos conversar com todo mundo e investigar direitinho.',
    areas:[
        {id:'sala',nome:'SALA DE AULA',textura:'detetive-escola',frame:0,saidas:{direita:'biblioteca'}},
        {id:'biblioteca',nome:'BIBLIOTECA',textura:'detetive-escola',frame:1,saidas:{esquerda:'sala',direita:'sala-leitura'}},
        {id:'sala-leitura',nome:'SALA DE LEITURA',textura:'procedural',saidas:{esquerda:'biblioteca'},decoracao:decorarSalaLeitura}
    ],
    areaInicial:'sala',posicaoInicial:[480,500],
    personagens:[
        {id:'coelho',nome:'COELHO',area:'sala',posicao:[300,300],frame:0,dialogo:['Um livro sumiu? Que estranho! Eu nem entrei na biblioteca hoje.']},
        {id:'gato',nome:'GATO',area:'biblioteca',posicao:[330,250],frame:1,dialogo:['Vi o livro por perto da sala de leitura outro dia.'],pistaId:'livro-visto'},
        {id:'pato',nome:'PATO',area:'biblioteca',posicao:[700,470],frame:2,dialogo:['Adoro histórias de piratas! Já lá em casa tenho três livros sobre isso.'],pistaId:'pato-piratas'},
        {id:'sapo',nome:'SAPO',area:'sala-leitura',posicao:[300,300],frame:3,dialogo:['Vi alguém bem entretido lendo aqui, todo animado com uma história de piratas.'],pistaId:'quem-lia'}
    ],
    pistas:[
        {id:'livro-visto',titulo:'VISTO PERTO DA LEITURA',texto:'O livro foi visto perto da sala de leitura.',area:'biblioteca',posicao:[0,0]},
        {id:'pato-piratas',titulo:'PATO GOSTA DE PIRATAS',texto:'O Pato conta que adora histórias de piratas.',area:'biblioteca',posicao:[0,0]},
        {id:'quem-lia',titulo:'ALGUÉM LIA SOBRE PIRATAS',texto:'Quem estava lendo na sala de leitura gostava de histórias de piratas.',area:'sala-leitura',posicao:[0,0]},
        {id:'pena-amarela',titulo:'PENA AMARELA NA ESTANTE',texto:'Uma pena amarela foi encontrada bem perto da estante errada.',area:'biblioteca',posicao:[860,420],cor:0xf0d955}
    ],
    objetos:[],itens:[],
    objetivos:[{id:'coletar',descricao:'Converse com todos e investigue a biblioteca e a sala de leitura.'}],
    perguntaFinal:'QUEM LEVOU O LIVRO PARA A SALA DE LEITURA?',tipoResposta:'personagem',
    opcoesResposta:[{id:'coelho',rotulo:'COELHO',frame:0},{id:'gato',rotulo:'GATO',frame:1},{id:'pato',rotulo:'PATO',frame:2},{id:'sapo',rotulo:'SAPO',frame:3}],
    respostaCorreta:'pato',
    solucao:'Eu levei o livro pra sala de leitura pra terminar a história de piratas, e depois guardei na estante errada sem perceber. Desculpa a confusão!',
    minPistasParaResolver:4,
    dicas:['Converse com quem estava por perto da biblioteca e da sala de leitura.','Preste atenção em quem gosta de histórias de piratas — junte as pistas que você já ouviu.']
};
