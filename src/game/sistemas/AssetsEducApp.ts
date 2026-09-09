import * as Phaser from 'phaser';
import { framesArma, LIMITES_FRAMES_ARMAS } from './FramesArmasReino';
import { barraRaster, painelRaster } from './ArteRaster';

const imagem=(cena:Phaser.Scene,chave:string,caminho:string):void=>{if(!cena.textures.exists(chave))cena.load.image(chave,caminho);};
const folha=(cena:Phaser.Scene,chave:string,caminho:string,config:Phaser.Types.Loader.FileTypes.ImageFrameConfig):void=>{if(!cena.textures.exists(chave))cena.load.spritesheet(chave,caminho,config);};

export const acompanharCargaDominio=(cena:Phaser.Scene,nome:string):void=>{
    if(!cena.textures.exists('ui-painel'))return;
    const painel=painelRaster(cena,480,320,430,112,0xffffff,.97).setDepth(1000),texto=cena.add.text(480,292,`PREPARANDO ${nome.toUpperCase()}…`,{fontFamily:'Trebuchet MS, Arial',fontSize:'18px',fontStyle:'bold',color:'#285d4b'}).setOrigin(.5).setDepth(1001),trilho=barraRaster(cena,480,338,330,16,0xd2e2db).setDepth(1001),barra=barraRaster(cena,315,338,1,12,0x49a57d).setOrigin(0,.5).setDepth(1002),objetos=[painel,texto,trilho,barra];
    const progresso=(valor:number)=>barra.setSize(Math.max(1,330*valor),12),erro=()=>texto.setText(`NÃO CONSEGUI CARREGAR ${nome.toUpperCase()}`).setColor('#a44040'),limpar=()=>{cena.load.off('progress',progresso);cena.load.off('loaderror',erro);objetos.forEach(objeto=>objeto.destroy());};
    cena.load.on('progress',progresso);cena.load.on('loaderror',erro);cena.load.once('complete',limpar);
};

export const carregarAssetsBasicos=(cena:Phaser.Scene):void=>{
    ['painel','botao','circulo','barra','speaker','speaker-off','lock','plus'].forEach(tipo=>imagem(cena,`ui-${tipo}`,`assets/compartilhados/ui-${tipo}.png`));
    imagem(cena,'educapp-fundo','assets/compartilhados/educapp-fundo.png');
    imagem(cena,'minijogos-fundo','assets/compartilhados/minijogos-fundo.png');
    folha(cena,'rato','assets/ratoletrando/jogo/rato-sprites-alinhado.png',{frameWidth:256,frameHeight:256,endFrame:15});
    folha(cena,'reino-cavaleiro','assets/reino-portas/cavaleiro-sprites-margens.png',{frameWidth:320,frameHeight:748,endFrame:9});
    folha(cena,'detetive-jogador','assets/detetive-mirim/detetive-sprites.png',{frameWidth:181,frameHeight:724,endFrame:11});
    folha(cena,'detetive-objetos','assets/detetive-mirim/objetos.png',{frameWidth:354,frameHeight:443,endFrame:9});
    imagem(cena,'fruta-maca','assets/ratoletrando/jogo/frutas/maca.png');
    imagem(cena,'fruta-melancia','assets/ratoletrando/jogo/frutas/melancia.png');
    imagem(cena,'fruta-cereja','assets/ratoletrando/jogo/frutas/cereja.png');
    imagem(cena,'estrela-0','assets/ratoletrando/jogo/estrela/estrela-0.png');
    imagem(cena,'letra-A','assets/ratoletrando/jogo/letras/A.png');
    imagem(cena,'letra-B','assets/ratoletrando/jogo/letras/B.png');
};

