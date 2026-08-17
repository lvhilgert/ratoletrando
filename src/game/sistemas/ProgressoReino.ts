import { EQUIPAMENTOS_REINO } from '../dados/mundoReinoPortas';

export interface EquipadoReino {arma:string;roupa?:string;companheiro?:string}
export interface FaixaReino {minimo:number;maximo:number}
export interface EstadoReino {moedas:number;gemas:number;pergaminhos:number;gemasColetadas:string[];pergaminhosColetados:string[];melhorMoedas:number;portasAbertas:number;checkpointX:number;faseAtual:number;conclusoes:number;equipamentos:string[];equipado:EquipadoReino;assistencia:boolean;dificuldade:'tranquilo'|'normal'|'aventura';skin:number;invencivel:boolean;faixaSoma:FaixaReino;faixaQuantidade:FaixaReino}
const CHAVE='educapp:reino-portas:v2';
const INICIAL:EstadoReino={moedas:0,gemas:0,pergaminhos:0,gemasColetadas:[],pergaminhosColetados:[],melhorMoedas:0,portasAbertas:0,checkpointX:120,faseAtual:0,conclusoes:0,equipamentos:['espada'],equipado:{arma:'espada'},assistencia:true,dificuldade:'normal',skin:0xffffff,invencivel:false,faixaSoma:{minimo:0,maximo:50},faixaQuantidade:{minimo:3,maximo:9}};

export class ProgressoReino {
    carregar():EstadoReino {try{const salvo=JSON.parse(localStorage.getItem(CHAVE)??'{}') as Partial<EstadoReino>;return {...INICIAL,...salvo,equipado:{...INICIAL.equipado,...salvo.equipado},faixaSoma:{...INICIAL.faixaSoma,...salvo.faixaSoma},faixaQuantidade:{...INICIAL.faixaQuantidade,...salvo.faixaQuantidade}};}catch{return {...INICIAL,equipado:{...INICIAL.equipado},faixaSoma:{...INICIAL.faixaSoma},faixaQuantidade:{...INICIAL.faixaQuantidade}};}}
    salvar(parcial:Partial<EstadoReino>):EstadoReino {const estado={...this.carregar(),...parcial};try{localStorage.setItem(CHAVE,JSON.stringify(estado));}catch{}return estado;}
    concluir(moedas:number):EstadoReino {const atual=this.carregar(),total=atual.moedas+moedas,equipamentos=EQUIPAMENTOS_REINO.filter(item=>item.precoGemas===undefined&&item.preco<=total).map(item=>item.id);return this.salvar({moedas:total,melhorMoedas:Math.max(atual.melhorMoedas,moedas),conclusoes:atual.conclusoes+1,equipamentos:[...new Set([...atual.equipamentos,...equipamentos])]});}
}
export const progressoReino=new ProgressoReino();
