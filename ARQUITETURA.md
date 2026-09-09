# Arquitetura do EducApp

Este arquivo é o mapa operacional do repositório. Atualize-o quando uma responsabilidade mudar de lugar.

## Desenvolvimento orientado por especificação

Cada pedido do usuário inicia uma especificação. O processo completo está em [PROCESSO_DESENVOLVIMENTO.md](PROCESSO_DESENVOLVIMENTO.md), e mudanças não triviais usam [specs/TEMPLATE.md](specs/TEMPLATE.md).

```text
Especificação -> Implementação -> Validação
       ^                    |
       └── correção <───────┘
```

- A IA toma decisões de baixo, médio e alto nível e executa o plano sem pedir aprovação intermediária.
- Se o usuário pedir somente planejamento, a execução para no plano.
- Uma descoberta que continue dentro do objetivo é incorporada ao plano e executada.
- Uso de internet, eliminação material ou mudança de comportamento existente fora do objetivo interrompem o fluxo para autorização explícita.
- Um pedido explícito de feature ou correção já autoriza os comportamentos necessários àquele resultado; não autoriza mudanças colaterais.
- O plano é proporcional ao risco: pode ficar na resposta para mudanças pequenas e deve atualizar `PLANO_REFATORACAO.md` quando alterar a sequência arquitetural do projeto.
- Antes de especificar, consulte [ERROS_COMUNS.md](ERROS_COMUNS.md); uma falha já conhecida vira critério de aceite e teste, não apenas recomendação.

## Fluxo de inicialização

`index.html` -> `src/main.ts` -> `src/game/main.ts` -> `Carregamento` -> `EducApp` -> jogo escolhido.

- `src/game/main.ts`: configuração Phaser, resolução 960 x 640 e registro de todas as cenas.
- `src/game/cenas/Carregamento.ts`: carga apenas do shell e dos recursos necessários ao catálogo.
- `src/game/cenas/EducApp.ts`: catálogo e entrada dos oito jogos.
- `src/game/sistemas/AssetsEducApp.ts`: manifestos de carga por domínio e preparação das animações.
- `src/game/sistemas/ArteRaster.ts`: composição mínima de painéis, botões, círculos, barras e linhas a partir de PNGs.
- `src/services/`: preferências de áudio/voz e síntese de voz compartilhadas.
- `src/game/sistemas/SistemaAudio.ts`, `ConfirmacaoSaida.ts` e `ModalConclusao.ts`: comportamento compartilhado entre cenas.

## Onde procurar por jogo

| Área | Cenas | Regras/dados/entidades |
| --- | --- | --- |
| RatoLetrando | `Menu.ts`, `Jogo.ts`, `FimDaFase.ts` | `Rato.ts`, `Gato.ts`, `ItemColetavel.ts`, `fases.ts`, `palavras.ts`, `SistemaCaminho.ts`, `SistemaPalavra.ts`, `SistemaPontuacao.ts` |
| Ouvi e Escrevi | `OuviEscrevi.ts` | `exerciciosOuviEscrevi.ts`, `ServicoVoz.ts` |
| MontaPalavra | `MontaPalavra.ts` | `palavrasMontaPalavra.ts` |
| ContaComigo | `ContaComigo.ts` | `configuracaoContaComigo.ts` |
| SomaTrilha | `SomaTrilha.ts` | `configuracaoSomaTrilha.ts` |
| MemóLetras | `MemoLetras.ts` | `associacoesMemoLetras.ts` |
| Reino das Portas | `ConfiguracaoReino.ts`, `ReinoDasPortas.ts`, `VooDragaoReino.ts` | `HudReino.ts`, `CriarInimigoReino.ts`, `EstadoAventuraReino.ts`, `LevelReino.ts`, `MoedasReino.ts`, `NiveisExpansaoReino.ts`, `MecanismosExpansaoReino.ts`, arquivos `*Reino.ts`, `mundoReinoPortas.ts`, `catalogoPalavrasReino.ts`, `TerrestreReino.ts` e `MovimentoVooDragao.ts` |
| Detetive Mirim | `CasosDetetive.ts`, `FaseDetetive.ts` | `dados/casos/`, `casosDetetive.ts`, `tiposDetetive.ts`, `DetetiveJogador.ts`, `ProgressoDetetive.ts` |

Pastas-base:

