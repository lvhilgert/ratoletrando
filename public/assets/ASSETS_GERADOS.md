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

## Arte técnica

Gerada deterministicamente por `scripts/gerar-ui-primitivos.mjs`, usando Canvas apenas como ferramenta de autoria do PNG; o jogo consome somente os arquivos raster:

- `compartilhados/ui-painel.png`, `ui-botao.png`, `ui-circulo.png`, `ui-barra.png`.
- `compartilhados/ui-speaker.png`, `ui-speaker-off.png`, `ui-lock.png`, `ui-plus.png`.
- `reino-portas/reino-espada-cristal.png`: espada de cristal isolada e com margem transparente.
