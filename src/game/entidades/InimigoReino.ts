import * as Phaser from 'phaser';

/** Contrato compartilhado por todos os inimigos do Reino das Portas. */
export interface InimigoReino {
    x:number;
    y:number;
    derrotado:boolean;
    readonly corpoColisao:Phaser.Physics.Arcade.Sprite;
    readonly colideComPlataformas:boolean;
    readonly guardiao?:boolean;
    readonly resisteMartelo?:boolean;
    atualizar():void;
    atingir(impactoForte?:boolean):boolean;
    derrotar():void;
}
