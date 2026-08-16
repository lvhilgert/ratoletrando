import * as Phaser from 'phaser';
import { FaseDetetiveConfig } from '../tiposDetetive';

const ceuEGrama=(cena:Phaser.Scene,c:Phaser.GameObjects.Container):void => {
    c.add(cena.add.rectangle(480,320,960,640,0x9be0f2).setDepth(-1));
    c.add(cena.add.rectangle(480,470,960,340,0x8fd15c).setDepth(0));
    for(let i=0;i<5;i++)c.add(cena.add.ellipse(120+i*190,150+((i%2)*20),90,40,0xffffff,.9).setDepth(0));
};
const arbusto=(cena:Phaser.Scene,x:number,y:number):Phaser.GameObjects.Container=>{
    const g=cena.add.graphics();g.fillStyle(0x3f8f3f,1).fillCircle(-22,0,26).fillCircle(20,-6,30).fillCircle(0,-24,26).fillCircle(0,10,24);
    return cena.add.container(x,y,[g]).setDepth(4);
};

export const CASO_BONE_VERMELHO:FaseDetetiveConfig={
    id:'bone-vermelho',numero:3,titulo:'O Mistério do Boné Vermelho',tema:'parquinho',
    introducao:'O boné vermelho de um amiguinho sumiu no parquinho! Dessa vez ninguém parece ter culpa... será o que aconteceu?',
    areas:[
        {id:'gramado',nome:'GRAMADO',textura:'procedural',saidas:{cima:'escorregador',esquerda:'balancos',direita:'caixa-areia'},decoracao:(cena,c)=>{
            ceuEGrama(cena,c);
            const arvore=cena.add.graphics().setDepth(2);arvore.fillStyle(0x7a5230,1).fillRect(455,380,30,140);arvore.fillStyle(0x4baa5a,1).fillCircle(470,360,70);c.add(arvore);
            [[250,500],[700,520],[150,420]].forEach(([x,y])=>{const flor=cena.add.circle(x,y,8,0xff8fc4).setDepth(2);c.add(flor);});
        }},
        {id:'escorregador',nome:'ESCORREGADOR',textura:'procedural',saidas:{baixo:'gramado'},decoracao:(cena,c)=>{
            ceuEGrama(cena,c);
            const g=cena.add.graphics().setDepth(2);g.fillStyle(0xd8963f,1).fillRect(560,220,26,220);g.fillStyle(0xe8483c,1).fillTriangle(560,220,760,420,560,440);g.fillStyle(0xffd35a,1).fillRect(540,190,50,40);
            c.add(g);
            for(let i=0;i<6;i++)c.add(cena.add.ellipse(200+Phaser.Math.Between(-40,220),420+Phaser.Math.Between(-20,60),18,10,0xb8842f).setAngle(Phaser.Math.Between(0,40)).setDepth(3));
            c.add(arbusto(cena,300,500));
        }},
        {id:'balancos',nome:'BALANÇOS',textura:'procedural',saidas:{direita:'gramado'},decoracao:(cena,c)=>{
            ceuEGrama(cena,c);
            const g=cena.add.graphics().setDepth(2);g.fillStyle(0x8a5a34,1).fillRect(300,180,16,300).fillRect(640,180,16,300).fillRect(300,180,356,16);
            g.lineStyle(4,0x5a4028,1).lineBetween(400,196,400,340).lineBetween(560,196,560,340);
            g.fillStyle(0xe8483c,1).fillRect(378,340,44,14);g.fillStyle(0x3f8fd8,1).fillRect(538,340,44,14);c.add(g);
        }},
        {id:'caixa-areia',nome:'CAIXA DE AREIA',textura:'procedural',saidas:{esquerda:'gramado'},decoracao:(cena,c)=>{
            ceuEGrama(cena,c);
            const g=cena.add.graphics().setDepth(2);g.fillStyle(0x8a5a34,1).fillRoundedRect(330,300,300,180,14);g.fillStyle(0xf0d9a0,1).fillRoundedRect(348,318,264,144,10);
            g.fillStyle(0xffffff,1).fillTriangle(420,420,460,340,500,420);g.fillStyle(0x4faee0,1).fillRect(560,360,36,30);
            c.add(g);
        }}
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
