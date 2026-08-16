import { FaseDetetiveConfig } from '../tiposDetetive';

export const CASO_LAPIS_DOURADO:FaseDetetiveConfig={
    id:'lapis-dourado',numero:1,titulo:'O Mistério do Lápis Dourado',tema:'escola',
    introducao:'O lápis dourado da turma desapareceu. Vamos descobrir o que aconteceu?',
    areas:[
        {id:'sala',nome:'SALA DE AULA',textura:'detetive-escola',frame:0,saidas:{direita:'biblioteca',baixo:'patio'}},
        {id:'biblioteca',nome:'BIBLIOTECA',textura:'detetive-escola',frame:1,saidas:{esquerda:'sala',baixo:'refeitorio'}},
        {id:'patio',nome:'PÁTIO',textura:'detetive-escola',frame:2,saidas:{cima:'sala',direita:'refeitorio'}},
        {id:'refeitorio',nome:'REFEITÓRIO',textura:'detetive-escola',frame:3,saidas:{cima:'biblioteca',esquerda:'patio'}}
    ],
    areaInicial:'sala',posicaoInicial:[480,500],
    personagens:[
        {id:'gato',nome:'GATO',area:'sala',posicao:[760,250],frame:1,dialogo:['Vi quem pegou o lápis usando uma mochila vermelha.'],pistaId:'mochila'},
        {id:'coelho',nome:'COELHO',area:'biblioteca',posicao:[735,470],frame:0,dialogo:['Eu estava desenhando, mas fui chamado para outra atividade.']},
        {id:'pato',nome:'PATO',area:'patio',posicao:[265,250],frame:2,dialogo:['Quem estava com o lápis não usava chapéu.'],pistaId:'chapeu'},
        {id:'sapo',nome:'SAPO',area:'refeitorio',posicao:[720,420],frame:3,dialogo:['Eu estava no refeitório o tempo todo. Que mistério curioso!']}
    ],
    pistas:[
        {id:'mochila',titulo:'MOCHILA VERMELHA',texto:'A pessoa usava uma mochila vermelha.',area:'sala',posicao:[0,0]},
        {id:'desenho',titulo:'PASSOU PELA BIBLIOTECA',texto:'Alguém esteve desenhando aqui.',area:'biblioteca',posicao:[330,430],frame:2},
        {id:'chapeu',titulo:'NÃO USAVA CHAPÉU',texto:'A pessoa não usava chapéu.',area:'patio',posicao:[0,0]},
        {id:'cenoura',titulo:'HAVIA UMA CENOURA PERTO DA MESA',texto:'Uma cenoura estava perto do desenho.',area:'biblioteca',posicao:[610,245],frame:1}
    ],
    objetos:[],itens:[],
    objetivos:[{id:'coletar',descricao:'Converse com todos e investigue a biblioteca para reunir pistas.'}],
    perguntaFinal:'QUEM FICOU COM O LÁPIS?',tipoResposta:'personagem',
    opcoesResposta:[{id:'coelho',rotulo:'COELHO',frame:0},{id:'gato',rotulo:'GATO',frame:1},{id:'pato',rotulo:'PATO',frame:2},{id:'sapo',rotulo:'SAPO',frame:3}],
    respostaCorreta:'coelho',
    solucao:'Eu usei o lápis para desenhar na biblioteca e esqueci de devolver. Desculpa!',
    minPistasParaResolver:3,
    dicas:['Fale com todos os personagens da escola.','Repare bem na biblioteca — pode haver algo pra investigar além das pessoas.']
};
