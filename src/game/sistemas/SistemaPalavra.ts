export class SistemaPalavra {
    private coletadas:boolean[];
    private ultimoIndice=-1;
    constructor(readonly palavra:string){this.coletadas=Array(palavra.length).fill(false);}
    get proximaLetra():string|undefined {const i=this.coletadas.findIndex(v=>!v);return i>=0?this.palavra[i]:undefined;}
    get completa():boolean {return this.coletadas.every(Boolean);}
    tentar(letra:string):boolean {
        const indice=[...this.palavra].findIndex((valor,i)=>valor===letra&&!this.coletadas[i]);
        if(indice<0)return false;
        this.coletadas[indice]=true;this.ultimoIndice=indice;return true;
    }
    get indiceUltimaLetra():number {return this.ultimoIndice;}
    get letrasColetadas():number {return this.coletadas.filter(Boolean).length;}
}
