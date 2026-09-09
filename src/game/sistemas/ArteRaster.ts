import * as Phaser from 'phaser';

export const painelRaster=(cena:Phaser.Scene,x:number,y:number,largura:number,altura:number,cor=0xffffff,alpha=1):Phaser.GameObjects.NineSlice=>cena.add.nineslice(x,y,'ui-painel',undefined,largura,altura,32,32,32,32).setTint(cor).setAlpha(alpha);
export const botaoRaster=(cena:Phaser.Scene,x:number,y:number,largura:number,altura:number,cor:number,alpha=1):Phaser.GameObjects.NineSlice=>cena.add.nineslice(x,y,'ui-botao',undefined,largura,altura,44,44,40,40).setTint(cor).setAlpha(alpha);
export const circuloRaster=(cena:Phaser.Scene,x:number,y:number,diametro:number,cor:number,alpha=1):Phaser.GameObjects.Image=>cena.add.image(x,y,'ui-circulo').setDisplaySize(diametro,diametro).setTint(cor).setAlpha(alpha);
export const barraRaster=(cena:Phaser.Scene,x:number,y:number,largura:number,altura:number,cor:number,alpha=1):Phaser.GameObjects.NineSlice=>cena.add.nineslice(x,y,'ui-barra',undefined,largura,altura,16,16,12,12).setTint(cor).setAlpha(alpha);
export const linhaRaster=(cena:Phaser.Scene,x1:number,y1:number,x2:number,y2:number,espessura:number,cor:number,alpha=1):Phaser.GameObjects.NineSlice=>barraRaster(cena,(x1+x2)/2,(y1+y2)/2,Phaser.Math.Distance.Between(x1,y1,x2,y2),espessura,cor,alpha).setRotation(Phaser.Math.Angle.Between(x1,y1,x2,y2));
