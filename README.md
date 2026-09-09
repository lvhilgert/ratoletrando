# EducApp / RatoLetrando

Plataforma de jogos educativos 2D para crianças de 6 a 8 anos. Reúne oito experiências de linguagem, matemática e exploração, incluindo RatoLetrando, Reino das Portas e Detetive Mirim.

## Stack

- Phaser 4 e Arcade Physics
- TypeScript
- Vite
- Arte raster local; HTML/CSS não desenha elementos dos jogos

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

- `src/game/cenas`: ciclo de vida, composição e transição das cenas.
- `src/game/entidades`: personagens e atores com movimento próprio.
- `src/game/sistemas`: regras, carregamento por domínio, física e UI raster compartilhada.
- `src/game/dados`: fases, exercícios e conteúdo declarativo.
- `public/assets`: imagens e spritesheets locais, separados por jogo.

O mapa completo está em [`ARQUITETURA.md`](ARQUITETURA.md). Toda mudança relevante segue [`PROCESSO_DESENVOLVIMENTO.md`](PROCESSO_DESENVOLVIMENTO.md): Especificação → Implementação → Validação.

## Criar ou ajustar fases

Edite `src/game/dados/fases.ts`. Cada fase define palavra, matriz do mapa, letras incorretas, quantidades, pontos e posições iniciais. `0` representa corredor e `1` representa parede. As velocidades são configuradas em `velocidadeRato` e `velocidadeGato`; não há valores de dificuldade presos à cena.

## Verificar

```bash
npx tsc --noEmit
npm run build
npm run test:arte
```

Os demais testes automatizados estão listados em `package.json`.
