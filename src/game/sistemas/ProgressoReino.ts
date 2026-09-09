import { DESAFIOS_PADRAO, type ConfiguracaoDesafios, type DificuldadeDesafio } from './DesafiosReino';

export interface EquipadoReino {arma:string;roupa?:string;companheiro?:string}
export interface FaixaReino {minimo:number;maximo:number}
export interface AventuraSalvaReino {fase:number;seed:number;eventos:string[]}
export interface EstadoReino {moedas:number;gemas:number;pergaminhos:number;gemasColetadas:string[];pergaminhosColetados:string[];melhorMoedas:number;portasAbertas:number;checkpointX:number;checkpointY?:number;checkpointLevel:number;levelSeed:number;aventura:AventuraSalvaReino;faseAtual:number;selectedLevel:number;conclusoes:number;equipamentos:string[];equipado:EquipadoReino;assistencia:boolean;dificuldade:'tranquilo'|'normal'|'aventura';skin:number;invencivel:boolean;globalDifficulty:DificuldadeDesafio;challenges:ConfiguracaoDesafios;faixaSoma:FaixaReino}
const CHAVE='educapp:reino-portas:v2';
const INICIAL:EstadoReino={moedas:0,gemas:0,pergaminhos:0,gemasColetadas:[],pergaminhosColetados:[],melhorMoedas:0,portasAbertas:0,checkpointX:120,checkpointLevel:0,levelSeed:1,aventura:{fase:0,seed:1,eventos:[]},faseAtual:0,selectedLevel:0,conclusoes:0,equipamentos:['espada'],equipado:{arma:'espada'},assistencia:true,dificuldade:'normal',skin:0xffffff,invencivel:false,globalDifficulty:'medium',challenges:DESAFIOS_PADRAO(),faixaSoma:{minimo:0,maximo:50}};

export class ProgressoReino {
    carregar():EstadoReino {try{const salvo=JSON.parse(localStorage.getItem(CHAVE)??'{}') as Partial<EstadoReino>,challenges=DESAFIOS_PADRAO();for(const type of Object.keys(challenges) as (keyof ConfiguracaoDesafios)[])challenges[type]={...challenges[type],...salvo.challenges?.[type]};return {...INICIAL,...salvo,selectedLevel:salvo.selectedLevel??salvo.faseAtual??0,checkpointLevel:salvo.checkpointLevel??salvo.faseAtual??0,equipado:{...INICIAL.equipado,...salvo.equipado},aventura:{...INICIAL.aventura,...salvo.aventura,eventos:[...(salvo.aventura?.eventos??[])]},faixaSoma:{...INICIAL.faixaSoma,...salvo.faixaSoma},challenges};}catch{return {...INICIAL,equipado:{...INICIAL.equipado},aventura:{...INICIAL.aventura,eventos:[]},faixaSoma:{...INICIAL.faixaSoma},challenges:DESAFIOS_PADRAO()};}}
    salvar(parcial:Partial<EstadoReino>):EstadoReino {const estado={...this.carregar(),...parcial};try{localStorage.setItem(CHAVE,JSON.stringify(estado));}catch{}return estado;}
    adicionarMoedas(quantidade:number):EstadoReino {return this.salvar({moedas:this.carregar().moedas+quantidade});}
    concluir(moedasDaFase:number):EstadoReino {const atual=this.carregar();return this.salvar({melhorMoedas:Math.max(atual.melhorMoedas,moedasDaFase),conclusoes:atual.conclusoes+1});}
}
export const progressoReino=new ProgressoReino();
