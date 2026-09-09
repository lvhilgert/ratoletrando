import * as Phaser from 'phaser';
import { medirLimitesOpacos, medirTopoApoiavel, type LimitesOpacos } from './GeometriaTerrestre';

type VisualTerrestre=Phaser.GameObjects.Image|Phaser.GameObjects.Sprite|Phaser.GameObjects.TileSprite;
type Corpo=Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody;
type LimitesTerrestres=LimitesOpacos&{apoio:number};
const limitesPorFrame=new Map<string,LimitesTerrestres>();

export interface ConfiguracaoAtorTerrestre {
    largura:number;
    altura:number;
    offsetX:number;
    velocidadeMaxima:[number,number];
    colideComLimitesDoMundo?:boolean;
}

export interface SuperficieMovelReino {
    corpo:Phaser.GameObjects.Rectangle;
    visual:Phaser.GameObjects.TileSprite;
}

const limitesVisiveis=(visual:VisualTerrestre):LimitesTerrestres=>{
    const frame=visual.frame,chave=`${visual.texture.key}:${frame.name}`,salvos=limitesPorFrame.get(chave);
    if(salvos)return salvos;
    const canvas=document.createElement('canvas'),contexto=canvas.getContext('2d',{willReadFrequently:true});
    canvas.width=frame.cutWidth;canvas.height=frame.cutHeight;contexto?.drawImage(frame.source.image as CanvasImageSource,frame.cutX,frame.cutY,frame.cutWidth,frame.cutHeight,0,0,frame.cutWidth,frame.cutHeight);
    const pixels=contexto?.getImageData(0,0,frame.cutWidth,frame.cutHeight).data,limites=pixels?{...medirLimitesOpacos(pixels,frame.cutWidth,frame.cutHeight),apoio:medirTopoApoiavel(pixels,frame.cutWidth,frame.cutHeight)}:{topo:0,base:1,apoio:0};
    limitesPorFrame.set(chave,limites);return limites;
};

export const baseVisual=(visual:VisualTerrestre):number=>visual.y+(limitesVisiveis(visual).base-visual.originY)*visual.displayHeight;
export const topoVisual=(visual:VisualTerrestre):number=>visual.y+(limitesVisiveis(visual).topo-visual.originY)*visual.displayHeight;
const topoApoiavel=(visual:VisualTerrestre):number=>visual.y+(limitesVisiveis(visual).apoio-visual.originY)*visual.displayHeight;

/** Encosta o último pixel opaco no piso, independentemente da margem transparente do asset. */
export const assentarTerrestre=<T extends VisualTerrestre>(visual:T,piso:number|Corpo):T=>{
    const y=typeof piso==='number'?piso:piso.bottom;
    visual.setY(y-(limitesVisiveis(visual).base-visual.originY)*visual.displayHeight);
    if(typeof piso!=='number')visual.setX(piso.center.x);
    return visual;
};

const posicionarCorpoNosPes=(sprite:Phaser.Physics.Arcade.Sprite,piso?:number):void=>{
    const corpo=sprite.body as Phaser.Physics.Arcade.Body,base=limitesVisiveis(sprite).base*sprite.frame.realHeight;
    corpo.setOffset(corpo.offset.x,base-corpo.sourceHeight).updateFromGameObject();
    if(piso!==undefined){sprite.y+=piso-corpo.bottom;corpo.updateFromGameObject();}
};

/** Recalcula o offset quando frame ou escala mudam, preservando o apoio físico atual. */
export const alinharCorpoTerrestre=(sprite:Phaser.Physics.Arcade.Sprite,piso=(sprite.body as Phaser.Physics.Arcade.Body).bottom):void=>posicionarCorpoNosPes(sprite,piso);

/** Configuração única de gravidade, hitbox e ponto dos pés para qualquer ator terrestre. */
export const configurarAtorTerrestre=<T extends Phaser.Physics.Arcade.Sprite>(sprite:T,config:ConfiguracaoAtorTerrestre):T=>{
    const corpo=sprite.body as Phaser.Physics.Arcade.Body;
    corpo.updateFromGameObject();
    corpo.setAllowGravity(true).setSize(config.largura,config.altura).setOffset(config.offsetX,0).setMaxVelocity(...config.velocidadeMaxima);
    sprite.setCollideWorldBounds(config.colideComLimitesDoMundo??false);
    posicionarCorpoNosPes(sprite);
    const atualizar=()=>sprite.active&&sprite.body&&alinharCorpoTerrestre(sprite);
    sprite.scene.events.on(Phaser.Scenes.Events.POST_UPDATE,atualizar);
    sprite.once(Phaser.GameObjects.Events.DESTROY,()=>sprite.scene.events.off(Phaser.Scenes.Events.POST_UPDATE,atualizar));
    return sprite;
};

/** Cria arte e collider na primeira faixa horizontal contínua da superfície. */
export const criarSuperficie=(cena:Phaser.Scene,grupo:Phaser.Physics.Arcade.StaticGroup,x:number,y:number,largura:number,alturaVisual:number,alturaFisica:number,textura='reino-plataforma',frame?:string|number):Corpo=>{
    // raster-exception: corpo físico invisível associado à superfície raster.
    const visual=cena.add.tileSprite(x,y,largura,alturaVisual,textura,frame).setTileScale(alturaVisual/cena.textures.getFrame(textura,frame).height).setDepth(3),topo=topoApoiavel(visual),objeto=cena.add.rectangle(x,topo+alturaFisica/2,largura,alturaFisica,0xffffff,0);
    objeto.setData('visual',visual);grupo.add(objeto);const corpo=objeto.body as Phaser.Physics.Arcade.StaticBody;corpo.updateFromGameObject();return corpo;
};

export const criarSuperficieMovel=(cena:Phaser.Scene,grupo:Phaser.Physics.Arcade.Group,x:number,y:number,largura:number,alturaVisual=44,alturaFisica=26,textura='reino-plataforma',frame?:string|number):SuperficieMovelReino=>{
    // raster-exception: corpo físico invisível associado à superfície raster.
    const visual=cena.add.tileSprite(x,y,largura,alturaVisual,textura,frame).setTileScale(alturaVisual/cena.textures.getFrame(textura,frame).height).setDepth(3),topo=topoApoiavel(visual),objeto=cena.add.rectangle(x,topo+alturaFisica/2,largura,alturaFisica,0xffffff,0);
    grupo.add(objeto);const corpo=objeto.body as Phaser.Physics.Arcade.Body;corpo.setAllowGravity(false).setImmovable(true);corpo.pushable=false;
    const deslocamentoVisualY=y-objeto.y,sincronizar=()=>visual.setPosition(objeto.x,objeto.y+deslocamentoVisualY);cena.events.on(Phaser.Scenes.Events.POST_UPDATE,sincronizar);objeto.once(Phaser.GameObjects.Events.DESTROY,()=>cena.events.off(Phaser.Scenes.Events.POST_UPDATE,sincronizar));
    return {corpo:objeto,visual};
};

/** Retorna a superfície física mais próxima abaixo do ponto de spawn. */
export const superficieAbaixo=(x:number,y:number,grupos:(Phaser.Physics.Arcade.Group|Phaser.Physics.Arcade.StaticGroup)[]):Corpo|undefined=>grupos.flatMap(grupo=>grupo.getChildren()).map(objeto=>(objeto as Phaser.GameObjects.GameObject&{body?:Corpo}).body).filter((corpo):corpo is Corpo=>!!corpo&&corpo.enable&&corpo.left<=x&&corpo.right>=x&&corpo.top>=y).sort((a,b)=>a.top-b.top)[0];
