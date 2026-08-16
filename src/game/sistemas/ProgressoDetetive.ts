export interface EstadoDetetive {fasesConcluidas:string[];faseAtual:string}
const CHAVE='educapp:detetive-mirim:v2';
const INICIAL:EstadoDetetive={fasesConcluidas:[],faseAtual:'lapis-dourado'};

export class ProgressoDetetive {
    carregar():EstadoDetetive {try{return {...INICIAL,...JSON.parse(localStorage.getItem(CHAVE)??'{}')};}catch{return {...INICIAL};}}
    salvar(parcial:Partial<EstadoDetetive>):EstadoDetetive {const estado={...this.carregar(),...parcial};try{localStorage.setItem(CHAVE,JSON.stringify(estado));}catch{}return estado;}
    concluirFase(id:string):EstadoDetetive {const atual=this.carregar();if(atual.fasesConcluidas.includes(id))return atual;return this.salvar({fasesConcluidas:[...atual.fasesConcluidas,id]});}
    estaConcluida(id:string):boolean {return this.carregar().fasesConcluidas.includes(id);}
}
export const progressoDetetive=new ProgressoDetetive();
