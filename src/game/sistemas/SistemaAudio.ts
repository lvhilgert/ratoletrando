const ESTRELA=new URL('../sounds/estrela.mp3',import.meta.url).href;
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
    private aguardandoNovaFase=false;
    private modo:'sintetica'|'zelda'='sintetica';
    private musicaReino?:number;
    private musicaDetetive?:number;

    iniciarMusica():void {
        if(this.aguardandoNovaFase)this.aguardandoNovaFase=false;
        if(this.timer)return;
        this.modo='sintetica';
        this.iniciarSintetica();
    }
    tocarEstrela():void {
        this.pararEstrela();
        const externaTocava=Boolean(this.externa&&!this.externa.paused);
        this.externa?.pause();
        const sinteticaTocava=Boolean(this.timer);this.pararSintetica();
        this.musicaPausadaPelaEstrela=externaTocava||sinteticaTocava;
        this.estrela=new Audio(ESTRELA);this.estrela.volume=.4;this.estrela.loop=true;this.estrela.playbackRate=1.3;
        void this.estrela.play().catch(()=>this.pararEstrela());
    }
    pararEstrela():void {
        if(this.estrela){this.estrela.pause();this.estrela.currentTime=0;this.estrela.src='';this.estrela=undefined;}
        if(!this.musicaPausadaPelaEstrela)return;
        this.musicaPausadaPelaEstrela=false;
        if(this.aguardandoNovaFase)return;
        if(this.modo==='zelda'&&this.externa)void this.externa.play();
        else this.iniciarSintetica();
    }
    tocarVitoria():void {
        this.aguardandoNovaFase=true;
        if(this.estrela){this.estrela.pause();this.estrela.currentTime=0;this.estrela.src='';this.estrela=undefined;}
        this.musicaPausadaPelaEstrela=false;
        this.externa?.pause();this.pararSintetica();
        this.comemorarVitoria();
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
    iniciarMusicaReino():void {
        if(this.musicaReino)return;this.contexto??=new AudioContext();void this.contexto.resume();let passo=0;const notas=[261.63,329.63,392,440,392,329.63,293.66,349.23];
        const tocar=()=>{if(!this.contexto)return;this.nota(notas[passo++%notas.length],0,'sine',.025,.55);};tocar();this.musicaReino=window.setInterval(tocar,620);
    }
    pararMusicaReino():void {if(this.musicaReino){window.clearInterval(this.musicaReino);this.musicaReino=undefined;}}
    iniciarMusicaDetetive():void {if(this.musicaDetetive)return;this.contexto??=new AudioContext();void this.contexto.resume();let passo=0;const notas=[293.66,349.23,440,392,329.63,392,466.16,349.23];const tocar=()=>{if(this.contexto)this.nota(notas[passo++%notas.length],0,passo%3?'sine':'triangle',.022,.48);};tocar();this.musicaDetetive=window.setInterval(tocar,560);}
    pararMusicaDetetive():void {if(this.musicaDetetive){window.clearInterval(this.musicaDetetive);this.musicaDetetive=undefined;}}
    efeito(tipo:'bolinha'|'comida'|'letra'|'erro'|'gato'|'vitoria'|'pulo'|'moeda'|'espada'|'acerto'|'porta'|'dano'|'conclusao'|'pista'|'caderno'|'dialogo'|'caso'):void {
        this.contexto??=new AudioContext();void this.contexto.resume();
        const seq={bolinha:[880],comida:[523,659,784],letra:[659,784,988],erro:[392,349],gato:[180,145],vitoria:[523,659,784,1047],pulo:[330,520],moeda:[740,988],espada:[280,520],acerto:[440,660],porta:[330,440,660],dano:[180,145],conclusao:[523,659,784,1047],pista:[659,880,1047],caderno:[440,554],dialogo:[523,659],caso:[523,659,784,1047,1318]}[tipo];
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
    private comemorarVitoria():void {
        this.contexto??=new AudioContext();
        void this.contexto.resume().then(()=>{
            // Subida alegre seguida de um acorde final amplo, sem ficar estridente.
            const melodia:[number,number,number][]=[
                [523.25,0,.34],[659.25,.16,.34],[783.99,.32,.38],[1046.5,.5,.62],
                [659.25,.82,.72],[783.99,.82,.72],[1046.5,.82,.82]
            ];
            melodia.forEach(([frequencia,atraso,duracao],indice)=>
                this.nota(frequencia,atraso,indice<4?'sine':'triangle',indice<4?.13:.075,duracao)
            );
        });
    }
    private nota(f:number,atraso:number,forma:OscillatorType,volume:number,duracao=.3):void {if(!this.contexto)return;const agora=this.contexto.currentTime+atraso,osc=this.contexto.createOscillator(),ganho=this.contexto.createGain();osc.type=forma;osc.frequency.setValueAtTime(f,agora);ganho.gain.setValueAtTime(volume,agora);ganho.gain.exponentialRampToValueAtTime(.001,agora+duracao);osc.connect(ganho).connect(this.contexto.destination);osc.start(agora);osc.stop(agora+duracao+.02);}
}
export const audioJogo=new SistemaAudio();
