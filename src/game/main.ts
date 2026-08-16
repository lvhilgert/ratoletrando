import * as Phaser from 'phaser';
import { Carregamento } from './cenas/Carregamento';
import { Menu } from './cenas/Menu';
import { Jogo } from './cenas/Jogo';
import { FimDaFase } from './cenas/FimDaFase';
import { EducApp } from './cenas/EducApp';
import { OuviEscrevi } from './cenas/OuviEscrevi';
import { MontaPalavra } from './cenas/MontaPalavra';
import { ContaComigo } from './cenas/ContaComigo';
import { SomaTrilha } from './cenas/SomaTrilha';
import { MemoLetras } from './cenas/MemoLetras';
import { ReinoDasPortas } from './cenas/ReinoDasPortas';
import { ConfiguracaoReino } from './cenas/ConfiguracaoReino';
import { CasosDetetive } from './cenas/CasosDetetive';
import { FaseDetetive } from './cenas/FaseDetetive';

const configuracao: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    parent: 'game-container',
    backgroundColor: '#f7efd8',
    input: { gamepad: true },
    physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 0 }, debug: false } },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [Carregamento, EducApp, Menu, Jogo, FimDaFase, OuviEscrevi, MontaPalavra, ContaComigo, SomaTrilha, MemoLetras, ConfiguracaoReino, ReinoDasPortas, CasosDetetive, FaseDetetive]
};

export default (parent: string): Phaser.Game => new Phaser.Game({ ...configuracao, parent });
