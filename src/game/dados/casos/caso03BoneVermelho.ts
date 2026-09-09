import { FaseDetetiveConfig } from '../tiposDetetive';

export const CASO_BONE_VERMELHO:FaseDetetiveConfig={
    id:'bone-vermelho',numero:3,titulo:'O Mistério do Boné Vermelho',tema:'parquinho',
    introducao:'O boné vermelho de um amiguinho sumiu no parquinho! Dessa vez ninguém parece ter culpa... será o que aconteceu?',
    areas:[
        {id:'gramado',nome:'GRAMADO',textura:'detetive-fundo-gramado',saidas:{cima:'escorregador',esquerda:'balancos',direita:'caixa-areia'}},
        {id:'escorregador',nome:'ESCORREGADOR',textura:'detetive-fundo-escorregador',saidas:{baixo:'gramado'}},
        {id:'balancos',nome:'BALANÇOS',textura:'detetive-fundo-balancos',saidas:{direita:'gramado'}},
        {id:'caixa-areia',nome:'CAIXA DE AREIA',textura:'detetive-fundo-caixa-areia',saidas:{esquerda:'gramado'}}
    ],
    areaInicial:'gramado',posicaoInicial:[480,500],
    personagens:[
        {id:'coelho',nome:'COELHO',area:'balancos',posicao:[470,470],frame:0,dialogo:['Ninguém saiu do parquinho com o boné, eu fiquei de olho o tempo todo!'],pistaId:'ninguem-saiu'},
        {id:'gato',nome:'GATO',area:'caixa-areia',posicao:[470,470],frame:1,dialogo:['Vi algo vermelho voando no vento, bem na direção do escorregador!'],pistaId:'viu-vermelho'},
        {id:'pato',nome:'PATO',area:'gramado',posicao:[700,470],frame:2,dialogo:['Que dia de vento forte, hein? Quase perdi meu chapéu também.']},
        {id:'sapo',nome:'SAPO',area:'escorregador',posicao:[720,470],frame:3,dialogo:['Estava escorregando quando o vento ficou bem forte de repente.']}
    ],
    pistas:[
        {id:'ninguem-saiu',titulo:'NINGUÉM SAIU DO PARQUE',texto:'Ninguém saiu do parquinho carregando o boné.',area:'balancos',posicao:[0,0]},
        {id:'viu-vermelho',titulo:'ALGO VERMELHO VOANDO',texto:'Alguém viu algo vermelho voando na direção do escorregador.',area:'caixa-areia',posicao:[0,0]},
        {id:'folhas',titulo:'FOLHAS ESPALHADAS',texto:'Folhas estão espalhadas na direção do escorregador — o vento soprou forte por ali.',area:'escorregador',posicao:[210,460],cor:0x9bd15c},
        {id:'bone-arbusto',titulo:'O BONÉ NO ARBUSTO',texto:'O boné vermelho está preso bem no meio do arbusto atrás do escorregador!',area:'escorregador',posicao:[300,500],cor:0xe8483c}
    ],
    objetos:[],itens:[],
    objetivos:[{id:'coletar',descricao:'Converse com as crianças e investigue bem o parquinho, principalmente perto do escorregador.'}],
    perguntaFinal:'O QUE ACONTECEU COM O BONÉ?',tipoResposta:'causa',
    opcoesResposta:[
        {id:'vento',rotulo:'O vento levou o boné até um arbusto'},
        {id:'escondido',rotulo:'Alguém escondeu o boné de propósito'},
        {id:'sumido',rotulo:'O boné ainda está perdido, ninguém sabe'}
    ],
    respostaCorreta:'vento',
    solucao:'O vento soprou bem forte e levou o boné vermelho até o arbusto atrás do escorregador. Ninguém pegou de propósito — foi o vento mesmo!',
    minPistasParaResolver:4,
    dicas:['Pergunte às outras crianças se alguém viu alguma coisa estranha no vento.','Repare bem perto do escorregador — as folhas espalhadas podem indicar de onde o vento soprou.']
};
