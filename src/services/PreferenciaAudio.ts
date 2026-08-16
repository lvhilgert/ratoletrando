const CHAVE_MUSICA='educapp-volume-musica';
const CHAVE_EFEITOS='educapp-volume-efeitos';
const PADRAO_MUSICA=.5;
const PADRAO_EFEITOS=.7;

const limitar=(valor:number):number=>Math.max(0,Math.min(1,Number.isFinite(valor)?valor:0));

export class PreferenciaAudio {
    static obterVolumeMusica():number {return this.obter(CHAVE_MUSICA,PADRAO_MUSICA);}
    static obterVolumeEfeitos():number {return this.obter(CHAVE_EFEITOS,PADRAO_EFEITOS);}
    static definirVolumeMusica(volume:number):void {this.definir(CHAVE_MUSICA,volume);}
    static definirVolumeEfeitos(volume:number):void {this.definir(CHAVE_EFEITOS,volume);}

    private static obter(chave:string,padrao:number):number {
        try {
            const salvo=window.localStorage.getItem(chave);
            if(salvo===null)return padrao;
            const valor=Number(salvo);
            return Number.isFinite(valor)?limitar(valor):padrao;
        } catch {return padrao;}
    }
    private static definir(chave:string,volume:number):void {
        try {window.localStorage.setItem(chave,String(limitar(volume)));}catch{/* O jogo continua mesmo sem armazenamento local. */}
    }
}
