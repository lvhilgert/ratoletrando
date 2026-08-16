import * as Phaser from 'phaser';

/** Contrato compartilhado por todos os inimigos do Reino das Portas. */
export interface InimigoReino {
    x:number;
    y:number;
    derrotado:boolean;
    readonly corpoColisao:Phaser.Physics.Arcade.Sprite;
    readonly colideComPlataformas:boolean;
    atualizar():void;
    atingir():boolean;
    derrotar():void;
}
