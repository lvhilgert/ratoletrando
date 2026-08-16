import { EQUIPAMENTOS_REINO } from '../dados/mundoReinoPortas';

export interface EstadoReino {moedas:number;gemas:number;pergaminhos:number;melhorMoedas:number;portasAbertas:number;checkpointX:number;conclusoes:number;equipamentos:string[];assistencia:boolean;dificuldade:'tranquilo'|'normal'|'aventura';skin:number}
const CHAVE='educapp:reino-portas:v2';
const INICIAL:EstadoReino={moedas:0,gemas:0,pergaminhos:0,melhorMoedas:0,portasAbertas:0,checkpointX:120,conclusoes:0,equipamentos:['espada'],assistencia:true,dificuldade:'normal',skin:0xffffff};

export class ProgressoReino {
    carregar():EstadoReino {try{return {...INICIAL,...JSON.parse(localStorage.getItem(CHAVE)??'{}')};}catch{return {...INICIAL};}}
    salvar(parcial:Partial<EstadoReino>):EstadoReino {const estado={...this.carregar(),...parcial};try{localStorage.setItem(CHAVE,JSON.stringify(estado));}catch{}return estado;}
    concluir(moedas:number):EstadoReino {const atual=this.carregar(),total=atual.moedas+moedas,equipamentos=EQUIPAMENTOS_REINO.filter(item=>item.preco<=total).map(item=>item.id);return this.salvar({moedas:total,melhorMoedas:Math.max(atual.melhorMoedas,moedas),conclusoes:atual.conclusoes+1,equipamentos});}
}
export const progressoReino=new ProgressoReino();
