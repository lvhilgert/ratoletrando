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
        this.load.spritesheet('reino-cavaleiro','assets/reino-portas/cavaleiro-sprites-espacado.png',{frameWidth:257,frameHeight:748,endFrame:9});
        this.load.spritesheet('reino-slime','assets/reino-portas/slime-sprites-espacado.png',{frameWidth:402,frameHeight:748,endFrame:5});
        this.load.spritesheet('reino-objetos','assets/reino-portas/objetos.png',{frameWidth:354,frameHeight:443,endFrame:9});
        this.load.image('reino-bosque','assets/reino-portas/bosque-castelo.png');
        this.load.image('reino-panorama','assets/reino-portas/panorama-reinos.png');
        this.load.spritesheet('detetive-jogador','assets/detetive-mirim/detetive-sprites.png',{frameWidth:181,frameHeight:724,endFrame:11});
        this.load.spritesheet('detetive-suspeitos','assets/detetive-mirim/suspeitos.png',{frameWidth:543,frameHeight:724,endFrame:3});
        this.load.spritesheet('detetive-escola','assets/detetive-mirim/escola.png',{frameWidth:627,frameHeight:627,endFrame:3});
        this.load.spritesheet('detetive-objetos','assets/detetive-mirim/objetos.png',{frameWidth:354,frameHeight:443,endFrame:9});
    }
    create(): void {
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
