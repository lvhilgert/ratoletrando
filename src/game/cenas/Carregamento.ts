import * as Phaser from 'phaser';
import { carregarAssetsBasicos } from '../sistemas/AssetsEducApp';

export class Carregamento extends Phaser.Scene {
    constructor(){super('Carregamento');}
    preload():void {carregarAssetsBasicos(this);}
    create():void {this.scene.start('EducApp');}
}
