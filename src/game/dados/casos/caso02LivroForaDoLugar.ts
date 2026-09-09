import { FaseDetetiveConfig } from '../tiposDetetive';

export const CASO_LIVRO_FORA_DO_LUGAR:FaseDetetiveConfig={
    id:'livro-fora-do-lugar',numero:2,titulo:'O Livro Fora do Lugar',tema:'escola',
    introducao:'Um livro de histórias sumiu da biblioteca! Vamos conversar com todo mundo e investigar direitinho.',
    areas:[
        {id:'sala',nome:'SALA DE AULA',textura:'detetive-escola',frame:0,saidas:{direita:'biblioteca'}},
        {id:'biblioteca',nome:'BIBLIOTECA',textura:'detetive-escola',frame:1,saidas:{esquerda:'sala',direita:'sala-leitura'}},
        {id:'sala-leitura',nome:'SALA DE LEITURA',textura:'detetive-fundo-sala-leitura',saidas:{esquerda:'biblioteca'}}
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
