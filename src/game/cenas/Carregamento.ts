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
