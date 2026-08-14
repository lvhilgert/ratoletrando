# Ratoletrando

Jogo infantil 2D de exploração e alfabetização. Controle um ratinho, explore os corredores, colete alimentos e encontre na ordem as letras que formam a palavra de cada fase. O gato pode alcançar o rato, mas não há morte, vidas ou perda de progresso.

## Stack

- Phaser 4 e Arcade Physics
- TypeScript
- Vite
- Sem React e sem assets externos

## Executar

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

## Controles

Use as setas do teclado ou WASD. O mapa contém somente as letras da palavra; colete-as na ordem indicada no topo. Letras futuras apenas exibem uma dica amigável e permanecem no lugar.

## Estrutura

- `src/game/cenas`: carregamento, menu, jogo e fim de fase.
- `src/game/entidades`: rato, gato e itens coletáveis.
- `src/game/sistemas`: palavra, pontuação e busca de caminho BFS.
- `src/game/dados/fases.ts`: configuração das cinco fases.
- `src/game/tipos`: contratos TypeScript do jogo.

## Criar ou ajustar fases

Edite `src/game/dados/fases.ts`. Cada fase define palavra, matriz do mapa, letras incorretas, quantidades, pontos e posições iniciais. `0` representa corredor e `1` representa parede. As velocidades são configuradas em `velocidadeRato` e `velocidadeGato`; não há valores de dificuldade presos à cena.

## Limitações atuais

O MVP usa formas geradas, oferece apenas o gato normal, teclado no desktop e não persiste progresso. A arquitetura permite adicionar sprites, áudio, controles touch e novos comportamentos de gato posteriormente.
