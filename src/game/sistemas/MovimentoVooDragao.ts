export const moverVooDragao=(y:number,direcao:number,delta:number):number=>
    Math.max(65,Math.min(575,y+direcao*310*delta/1000));

export const FASES_VOO=[
    {nome:'PICOS DE CRISTAL',mecanica:'COLETE ESTRELAS ENTRE OS CRISTAIS',fundo:'montanha',cor:0x326d91,duracao:25_000,velocidade:245,aceleracao:65,abertura:240,intervalo:[1450,1750]},
    {nome:'PÂNTANO DAS NUVENS',mecanica:'RESISTA ÀS RAJADAS DE VENTO',fundo:'pantano',cor:0x315f51,duracao:25_000,velocidade:295,aceleracao:85,abertura:205,intervalo:[1200,1500]},
    {nome:'CÉU DO VULCÃO',mecanica:'DESVIE DAS BOLAS DE FOGO',fundo:'fogo',cor:0x873e32,duracao:25_000,velocidade:345,aceleracao:105,abertura:180,intervalo:[1000,1300]}
] as const;