export const carregarAssetsRatoLetrando=(cena:Phaser.Scene):void=>{
    carregarAssetsBasicos(cena);
    imagem(cena,'menu-jardim','assets/ratoletrando/menu-jardim.png');
    imagem(cena,'bolinha','assets/ratoletrando/jogo/bolinha.png');
    imagem(cena,'queijo','assets/ratoletrando/jogo/queijo.png');
    folha(cena,'gato','assets/ratoletrando/jogo/gato-sprites-alinhado.png',{frameWidth:256,frameHeight:256,endFrame:15});
    folha(cena,'natureza','assets/ratoletrando/jogo/natureza.png',{frameWidth:627,frameHeight:627});
    ['amarelo','azul','vermelho','roxo','verde'].forEach(cor=>imagem(cena,`azulejo-${cor}`,`assets/ratoletrando/jogo/azulejo-${cor}.png`));
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letra=>imagem(cena,`letra-${letra}`,`assets/ratoletrando/jogo/letras/${letra}.png`));
    const acentuadas:Record<string,string>={'Á':'A-agudo','À':'A-grave','Â':'A-circunflexo','Ã':'A-til','É':'E-agudo','Ê':'E-circunflexo','Í':'I-agudo','Ó':'O-agudo','Ô':'O-circunflexo','Õ':'O-til','Ú':'U-agudo','Ü':'U-trema','Ç':'C-cedilha'};
    Object.entries(acentuadas).forEach(([letra,arquivo])=>imagem(cena,`letra-${letra}`,`assets/ratoletrando/jogo/letras/${arquivo}.png`));
    for(let i=1;i<6;i++)imagem(cena,`estrela-${i}`,`assets/ratoletrando/jogo/estrela/estrela-${i}.png`);
};

export const prepararAssetsRatoLetrando=(cena:Phaser.Scene):void=>{
    if(cena.registry.get('assets-ratoletrando-preparados'))return;
    const animar=(personagem:string):void=>['frente','costas','direita','esquerda'].forEach((direcao,linha)=>cena.anims.create({key:`${personagem}-${direcao}`,frames:cena.anims.generateFrameNumbers(personagem,{start:linha*4,end:linha*4+3}),frameRate:8,repeat:-1,yoyo:false}));
    animar('rato');animar('gato');
    cena.anims.create({key:'estrela-brilhar',frames:Array.from({length:6},(_,i)=>({key:`estrela-${i}`})),frameRate:8,repeat:-1,yoyo:true});
    cena.registry.set('assets-ratoletrando-preparados',true);
};

