import { PreferenciaVoz } from './PreferenciaVoz';

class ServicoVoz {
    private sintetizador?:SpeechSynthesis;
    private vozes:SpeechSynthesisVoice[]=[];
    private textoPendente?:string;
    private timerFallback?:number;
    private velocidadePendente=.85;

    constructor(){
        if(typeof window==='undefined'||!('speechSynthesis' in window))return;
        this.sintetizador=window.speechSynthesis;
        this.atualizarVozes();
        this.sintetizador.addEventListener('voiceschanged',()=>{
            this.atualizarVozes();
            if(this.textoPendente)this.falarPendente();
        });
    }

    falar(texto:string,opcoes?:{velocidade?:number;obrigatoria?:boolean}):void {
        const conteudo=texto.trim();
        if((!PreferenciaVoz.obter()&&!opcoes?.obrigatoria)||!this.sintetizador||!conteudo)return;
        this.parar();
        this.textoPendente=conteudo;
        this.velocidadePendente=opcoes?.velocidade??.85;
        this.atualizarVozes();
        if(this.vozes.length){this.falarPendente();return;}
        // Se voiceschanged não ocorrer, usa a voz padrão após um pequeno intervalo.
        this.timerFallback=window.setTimeout(()=>this.falarPendente(),700);
    }

    parar():void {
        if(this.timerFallback!==undefined){window.clearTimeout(this.timerFallback);this.timerFallback=undefined;}
        this.textoPendente=undefined;
        this.sintetizador?.cancel();
    }

    private atualizarVozes():void {this.vozes=this.sintetizador?.getVoices()??[];}

    private falarPendente():void {
        if(!this.sintetizador||!this.textoPendente)return;
        if(this.timerFallback!==undefined){window.clearTimeout(this.timerFallback);this.timerFallback=undefined;}
        const utterance=new SpeechSynthesisUtterance(this.textoPendente.toLocaleLowerCase('pt-BR'));
        const voz=this.escolherVozBrasileira();
        utterance.lang='pt-BR';if(voz)utterance.voice=voz;
        utterance.rate=this.velocidadePendente;utterance.pitch=1;utterance.volume=1;
        this.textoPendente=undefined;
        this.sintetizador.cancel();this.sintetizador.speak(utterance);
    }

    private escolherVozBrasileira():SpeechSynthesisVoice|undefined {
        const brasileiras=this.vozes.filter(voz=>voz.lang.replace('_','-').toLowerCase()==='pt-br');
        if(!brasileiras.length)return undefined;
        const naturais=['natural','neural','google','microsoft','luciana','francisca','antonio','vitória','vitoria'];
        const roboticas=['espeak','compact','diphone','robot'];
        const pontuar=(voz:SpeechSynthesisVoice)=>{const nome=voz.name.toLowerCase();return (naturais.some(t=>nome.includes(t))?20:0)+(roboticas.some(t=>nome.includes(t))?-30:0)+(voz.localService?5:0)+(voz.default?2:0);};
        return [...brasileiras].sort((a,b)=>pontuar(b)-pontuar(a))[0];
    }
}

export const servicoVoz=new ServicoVoz();
