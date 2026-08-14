import * as Phaser from 'phaser';
import { Carregamento } from './cenas/Carregamento';
import { Menu } from './cenas/Menu';
import { Jogo } from './cenas/Jogo';
import { FimDaFase } from './cenas/FimDaFase';

const configuracao: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    parent: 'game-container',
    backgroundColor: '#f7efd8',
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [Carregamento, Menu, Jogo, FimDaFase]
};

export default (parent: string): Phaser.Game => new Phaser.Game({ ...configuracao, parent });