export const carregarAssetsReino=(cena:Phaser.Scene):void=>{
    carregarAssetsBasicos(cena);
    ['espada-rapida','lanca','martelo','arco'].forEach(tipo=>imagem(cena,`reino-cavaleiro-${tipo}`,`assets/reino-portas/reino-cavaleiro-${tipo}.png`));
    folha(cena,'reino-cavaleiro-escudo','assets/reino-portas/reino-cavaleiro-escudo.png',{frameWidth:512,frameHeight:1024,endFrame:2});
    imagem(cena,'reino-terrenos-biomas','assets/reino-portas/reino-terrenos-biomas.png');
    imagem(cena,'reino-itens-magicos','assets/reino-portas/reino-itens-magicos.png');
    imagem(cena,'reino-espada-cristal','assets/reino-portas/reino-espada-cristal.png');
    folha(cena,'reino-arqueiro-sprites','assets/reino-portas/reino-arqueiro-sprites.png',{frameWidth:384,frameHeight:1024,endFrame:3});
    folha(cena,'reino-inimigos-fogo','assets/reino-portas/reino-inimigos-fogo-sprites.png',{frameWidth:384,frameHeight:512,endFrame:7});
    imagem(cena,'reino-flecha-arqueiro','assets/reino-portas/reino-flecha-arqueiro.png');
    folha(cena,'reino-slime','assets/reino-portas/slime-sprites-espacado.png',{frameWidth:402,frameHeight:748,endFrame:5});
    imagem(cena,'reino-morcego','assets/reino-portas/morcego-sprites.png');
    folha(cena,'reino-cogumelo','assets/reino-portas/cogumelo-saltador-sprites.png',{frameWidth:520,frameHeight:755,endFrame:3});
    folha(cena,'reino-furacao','assets/reino-portas/furacao-folhas-sprites.png',{frameWidth:682,frameHeight:768,endFrame:2});
    folha(cena,'reino-gnomo-noz','assets/reino-portas/gnomo-noz-sprites.png',{frameWidth:498,frameHeight:788,endFrame:3});
    folha(cena,'reino-galinhas-mover','assets/reino-portas/reino-galinhas-mover.png',{frameWidth:887,frameHeight:887,endFrame:1});
    imagem(cena,'reino-noz-gnomo','assets/reino-portas/reino-noz-gnomo.png');
    folha(cena,'reino-espantalho','assets/reino-portas/cavaleiro-espantalho-sprites.png',{frameWidth:543,frameHeight:724,endFrame:3});
    folha(cena,'reino-mimico-porta','assets/reino-portas/mimico-porta-sprites.png',{frameWidth:415,frameHeight:756,endFrame:4});
    folha(cena,'reino-pinguim','assets/reino-portas/personagens/pinguim-sentinela/pinguim-sentinela-estados.png',{frameWidth:384,frameHeight:768,endFrame:5});
    folha(cena,'reino-gnomo-neve','assets/reino-portas/personagens/gnomo-neveiro/gnomo-neveiro-estados.png',{frameWidth:384,frameHeight:768,endFrame:5});
    folha(cena,'reino-mamute','assets/reino-portas/personagens/guardiao-mamute/guardiao-mamute-estados.png',{frameWidth:384,frameHeight:768,endFrame:5});
    folha(cena,'reino-caranguejo','assets/reino-portas/personagens/caranguejo-marinheiro/caranguejo-marinheiro-estados.png',{frameWidth:237,frameHeight:237,endFrame:3});
    folha(cena,'reino-gaivota','assets/reino-portas/personagens/gaivota-carga/gaivota-carga-estados.png',{frameWidth:237,frameHeight:237,endFrame:3});
    folha(cena,'reino-caranguejo-farol','assets/reino-portas/personagens/caranguejo-farol/caranguejo-farol-estados.png',{frameWidth:237,frameHeight:237,endFrame:3});
    folha(cena,'reino-raposa-luz','assets/reino-portas/personagens/raposa-luz/raposa-luz-estados.png',{frameWidth:237,frameHeight:237,endFrame:3});
    folha(cena,'reino-sentinela-musgo','assets/reino-portas/personagens/sentinela-musgo/sentinela-musgo-estados.png',{frameWidth:237,frameHeight:237,endFrame:3});
    folha(cena,'reino-tatu-pedra','assets/reino-portas/personagens/tatu-pedra/tatu-pedra-estados.png',{frameWidth:237,frameHeight:237,endFrame:3});
    folha(cena,'reino-gigante-basalto','assets/reino-portas/personagens/gigante-basalto/gigante-basalto-estados.png',{frameWidth:237,frameHeight:237,endFrame:3});
    folha(cena,'reino-urubu','assets/reino-portas/personagens/urubu-canion/urubu-canion-estados.png',{frameWidth:543,frameHeight:724,endFrame:3});
    folha(cena,'reino-objetos-expansao','assets/reino-portas/objetos-expansao.png',{frameWidth:362,frameHeight:362,endFrame:11});
    folha(cena,'reino-objetos-neve','assets/reino-portas/objetos-neve.png',{frameWidth:627,frameHeight:627,endFrame:3});
    folha(cena,'reino-objetos','assets/reino-portas/objetos.png',{frameWidth:354,frameHeight:443,endFrame:9});
    folha(cena,'reino-planta','assets/reino-portas/reino-planta-sprites.png',{frameWidth:768,frameHeight:1024,endFrame:1});
    imagem(cena,'reino-caverna-cristais','assets/reino-portas/reino-caverna-cristais.png');
    imagem(cena,'reino-caverna-estalactites','assets/reino-portas/reino-caverna-estalactites.png');
    folha(cena,'reino-companheiro-raposa-mover','assets/reino-portas/reino-companheiro-raposa-sprites.png',{frameWidth:887,frameHeight:887,endFrame:1});
    folha(cena,'reino-companheiro-tartaruga-mover','assets/reino-portas/reino-companheiro-tartaruga-sprites.png',{frameWidth:887,frameHeight:887,endFrame:1});
    folha(cena,'reino-companheiro-coruja-mover','assets/reino-portas/reino-companheiro-coruja-sprites.png',{frameWidth:887,frameHeight:887,endFrame:1});
    folha(cena,'reino-companheiro-dragao-mover','assets/reino-portas/reino-companheiro-dragao-sprites.png',{frameWidth:768,frameHeight:1024,endFrame:1});
    ['arqueiro','arvore-colmeia','chao-flores','galinhas','espinhos','lava','prop-bau-tonel','tronco','colmeia','borboletas','plataforma','companheiro-coruja','companheiro-raposa','companheiro-tartaruga','companheiro-dragao','floresta-prop','caverna-prop','fazenda-prop'].forEach(id=>imagem(cena,`reino-${id}`,`assets/reino-portas/reino-${id}.png`));
    ['bosque','vila','caverna','montanha','pantano','biblioteca','castelo','fogo','neve','costa','ruinas-lua','canion'].forEach(id=>imagem(cena,`reino-fundo-${id}`,`assets/reino-portas/${id==='bosque'?'bosque-castelo':`fundo-${id}`}.png`));
    imagem(cena,'reino-panorama','assets/reino-portas/panorama-reinos.png');
};

