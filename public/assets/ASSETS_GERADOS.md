# Assets gerados localmente

Registro de procedência dos PNGs adicionados na refatoração arquitetural de 2026-09-07.

## Arte ilustrativa

Gerada com a ferramenta de imagem integrada, sem download externo, em estilo de jogo infantil 2D vibrante, composição limpa, sem texto e sem personagens quando não solicitados:

- `compartilhados/educapp-fundo.png`: parque escolar acolhedor, espaço central livre para o catálogo.
- `compartilhados/minijogos-fundo.png`: cenário lúdico de sala/parque com baixa complexidade atrás da UI.
- `detetive-mirim/fundo-sala-leitura.png`: sala de leitura infantil para investigação.
- `detetive-mirim/fundo-gramado.png`, `fundo-escorregador.png`, `fundo-balancos.png`, `fundo-caixa-areia.png`: áreas externas escolares, horizonte e chão consistentes.
- `ratoletrando/jogo/queijo.png`: queijo amarelo isolado, fundo transparente.
- `ratoletrando/jogo/bolinha.png`: bola infantil colorida isolada, fundo transparente.
- `reino-portas/fundo-neve.png`: panorama original dos Picos das Trilhas com vale gelado e aurora.
- `reino-portas/objetos-neve.png`: folha 2 x 2 com bloco de gelo, bola de neve, placa de trilha e floco.
- `reino-portas/personagens/pinguim-sentinela/pinguim-sentinela-estados.png`: seis poses de patrulha, antecipação, ataque e recuperação.
- `reino-portas/personagens/gnomo-neveiro/gnomo-neveiro-estados.png`: seis poses de espera, mira, lançamento e recuperação.
- `reino-portas/personagens/guardiao-mamute/guardiao-mamute-estados.png`: seis poses de espera, preparação, investida e recuperação.

Os assets de neve possuem procedência detalhada em `reino-portas/source-neve.json` e nos `source.json` de cada personagem.

## Expansão do Reino — fases 10 a 12

- `reino-portas/fundo-costa.png`, `fundo-ruinas-lua.png` e `fundo-canion.png`: panoramas originais dos novos biomas.
- `reino-portas/objetos-expansao.png`: atlas 4 x 3 de mecanismos e transformações ambientais.
- `reino-portas/personagens/*`: folhas de quatro poses dos oito novos personagens, com procedência individual.

A criação original, dimensões e ausência de referências externas estão registradas em `reino-portas/source-expansao.json` e nos `source.json` individuais.

## Arte técnica

Gerada deterministicamente por `scripts/gerar-ui-primitivos.mjs`, usando Canvas apenas como ferramenta de autoria do PNG; o jogo consome somente os arquivos raster:

- `compartilhados/ui-painel.png`, `ui-botao.png`, `ui-circulo.png`, `ui-barra.png`.
- `compartilhados/ui-speaker.png`, `ui-speaker-off.png`, `ui-lock.png`, `ui-plus.png`.
- `reino-portas/reino-espada-cristal.png`: espada de cristal isolada e com margem transparente.
