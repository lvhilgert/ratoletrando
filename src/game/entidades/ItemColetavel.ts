import * as Phaser from 'phaser';
export type TipoItem = 'bolinha'|'queijo'|'fruta'|'estrela';
export class ItemColetavel extends Phaser.Physics.Arcade.Sprite {
    constructor(cena: Phaser.Scene, x:number, y:number, readonly tipo:TipoItem) {
        const frutas = ['fruta-maca', 'fruta-melancia', 'fruta-cereja'];
        const textura = tipo === 'fruta' ? Phaser.Utils.Array.GetRandom(frutas) : tipo === 'estrela' ? 'estrela-0' : tipo;
        super(cena,x,y,textura);
        cena.add.existing(this); cena.physics.add.existing(this);
        this.setImmovable(true);
        if (tipo === 'fruta') this.setDisplaySize(38,38).setDepth(3);
        if (tipo === 'estrela') {
            this.setDisplaySize(44,44).setDepth(6);
            let frame=0;
            const animacao=cena.time.addEvent({delay:120,loop:true,callback:()=>{
                if(!this.active){animacao.remove();return;}
                this.setTexture(`estrela-${frame++%6}`).setDisplaySize(44,44);
            }});
            cena.tweens.add({targets:this,y:this.y-7,angle:8,yoyo:true,repeat:-1,duration:900,ease:'Sine.InOut'});
        }
    }
}