export const prepararAssetsReino=(cena:Phaser.Scene):void=>{
    if(cena.registry.get('assets-reino-preparados'))return;
    Object.entries(LIMITES_FRAMES_ARMAS).forEach(([tipo,divisoes])=>{const textura=cena.textures.get(`reino-cavaleiro-${tipo}`);framesArma(divisoes).forEach(({x,largura,destinoX},i)=>textura.add(i,0,x,0,largura,667)?.setTrim(340,667,destinoX,0,largura,667));});
    const terrenos=cena.textures.get('reino-terrenos-biomas');[[11,232,373,223],[384,275,379,180],[773,202,379,254],[1152,253,373,203],[11,598,373,197],[393,618,369,175],[772,617,380,177],[1152,617,370,195]].forEach(([x,y,w,h],i)=>terrenos.add(i,0,x,y,w,h));
    const itens=cena.textures.get('reino-itens-magicos');[[141,39,305,424],[649,54,236,371],[1116,52,235,372],[170,560,237,362],[705,516,113,420]].forEach(([x,y,w,h],i)=>itens.add(i,0,x,y,w,h));
    const morcego=cena.textures.get('reino-morcego');for(let i=0;i<6;i++)morcego.add(i,0,1+i*485,0,480,721);
    cena.anims.create({key:'reino-galinhas-mover',frames:cena.anims.generateFrameNumbers('reino-galinhas-mover',{frames:[0,1]}),frameRate:3,repeat:-1});
    cena.anims.create({key:'reino-planta-abrir',frames:cena.anims.generateFrameNumbers('reino-planta',{frames:[0,1]}),frameRate:5,repeat:0});
    ['raposa','tartaruga','coruja','dragao'].forEach(tipo=>cena.anims.create({key:`reino-companheiro-${tipo}-mover`,frames:cena.anims.generateFrameNumbers(`reino-companheiro-${tipo}-mover`,{frames:[0,1]}),frameRate:tipo==='raposa'||tipo==='tartaruga'?5:7,repeat:-1}));
    cena.registry.set('assets-reino-preparados',true);
};

export const carregarAssetsDetetive=(cena:Phaser.Scene):void=>{
    carregarAssetsBasicos(cena);
    folha(cena,'detetive-suspeitos','assets/detetive-mirim/suspeitos.png',{frameWidth:543,frameHeight:724,endFrame:3});
    folha(cena,'detetive-escola','assets/detetive-mirim/escola.png',{frameWidth:627,frameHeight:627,endFrame:3});
    ['sala-leitura','gramado','escorregador','balancos','caixa-areia'].forEach(area=>imagem(cena,`detetive-fundo-${area}`,`assets/detetive-mirim/fundo-${area}.png`));
};
