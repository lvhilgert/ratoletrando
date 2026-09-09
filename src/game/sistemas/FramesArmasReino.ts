export const LIMITES_FRAMES_ARMAS:Record<string,number[]>={
    'espada-rapida':[202,397,600,799,1003,1176,1376,1594,1795],
    lanca:[222,424,649,862,1056,1204,1440,1630,1820],
    martelo:[211,416,624,830,1029,1219,1434,1638,1819],
    arco:[197,406,629,831,1011,1192,1407,1619,1808]
};

export const framesArma=(divisoes:number[])=>[0,...divisoes,2000].slice(0,-1).map((x,i)=>({x,largura:[...divisoes,2000][i]-x,destinoX:x-i*200+70}));
