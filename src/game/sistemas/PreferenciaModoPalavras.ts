import { ModoPalavras } from '../dados/palavras';

const CHAVE_MODO_PALAVRAS = 'ratoletrando:modo-palavras';
const MODOS_VALIDOS: ModoPalavras[] = ['ate4', 'ate5', 'aleatorio'];

export class PreferenciaModoPalavras {
    static obter(): ModoPalavras {
        try {
            const valor = localStorage.getItem(CHAVE_MODO_PALAVRAS);
            if (valor && (MODOS_VALIDOS as string[]).includes(valor)) return valor as ModoPalavras;
        } catch { /* O jogo continua com o modo padrao. */ }
        return 'ate4';
    }

    static definir(modo: ModoPalavras): void {
        try { localStorage.setItem(CHAVE_MODO_PALAVRAS, modo); } catch { /* O jogo continua sem persistencia. */ }
    }
}
