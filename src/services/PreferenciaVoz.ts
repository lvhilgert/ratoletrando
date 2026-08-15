const CHAVE='educapp-acessibilidade-voz';

export class PreferenciaVoz {
    static obter():boolean {
        try{return window.localStorage.getItem(CHAVE)==='true';}catch{return false;}
    }
    static definir(ativa:boolean):void {
        try{window.localStorage.setItem(CHAVE,String(ativa));}catch{/* O jogo continua mesmo sem armazenamento local. */}
    }
}