- `src/game/cenas/`: orquestra ciclo de vida, câmera, composição e transição de cenas.
- `src/game/entidades/`: atores com estado/movimento próprios.
- `src/game/sistemas/`: regras reutilizáveis, progresso, física e renderização especializada.
- `src/game/dados/`: conteúdo declarativo e tipos de domínio; não deve conhecer cenas.
- `public/assets/<jogo>/`: imagens raster e spritesheets do jogo.
- `public/assets/<jogo>/personagens/<personagem>/`: saída final distribuída de personagens quando o jogo não possuir convenção mais específica; inclui `source.json` de procedência.
- `referencias/movimentos/<movimento>/<referencia>/`: biblioteca local sob demanda de referências permitidas e seus metadados; material marcado como referência apenas nunca entra no build.
- `.agents/skills/personagem-generator/`: processo especializado para design, pesquisa de movimento, licença, produção, validação e integração de personagens 2D.
- `src/game/sounds/`: áudio atual; novos arquivos devem manter uma localização única e previsível.

## Direção das dependências

```text
cenas ──> entidades ──> sistemas compartilhados
  │            │
  ├────────> sistemas ──> dados / services
  └────────────────────> dados / services
```

- Dados não importam cenas.
- Um jogo não importa cenas, entidades ou dados internos de outro jogo.
- Uma cena decide “quando”; sistemas implementam regras; entidades implementam comportamento do ator; dados descrevem conteúdo.
- Código compartilhado só nasce depois do segundo uso real. Não crie abstrações preventivas.

## Modelo terrestre 2D

No Reino das Portas, o chão é uma superfície física, não uma coordenada visual solta:

- `GeometriaTerrestre.ts` mede os limites opacos e o topo apoiável dos assets.
- `TerrestreReino.ts` cria superfícies, encontra a superfície abaixo e alinha base visual e corpo físico.
- Atores terrestres usam `configurarAtorTerrestre` e `alinharCorpoTerrestre`.
- Props apoiados ou enraizados usam `superficieAbaixo` e `assentarTerrestre`.
- Elementos suspensos precisam declarar na spec o suporte ou a intenção de flutuar.

Não replique esse cálculo em cenas ou entidades. Amplie o sistema compartilhado quando surgir um caso terrestre ainda não coberto.

## Guia rápido para pedidos

| Pedido | Comece por | Verifique também |
| --- | --- | --- |
| Novo jogo/cartão | `EducApp.ts`, `main.ts` | nova cena, dados e assets próprios |
| Alterar fase do RatoLetrando | `fases.ts`, `Jogo.ts` | caminho, palavra, pontuação e entidades |
| Alterar mapa/bioma do Reino | `mundoReinoPortas.ts`, `LevelReino.ts` | `ReinoDasPortas.ts`, `TerrestreReino.ts` |
| Alterar combate/inimigo do Reino | entidade `*Reino.ts` | criação, colisões e progressão em `ReinoDasPortas.ts` |
| Alterar desafio pedagógico do Reino | `DesafiosReino.ts` | `RenderizadorDesafioReino.ts`, catálogo e testes |
| Alterar voo do dragão | `VooDragaoReino.ts` | `MovimentoVooDragao.ts` e teste correspondente |
| Alterar caso do Detetive | `dados/casos/` | catálogo, tipos, `FaseDetetive.ts` e progresso |
| Alterar áudio/voz | `SistemaAudio.ts` ou `src/services/` | preferências persistidas e todas as cenas consumidoras |
| Adicionar imagem/sprite | pasta do jogo em `public/assets/` | `AssetsEducApp.ts`, dimensões de frame e animações |
| Criar personagem ou nova animação | skill `personagem-generator` e asset oficial existente | biblioteca de movimentos, licença, loader, entidade, chão e animações |

## Estado persistente

As implementações que leem/escrevem `localStorage` ficam em:

- `PontuacaoAcumulada.ts`
- `PreferenciaModoPalavras.ts`
- `ProgressoReino.ts`
- `ProgressoDetetive.ts`
- `src/services/PreferenciaAudio.ts`
- `src/services/PreferenciaVoz.ts`

Trate suas chaves e formatos como contrato. Uma mudança exige fallback para saves antigos ou uma migração planejada.

## Pontos de atenção atuais

- `ReinoDasPortas.ts` ainda coordena o mundo, mas HUD, criação de inimigos e estado de aventura já possuem módulos próprios.
- As fases autorais 10–12 vivem em `NiveisExpansaoReino.ts`; suas regras de restauração e mecanismos concretos ficam em `RegrasMecanismosExpansaoReino.ts` e `MecanismosExpansaoReino.ts`.
- O catálogo carrega somente seus recursos; RatoLetrando, Reino e Detetive completam a carga ao entrar em seus respectivos domínios.
- Arte permanente usa imagens raster. `npm run test:arte` impede novas primitivas visíveis sem uma exceção explícita permitida por `AGENTS.md`.
- O template legado `src/game/scenes/` foi removido após busca confirmar zero importadores; toda cena ativa vive em `src/game/cenas/` e é registrada por `src/game/main.ts`.
- `README.md`, `CLAUDE.md` e as instruções do GitHub têm descrições divergentes do produto. `AGENTS.md` e este mapa são a referência atual para o Codex.
