const CHAVE_PONTUACAO = 'ratoletrando:pontuacao-acumulada';

export class PontuacaoAcumulada {
    static obter(): number {
        try {
            const valor = Number.parseInt(localStorage.getItem(CHAVE_PONTUACAO) ?? '0', 10);
            return Number.isFinite(valor) && valor >= 0 ? valor : 0;
        } catch {
            return 0;
        }
    }

    static adicionar(pontos: number): number {
        const total = this.obter() + Math.max(0, pontos);
        try { localStorage.setItem(CHAVE_PONTUACAO, String(total)); } catch { /* O jogo continua sem persistencia. */ }
        return total;
    }
}
