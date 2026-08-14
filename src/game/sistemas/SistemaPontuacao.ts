export class SistemaPontuacao {
    private valor = 0;
    adicionar(pontos: number): number { this.valor += pontos; return this.valor; }
    get total(): number { return this.valor; }
}
