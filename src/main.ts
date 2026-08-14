import StartGame from './game/main';

document.addEventListener('DOMContentLoaded', () => {

    const game=StartGame('game-container');
    // Facilita diagnóstico automatizado sem alterar a jogabilidade.
    (window as typeof window & { __ratoletrando?: typeof game }).__ratoletrando=game;

});
