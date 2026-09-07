import * as Phaser from 'phaser';

export class Carregamento extends Phaser.Scene {
    constructor() { super('Carregamento'); }
    preload(): void {
        this.load.image('menu-jardim', 'assets/ratoletrando/menu-jardim.png');
        this.load.spritesheet('rato', 'assets/ratoletrando/jogo/rato-sprites-alinhado.png', { frameWidth: 256, frameHeight: 256, endFrame: 15 });
        this.load.spritesheet('gato', 'assets/ratoletrando/jogo/gato-sprites-alinhado.png', { frameWidth: 256, frameHeight: 256, endFrame: 15 });
        this.load.spritesheet('natureza', 'assets/ratoletrando/jogo/natureza.png', { frameWidth: 627, frameHeight: 627 });
        ['amarelo','azul','vermelho','roxo','verde'].forEach(cor=>
            this.load.image(`azulejo-${cor}`, `assets/ratoletrando/jogo/azulejo-${cor}.png`)
        );
        this.load.image('fruta-maca', 'assets/ratoletrando/jogo/frutas/maca.png');
        this.load.image('fruta-melancia', 'assets/ratoletrando/jogo/frutas/melancia.png');
        this.load.image('fruta-cereja', 'assets/ratoletrando/jogo/frutas/cereja.png');
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letra=>
            this.load.image(`letra-${letra}`, `assets/ratoletrando/jogo/letras/${letra}.png`)
        );
        const letrasAcentuadas:Record<string,string>={
            'Á':'A-agudo','À':'A-grave','Â':'A-circunflexo','Ã':'A-til',
            'É':'E-agudo','Ê':'E-circunflexo','Í':'I-agudo',
            'Ó':'O-agudo','Ô':'O-circunflexo','Õ':'O-til',
            'Ú':'U-agudo','Ü':'U-trema','Ç':'C-cedilha'
        };
        Object.entries(letrasAcentuadas).forEach(([letra,arquivo])=>
            this.load.image(`letra-${letra}`,`assets/ratoletrando/jogo/letras/${arquivo}.png`)
        );
        for(let i=0;i<6;i++) this.load.image(`estrela-${i}`,`assets/ratoletrando/jogo/estrela/estrela-${i}.png`);
        this.load.spritesheet('reino-cavaleiro','assets/reino-portas/cavaleiro-sprites-margens.png',{frameWidth:320,frameHeight:748,endFrame:9});
        ['espada-rapida','lanca','martelo','arco'].forEach(tipo=>this.load.image(`reino-cavaleiro-${tipo}-fonte`,`assets/reino-portas/reino-cavaleiro-${tipo}.png`));
        this.load.spritesheet('reino-cavaleiro-escudo','assets/reino-portas/reino-cavaleiro-escudo.png',{frameWidth:512,frameHeight:1024,endFrame:2});
        this.load.image('reino-terrenos-biomas','assets/reino-portas/reino-terrenos-biomas.png');
        this.load.image('reino-itens-magicos','assets/reino-portas/reino-itens-magicos.png');
        this.load.spritesheet('reino-arqueiro-sprites','assets/reino-portas/reino-arqueiro-sprites.png',{frameWidth:384,frameHeight:1024,endFrame:3});
        this.load.spritesheet('reino-inimigos-fogo','assets/reino-portas/reino-inimigos-fogo-sprites.png',{frameWidth:384,frameHeight:512,endFrame:7});
        this.load.image('reino-flecha-arqueiro','assets/reino-portas/reino-flecha-arqueiro.png');
        this.load.spritesheet('reino-slime','assets/reino-portas/slime-sprites-espacado.png',{frameWidth:402,frameHeight:748,endFrame:5});
        this.load.image('reino-morcego','assets/reino-portas/morcego-sprites.png');
        this.load.spritesheet('reino-cogumelo','assets/reino-portas/cogumelo-saltador-sprites.png',{frameWidth:520,frameHeight:755,endFrame:3});
        this.load.spritesheet('reino-furacao','assets/reino-portas/furacao-folhas-sprites.png',{frameWidth:682,frameHeight:768,endFrame:2});
        this.load.spritesheet('reino-gnomo-noz','assets/reino-portas/gnomo-noz-sprites.png',{frameWidth:498,frameHeight:788,endFrame:3});
        this.load.spritesheet('reino-galinhas-mover','assets/reino-portas/reino-galinhas-mover.png',{frameWidth:887,frameHeight:887,endFrame:1});
        this.load.image('reino-noz-gnomo','assets/reino-portas/reino-noz-gnomo.png');
        this.load.spritesheet('reino-espantalho','assets/reino-portas/cavaleiro-espantalho-sprites.png',{frameWidth:543,frameHeight:724,endFrame:3});
        this.load.spritesheet('reino-mimico-porta','assets/reino-portas/mimico-porta-sprites.png',{frameWidth:415,frameHeight:756,endFrame:4});
        this.load.spritesheet('reino-objetos','assets/reino-portas/objetos.png',{frameWidth:354,frameHeight:443,endFrame:9});
        this.load.spritesheet('reino-planta','assets/reino-portas/reino-planta-sprites.png',{frameWidth:768,frameHeight:1024,endFrame:1});
        this.load.image('reino-caverna-cristais','assets/reino-portas/reino-caverna-cristais.png');
        this.load.image('reino-caverna-estalactites','assets/reino-portas/reino-caverna-estalactites.png');
        this.load.spritesheet('reino-companheiro-raposa-mover','assets/reino-portas/reino-companheiro-raposa-sprites.png',{frameWidth:887,frameHeight:887,endFrame:1});
        this.load.spritesheet('reino-companheiro-tartaruga-mover','assets/reino-portas/reino-companheiro-tartaruga-sprites.png',{frameWidth:887,frameHeight:887,endFrame:1});
        this.load.spritesheet('reino-companheiro-coruja-mover','assets/reino-portas/reino-companheiro-coruja-sprites.png',{frameWidth:887,frameHeight:887,endFrame:1});
        this.load.spritesheet('reino-companheiro-dragao-mover','assets/reino-portas/reino-companheiro-dragao-sprites.png',{frameWidth:768,frameHeight:1024,endFrame:1});
        ['arqueiro','arvore-colmeia','chao-flores','galinhas','espinhos','lava','prop-bau-tonel','tronco','colmeia','borboletas','plataforma','companheiro-coruja','companheiro-raposa','companheiro-tartaruga','companheiro-dragao','floresta-prop','caverna-prop','fazenda-prop'].forEach(id=>this.load.image(`reino-${id}`,`assets/reino-portas/reino-${id}.png`));
        ['bosque','vila','caverna','montanha','pantano','biblioteca','castelo','fogo'].forEach(id=>this.load.image(`reino-fundo-${id}`,`assets/reino-portas/${id==='bosque'?'bosque-castelo':`fundo-${id}`}.png`));
        this.load.image('reino-panorama','assets/reino-portas/panorama-reinos.png');
        this.load.spritesheet('detetive-jogador','assets/detetive-mirim/detetive-sprites.png',{frameWidth:181,frameHeight:724,endFrame:11});
        this.load.spritesheet('detetive-suspeitos','assets/detetive-mirim/suspeitos.png',{frameWidth:543,frameHeight:724,endFrame:3});
        this.load.spritesheet('detetive-escola','assets/detetive-mirim/escola.png',{frameWidth:627,frameHeight:627,endFrame:3});
        this.load.spritesheet('detetive-objetos','assets/detetive-mirim/objetos.png',{frameWidth:354,frameHeight:443,endFrame:9});
    }
    create(): void {
        const limitesArmas:Record<string,number[]>={'espada-rapida':[202,397,600,799,1003,1176,1376,1594,1795],lanca:[222,424,649,862,1056,1204,1440,1630,1820],martelo:[211,416,624,830,1029,1219,1434,1638,1819],arco:[197,406,629,831,1011,1192,1407,1619,1808]};
        Object.entries(limitesArmas).forEach(([tipo,divisoes])=>{const origem=this.textures.get(`reino-cavaleiro-${tipo}-fonte`).getSourceImage() as CanvasImageSource,destino=this.textures.createCanvas(`reino-cavaleiro-${tipo}`,3400,667),limites=[0,...divisoes,2000];if(!destino)throw new Error(`Não foi possível preparar os sprites de ${tipo}.`);for(let i=0;i<10;i++){const inicio=limites[i],largura=limites[i+1]-inicio;destino.context.drawImage(origem,inicio,0,largura,667,i*340+inicio-i*200+70,0,largura,667);destino.add(i,0,i*340,0,340,667);}destino.refresh();});
        const terrenos=this.textures.get('reino-terrenos-biomas'),quadrosTerreno=[[11,232,373,223],[384,275,379,180],[773,202,379,254],[1152,253,373,203],[11,598,373,197],[393,618,369,175],[772,617,380,177],[1152,617,370,195]];quadrosTerreno.forEach(([x,y,w,h],i)=>terrenos.add(i,0,x,y,w,h));
        const itens=this.textures.get('reino-itens-magicos'),quadrosItens=[[141,39,305,424],[649,54,236,371],[1116,52,235,372],[170,560,237,362],[705,516,113,420]];quadrosItens.forEach(([x,y,w,h],i)=>itens.add(i,0,x,y,w,h));
        const morcego=this.textures.get('reino-morcego');for(let i=0;i<6;i++)morcego.add(i,0,1+i*485,0,480,721);
        if(!this.anims.exists('reino-galinhas-mover'))this.anims.create({key:'reino-galinhas-mover',frames:this.anims.generateFrameNumbers('reino-galinhas-mover',{frames:[0,1]}),frameRate:3,repeat:-1});
        this.anims.create({key:'reino-planta-abrir',frames:this.anims.generateFrameNumbers('reino-planta',{frames:[0,1]}),frameRate:5,repeat:0});
        ['raposa','tartaruga','coruja','dragao'].forEach(tipo=>this.anims.create({key:`reino-companheiro-${tipo}-mover`,frames:this.anims.generateFrameNumbers(`reino-companheiro-${tipo}-mover`,{frames:[0,1]}),frameRate:tipo==='raposa'||tipo==='tartaruga'?5:7,repeat:-1}));
        const criarCirculo = (nome:string, raio:number, cor:number, borda?:number) => {
            const g=this.add.graphics(); g.fillStyle(cor).fillCircle(raio,raio,raio); if(borda) g.lineStyle(3,borda).strokeCircle(raio,raio,raio-2); g.generateTexture(nome,raio*2,raio*2); g.destroy();
        };
        const animar=(personagem:string) => {
            ['frente','costas','direita','esquerda'].forEach((direcao,linha)=>this.anims.create({
                key:`${personagem}-${direcao}`,
                frames:this.anims.generateFrameNumbers(personagem,{start:linha*4,end:linha*4+3}),
                frameRate:8,
                repeat:-1,
                yoyo:false
            }));
        };
        animar('rato'); animar('gato');
        this.anims.create({key:'estrela-brilhar',frames:Array.from({length:6},(_,i)=>({key:`estrela-${i}`})),frameRate:8,repeat:-1,yoyo:true});
        criarCirculo('bolinha',7,0x5ce1ff,0xffffff);
        const q=this.add.graphics(); q.fillStyle(0xffd447).fillTriangle(2,22,24,12,2,2).fillStyle(0xe2a91b).fillCircle(8,9,2).fillCircle(9,17,2); q.generateTexture('queijo',26,24); q.destroy();
        this.scene.start('EducApp');
    }
}
