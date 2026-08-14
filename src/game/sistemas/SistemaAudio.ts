const ZELDA=new URL('../sounds/trilha-sonora-zelda-piano.mp3',import.meta.url).href;
const ESTRELA=new URL('../sounds/estrela-mario-bros.mp3',import.meta.url).href;
const MIADO=new URL('../sounds/miado-gato.mp3',import.meta.url).href;

export class SistemaAudio {
    private contexto?:AudioContext;
    private ganhoMusica?:GainNode;
    private timer?:number;
    private passo=0;
    private externa?:HTMLAudioElement;
    private estrela?:HTMLAudioElement;
    private miado?:HTMLAudioElement;
    private musicaPausadaPelaEstrela=false;
    private pausado=false;
    private sinteticaTocavaAntesDaPausa=false;
    private modo:'sintetica'|'zelda'='sintetica';

    iniciarMusica():void {
        if(this.timer||this.externa)return;
        this.modo='zelda';
        if(this.modo==='zelda'){
            this.externa=new Audio(ZELDA);this.externa.loop=true;this.externa.volume=.22;
            void this.externa.play().catch(()=>this.iniciarSintetica());
        }else this.iniciarSintetica();
    }
    tocarEstrela():void {
        this.pararEstrela();
        const externaTocava=Boolean(this.externa&&!this.externa.paused);
        this.externa?.pause();
        const sinteticaTocava=Boolean(this.timer);this.pararSintetica();
        this.musicaPausadaPelaEstrela=externaTocava||sinteticaTocava;
        this.estrela=new Audio(ESTRELA);this.estrela.volume=.42;this.estrela.loop=true;
        void this.estrela.play().catch(()=>this.pararEstrela());
    }
    pararEstrela():void {
        if(this.estrela){this.estrela.pause();this.estrela.currentTime=0;this.estrela.src='';this.estrela=undefined;}
        if(!this.musicaPausadaPelaEstrela)return;
        this.musicaPausadaPelaEstrela=false;
        if(this.modo==='zelda'&&this.externa)void this.externa.play();
        else this.iniciarSintetica();
    }
    tocarMiado():void {
        this.miado?.pause();
        const som=new Audio(MIADO);this.miado=som;som.volume=.55;som.currentTime=2;
        const parar=()=>{som.pause();som.currentTime=2;if(this.miado===som)this.miado=undefined;};
        som.addEventListener('timeupdate',()=>{if(som.currentTime>=4)parar();});
        void som.play().then(()=>window.setTimeout(parar,2100)).catch(()=>undefined);
    }
    pausar():void {
        if(this.pausado)return;this.pausado=true;
        this.sinteticaTocavaAntesDaPausa=Boolean(this.timer);this.pararSintetica();
        this.externa?.pause();this.estrela?.pause();this.miado?.pause();
    }
    continuar():void {
        if(!this.pausado)return;this.pausado=false;
        if(this.estrela)void this.estrela.play();
        else if(this.modo==='zelda'&&this.externa)void this.externa.play();
        else if(this.sinteticaTocavaAntesDaPausa)this.iniciarSintetica();
        if(this.miado&&this.miado.currentTime<4)void this.miado.play();
        this.sinteticaTocavaAntesDaPausa=false;
    }
    efeito(tipo:'bolinha'|'comida'|'letra'|'erro'|'gato'|'vitoria'):void {
        this.contexto??=new AudioContext();void this.contexto.resume();
        const seq={bolinha:[880],comida:[523,659,784],letra:[659,784,988],erro:[392,349],gato:[180,145],vitoria:[523,659,784,1047]}[tipo];
        seq.forEach((f,i)=>this.nota(f,i*.09,tipo==='gato'?'triangle':'sine',tipo==='gato'?.15:.10));
    }
    private iniciarSintetica():void {
        if(this.timer)return;
        this.contexto??=new AudioContext();void this.contexto.resume();
        this.ganhoMusica=this.contexto.createGain();this.ganhoMusica.gain.value=.055;this.ganhoMusica.connect(this.contexto.destination);
        const notas=[261.63,329.63,392,523.25,392,329.63,293.66,349.23,440,587.33,440,349.23];
        const tocar=()=>{if(!this.contexto||!this.ganhoMusica)return;const agora=this.contexto.currentTime,osc=this.contexto.createOscillator(),ganho=this.contexto.createGain();osc.type='sine';osc.frequency.value=notas[this.passo++%notas.length];ganho.gain.setValueAtTime(0,agora);ganho.gain.linearRampToValueAtTime(.5,agora+.04);ganho.gain.exponentialRampToValueAtTime(.001,agora+.42);osc.connect(ganho).connect(this.ganhoMusica);osc.start(agora);osc.stop(agora+.45);};
        tocar();this.timer=window.setInterval(tocar,430);
    }
    private pararSintetica():void {if(this.timer){clearInterval(this.timer);this.timer=undefined;}this.ganhoMusica?.disconnect();this.ganhoMusica=undefined;}
    private nota(f:number,atraso:number,forma:OscillatorType,volume:number):void {if(!this.contexto)return;const agora=this.contexto.currentTime+atraso,osc=this.contexto.createOscillator(),ganho=this.contexto.createGain();osc.type=forma;osc.frequency.setValueAtTime(f,agora);ganho.gain.setValueAtTime(volume,agora);ganho.gain.exponentialRampToValueAtTime(.001,agora+.3);osc.connect(ganho).connect(this.contexto.destination);osc.start(agora);osc.stop(agora+.32);}
}
export const audioJogo=new SistemaAudio();
