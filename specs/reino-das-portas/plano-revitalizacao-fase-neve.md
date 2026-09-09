# Reino das Portas — plano de revitalização e fase de neve

Status: Implementação — aguardando autorização dos assets remotos

Data da pesquisa: 2026-09-08

Princípios compartilhados: [Princípios para construção e revitalização de fases](PRINCIPIOS_CONSTRUCAO_FASES.md).

## Resultado para a criança

A criança atravessa uma nova fase de neve que realmente sobe uma montanha. Em três momentos ela escolhe como avançar: uma rota mais protegida, uma rota mais rápida e arriscada ou um desvio de exploração. Os inimigos mostram o que vão fazer antes de atacar, podem ser evitados sem combate obrigatório e interagem com paredes, desníveis e plataformas. As três portas educativas continuam sendo a regra central do Reino.

Nome de trabalho da fase: **Picos das Trilhas** (fase 9, adicionada ao fim da jornada existente).

## Objetivo deste documento

Definir uma nova linguagem de fase para o Reino das Portas e prová-la somente em Picos das Trilhas. As oito fases atuais não serão redesenhadas neste ciclo. A fase de neve será o laboratório para decidir, depois de testada, quais ideias merecem voltar ao restante do jogo.

## Situação atual observada no projeto

O Reino já possui uma base aproveitável:

- cavaleiro com corrida, pulo variável, pulo duplo, coyote time, salto guardado, dash, defesa, ataque corpo a corpo e arco;
- três portas educativas obrigatórias, objetivo ambiental, guardião, portal, checkpoints e persistência;
- superfícies terrestres centralizadas, plataformas atravessáveis, móveis, quebráveis e de impulso;
- inimigos com patrulha, mergulho, salto preparado, investida, tiro e estados de vulnerabilidade;
- nível determinístico por seed e trechos declarativos.

O problema não é ausência absoluta de sistemas, mas a composição atual:

- o mundo físico mede `6200 x 720`, a câmera mede `6200 x 640` e não tem espaço vertical real para acompanhar;
- todo o terreno nasce em torno de `y = 550`; as plataformas válidas ficam entre `y = 300` e `530`, portanto quase toda a fase cabe na mesma tela;
- a câmera segue principalmente no eixo horizontal e a queda é tratada em `y > 620`;
- portas, portal, barreiras, perigos e vários objetos pressupõem alturas fixas;
- checkpoints guardam apenas `x`; uma retomada não sabe em qual andar a criança estava;
- a barra de progresso usa apenas `x`, o que não representa uma escalada;
- “rota alta” hoje é um pequeno desvio com plataformas, não uma escolha sustentada;
- inimigos terrestres são assentados pela superfície em `x`, mas sua distribuição é uma lista essencialmente horizontal;
- há comportamentos bons individualmente, porém poucos encontros combinam inimigo, relevo e alternativa de passagem.

Conclusão: não é necessário criar um jogo ou um framework de níveis novo. A menor mudança correta é uma configuração especial, autoral e declarativa para a fase de neve, reutilizando a cena, o cavaleiro, o combate, as portas e os sistemas terrestres atuais.

## Análise das referências

### Donkey Kong Country (SNES)

#### Regras de jogo relevantes

- O objetivo principal de cada fase é chegar à saída; bônus, letras e atalhos recompensam exploração sem substituir esse objetivo claro.
- Movimento, inimigos e cenário formam uma corrente: correr/rolar, quicar em inimigos e entrar em barris pode manter o fluxo em vez de interrompê-lo.
- Barris não são só decoração: podem ser projétil, chave para paredes secretas, checkpoint ou transporte com direção e timing próprios.
- Companheiros mudam as possibilidades de movimento e combate sem exigir que todo o jogo seja reconstruído em torno deles.
- Uma fase costuma destacar uma ideia ambiental ou mecânica reconhecível e desenvolvê-la até o fim.
- O segundo personagem funciona como margem de erro; o barril intermediário reduz a repetição após falha.

#### O que o diferencia

- Prioriza **fluxo corporal e momentum**. Um jogador experiente lê a sequência e atravessa encontros quase como uma coreografia.
- O cenário tem arco dramático próprio. Em Snow Barrel Blast, o céu claro vira neve leve, depois neve forte e nevasca; encostas, abismos e barris-canhão sustentam o tema.
- Segredos frequentemente ficam fora da linha óbvia e alguns viram atalhos reais, não apenas salas de prêmio.
- A animação procura comunicar peso e personalidade; a equipe da Rare iterou tanto movimento quanto camadas atmosféricas.

#### O que trazer para o Reino

- Uma linha rápida que recompense domínio de pulo/dash sem ser obrigatória.
- Moedas e sinais visuais desenhando arcos de movimento e revelando desvios.
- Um arco climático da base calma ao cume com nevasca, mantendo contraste e leitura.
- Obstáculos que também sejam ferramentas: bloco de gelo como degrau/cobertura e inimigo atordoado pela parede.
- Checkpoint após cada grande trecho de escalada, não apenas por distância horizontal.

#### O que não copiar

- Não copiar barris, personagens, layouts, sprites ou sequências reconhecíveis.
- Não importar a precisão punitiva dos últimos barris de Snow Barrel Blast.
- Nevasca nunca encobre plataforma, projétil ou antecipação de ataque.

Fontes: [entrevista sobre fluxo com Gregg Mayles e a equipe](https://www.videogameschronicle.com/news/donkey-kong-country-team-reflects-on-the-games-25th-anniversary/), [produção, animação e atmosfera de Donkey Kong Country](https://www.nintendolife.com/news/2014/02/month_of_kong_the_making_of_donkey_kong_country), [estrutura de Snow Barrel Blast](https://www.mariowiki.com/Snow_Barrel_Blast) e [manual oficial do SNES Classic](https://www.nintendo.com/es-es/games/oms/snes-classic/manuals/dk-country/manual.pdf).

### Super Mario World (SNES)

#### Regras de jogo relevantes

- Correr, pular com altura variável, girar, carregar objetos, usar capa e montar Yoshi produzem várias soluções com poucos comandos.
- Inimigos e objetos combinam: casco vira projétil, bloco revela item, mola abre altura, interruptor altera travessia.
- Saídas secretas modificam o mapa e tornam a exploração uma forma de progresso.
- Switch Palaces tornam cursos posteriores mais fáceis; o próprio jogador escolhe conquistar essa assistência.
- Moedas, plataformas e inimigos ensinam onde olhar, quando saltar e o que pode ser alcançado.
- Uma ideia aparece em forma simples, ganha variações e só depois é combinada com outras ideias.

#### O que o diferencia

- Prioriza **expressão e escolha**: o mesmo espaço aceita uma solução segura e outra habilidosa.
- A dificuldade pode ser reduzida por ações dentro do próprio jogo, sem separar a criança num “modo inferior”.
- O conteúdo é introduzido por ação, não por tutorial longo.
- A função deve ser legível na aparência: o jogador precisa inferir rapidamente o que é plataforma, perigo, inimigo ou ferramenta.

#### O que trazer para o Reino

- Três bifurcações claras, cada uma com duas passagens completas que voltam a se encontrar antes de uma porta.
- Estrutura “apresentar → variar → combinar” para gelo, parede escalonada e plataforma móvel.
- Uma rota baixa, mais longa e protegida; uma rota alta, mais curta e exigente; recompensas opcionais indicam que ambas são intencionais.
- Ajuda contextual incorporada ao espaço: setas raster, moedas e pegadas; no máximo uma frase curta na primeira ocorrência.
- Sem caminho falso: toda entrada que parece rota precisa levar a progresso, recompensa ou retorno claramente sinalizado.

#### O que não copiar

- Não ampliar agora o conjunto de verbos do herói com capa, montaria, voo ou wall-jump.
- Não criar saídas secretas no mapa-múndi neste primeiro experimento.
- Não esconder uma regra obrigatória longe do lugar em que ela atua.

Fontes: [entrevista de 1990 com a equipe de Super Mario World](https://shmuplations.com/supermarioworld/), [entrevista Nintendo sobre iteração diária de mapas](https://iwataasks.nintendo.com/interviews/wii/mario25th/4/3/), [análise de iteração e acumulação dos temas](https://thegamedesignforum.com/features/RD_SMW_5.html), [análise de progressão vertical](https://thegamedesignforum.com/features/RD_SMW_10.html) e [manual oficial do SNES Classic](https://www.nintendo.com/es-es/games/oms/snes-classic/manuals/super-mario-world/manual.pdf).

### Mega Man 7 (SNES)

#### Regras de jogo relevantes

- O núcleo combina movimento preciso com combate: pular, deslizar, disparar e carregar o tiro.
- Chefes concedem armas; ferramentas de Rush e armas especiais também resolvem travessia, acesso e segredos.
- Inimigos funcionam como padrões de estado: aproximação, antecipação, ataque, intervalo e vulnerabilidade.
- A geometria define o combate: altura da plataforma, teto, fosso, escada e cobertura mudam a resposta correta.
- Vida, energia de armas, itens e checkpoints permitem administrar risco dentro da fase.

#### O que o diferencia

- Prioriza **leitura de padrão e domínio de ferramentas**. O inimigo é um pequeno problema espacial, não só algo caminhando em direção ao herói.
- Os encontros alternam plataforma e combate, às vezes os combinando num único teste.
- Freeze Man Stage usa piso gelado, plataformas frágeis, inimigos que soltam gelo e rotas/itens dependentes de leitura vertical.

#### O que trazer para o Reino

- Ataques com três tempos inequívocos: aviso, perigo e recuperação.
- Inimigos que respondem ao ambiente: investidor bate na parede; arremessador perde linha de tiro atrás de cobertura; guardião abre janela após errar um golpe.
- Combate evitável por rota ou timing, mas gratificante quando a criança entende o padrão.
- Encontros compostos de no máximo dois papéis por vez nesta fase: por exemplo, investidor no chão + arremessador em patamar.

#### O que não copiar

- Não criar tabela de fraquezas, energia de armas ou oito chefes.
- Não usar sprites tão grandes que reduzam a visibilidade e o tempo de reação.
- Não lançar inimigo rápido quando ele entra na tela; todo ataque nasce visível e antecipado.
- Não criar prêmio de tentativa única. Plataforma quebrável e item reaparecem após falha.

Fontes: [manual de Mega Man 7](https://www.videogamemanual.com/snes/Mega%20Man%207%20%28USA%29.pdf), [análise crítica de Freeze Man Stage](https://themmnetwork.com/2015/07/03/a-critical-look-at-mega-man-7-stages-freeze-man/), [guia estrutural de Freeze Man Stage](https://strategywiki.org/wiki/Mega_Man_7/Freeze_Man) e [entrevista da Capcom com um programador de Mega Man 7](https://www.capcom.co.jp/ir/english/interview/2018/vol01.html).

## Síntese: nova perspectiva para o Reino

Cada trecho da fase deve responder a quatro perguntas:

1. **Qual verbo está sendo praticado?** Pular, escolher rota, usar cobertura, esperar, atacar ou mover um bloco.
2. **O que a criança consegue prever?** Ameaças e plataformas comunicam seu próximo estado antes de agir.
3. **Que escolha existe?** Ao menos duas formas honestas de atravessar os encontros principais.
4. **Como o cenário conta a subida?** Altura, clima, composição e som mostram base, paredão, crista e cume.

Regra de ouro: verticalidade não é empilhar plataformas. É fazer a criança **escolher, subir, enxergar de onde veio e usar alturas diferentes para resolver o mesmo problema**.

## Escopo

### Inclui

- adicionar a fase 9, Picos das Trilhas, sem redesenhar as oito fases atuais;
- mundo de `6200 x 1440`, equivalente a 2,25 alturas da viewport lógica de 640 px;
- câmera com acompanhamento vertical suave e enquadramento preditivo limitado;
- layout autoral/determinístico exclusivo da neve, com três bifurcações e reconexões;
- paredes, saliências, túnel, bloco de gelo deslizante, plataformas móveis e plataformas quebráveis recuperáveis;
- gelo localizado com menor tração, claramente identificado, sem tornar toda a fase escorregadia;
- três portas educativas existentes, posicionadas em pontos de reconexão;
- checkpoints que persistem posição vertical;
- três personagens inimigos originais: Pinguim Sentinela, Gnomo Neveiro e Guardião Mamute;
- assets raster de cenário, obstáculos, perigos, interface específica indispensável e personagens;
- adaptação mínima do seletor para exibir nove fases;
- testes de geometria, rotas, persistência, estados inimigos e validação visual.

### Não inclui

- refazer fases 1 a 8;
- alterar os desafios pedagógicos configuráveis;
- wall-jump, escalada agarrada, voo, nova arma ou nova árvore de habilidades;
- mundo procedural vertical genérico para todos os biomas;
- saídas secretas que alterem o mapa da campanha;
- sistema elemental, tabela de fraquezas ou inventário novo;
- download ou incorporação de sprites dos jogos de referência.

## Regras de negócio da fase de neve

### Vitória e progresso

- A saída abre quando as três portas educativas estiverem abertas, o objetivo ambiental estiver concluído e o Guardião Mamute tiver sido superado.
- Inimigos comuns não são obrigatórios para concluir; “passar por eles” pode significar derrotar, desviar, esperar ou escolher outra rota.
- Cada bifurcação volta a se unir antes da próxima porta, evitando que a criança perca uma obrigação sem perceber.
- A gema e o pergaminho são opcionais e ficam em rotas diferentes; nenhuma escolha bloqueia permanentemente a outra.
- Plataformas quebráveis e itens reiniciam após falha ou reentrada no trecho.

### Falha e recuperação

- Cair devolve ao último piso seguro ou checkpoint, preservando o comportamento de vidas configurado.
- Há checkpoint após a porta 1 e após a porta 2; ambos salvam `x` e `y`/identidade da superfície.
- O save `educapp:reino-portas:v2` permanece compatível: saves antigos sem altura reaparecem no piso seguro correspondente ao `x`.
- A criança nunca reaparece sobre gelo em movimento, plataforma quebrável, perigo, inimigo ou rota sem saída.

### Rotas

- Cada uma das três bifurcações oferece duas rotas principais visíveis na mesma zona de decisão.
- Rota protegida: mais larga, mais longa, com cobertura e menor risco de queda.
- Rota ágil: mais curta, usa altura/plataforma móvel e oferece mais moedas, mas nunca exige precisão de um único frame.
- Um pequeno desvio de exploração pode existir, mas sempre retorna à rota de origem e é sinalizado por moedas/pegadas.
- Nenhuma rota depende de derrotar todos os inimigos, possuir equipamento comprado ou usar pulo duplo no limite máximo.
- Toda rota obrigatória é completável apenas com corrida e pulo básico; dash, pulo duplo, arco e poções dão vantagem, não permissão.

### Inimigos

- Todo ataque perigoso possui antecipação audiovisual mínima de 400 ms e uma janela de recuperação.
- Um inimigo não inicia ataque fora da câmera nem nos primeiros 300 ms após entrar na área visível.
- Projéteis contrastam com fundo, neve e HUD e não nascem dentro do corpo do cavaleiro.
- Dois inimigos só são combinados quando suas respostas são compatíveis; não cruzar projétil rápido com salto cego sobre abismo.
- Contato com o cavaleiro mantém as regras atuais de defesa, invulnerabilidade, dano e golpe por cima.
- Derrota usa linguagem não gráfica: atordoamento, estrelas e saída/afundamento na neve.

### Neve, gelo e obstáculos

- Neve é terreno normal; gelo é uma faixa azul brilhante com borda e reflexo próprios.
- No gelo, a aceleração/frenagem horizontal muda, mas pulo e ataque continuam responsivos.
- Parede alta nunca exige nova ação: saliências, bloco móvel ou elevador mostram como subi-la.
- Bloco de gelo desliza somente num eixo e para em batentes visíveis; serve como degrau e cobertura.
- Plataforma móvel pausa brevemente em cada extremidade e tem trajetória indicada no cenário.
- Plataforma quebrável avisa por rachadura/tremor, cai depois e reaparece; não remove prêmio de modo permanente.
- Nevasca é atmosfera progressiva, não penalidade de visão. A opacidade máxima será definida por teste de legibilidade.

## Mapa macro da fase

Dimensões: `6200 x 1440`. A viewport continua `960 x 640`. A base jogável começa perto de `y = 1260`; o portal final fica perto de `y = 220`.

| Trecho | Faixa aproximada | Altura | Ideia principal | Escolha |
| --- | --- | --- | --- | --- |
| 1. Abrigo da Base | x 0–850 | y 1260–1120 | apresentar neve normal, gelo localizado e Pinguim isolado | esperar o dash ou subir no primeiro ressalto |
| 2. Muralha Branca | x 850–2200 | y 1180–900 | saliências, bloco de gelo e primeira porta | túnel protegido ou crista rápida |
| 3. Poço dos Elevadores | x 2200–3650 | y 980–570 | subida vertical, plataformas móveis e Gnomo Neveiro | escada larga com cobertura ou elevador central |
| 4. Crista da Nevasca | x 3650–5150 | y 650–300 | combinar gelo, plataforma recuperável e dois papéis inimigos | passagem interna ou crista exposta |
| 5. Cume da Aurora | x 5150–6200 | y 320–180 | arena do Guardião Mamute e portal | arena única, com dois níveis e cobertura |

### Bifurcação 1 — parede e túnel

- A rota baixa passa por um túnel largo, usa duas coberturas contra bolas de neve e chega à porta 1.
- A rota alta usa saliências fixas e um bloco de gelo como degrau; tem menos inimigos e mais moedas.
- O Pinguim Sentinela demonstra que bater numa parede o deixa vulnerável.

### Bifurcação 2 — escada e elevador

- A rota externa tem plataformas largas em zigue-zague, com pousos seguros.
- A rota central usa um elevador vertical que pausa nas extremidades e uma plataforma horizontal curta.
- O Gnomo Neveiro ocupa um patamar intermediário; paredes permitem quebrar sua linha de tiro.

### Bifurcação 3 — interior e crista

- A passagem interna é mais longa e protegida da nevasca, com gelo localizado e um bloco móvel.
- A crista é curta, tem plataformas quebráveis recuperáveis e moedas desenhando os saltos.
- As rotas convergem na porta 3 e no checkpoint anterior ao guardião.

## Novos inimigos e plano de personagens

Os três designs serão originais e seguirão o estilo oficial já existente no Reino: formas chibi arredondadas, olhos grandes, silhueta limpa, leitura lateral/3⁄4, volume pintado, contorno forte, detalhes teal/azul e expressão amigável mesmo quando ameaçadora. O cavaleiro atual e os inimigos de fogo são referências locais de escala, acabamento e linguagem de derrota.

Material de Donkey Kong Country, Super Mario World e Mega Man 7 é `referencia_apenas`: serve para estudar antecipação, peso, ritmo e composição, nunca para copiar pixels, identidade, paleta distintiva ou sequência quadro a quadro. Nenhum arquivo desses jogos entra no repositório ou no build.

### 1. Pinguim Sentinela

- Função: pressão horizontal e ferramenta ambiental.
- Leitura: pequeno, redondo, cachecol azul; abaixa o corpo antes de deslizar.
- Estados: patrulha → percebe → prepara por 500 ms → desliza → bate na parede/para → fica tonto → patrulha.
- Soluções: pular por cima, usar outro nível da rota, defender, atacar durante recuperação ou fazê-lo bater num muro.
- Vida: 1 acerto durante vulnerabilidade; ataque frontal durante o dash apenas interrompe se for martelo, preservando as diferenças de arma existentes.
- Animações mínimas: `patrol` 4 frames, `anticipate` 2, `dash` 2, `stunned` 2 e `defeat` 2.
- Tamanho em cena inicial: cerca de `72 x 76`; hitbox restrita ao corpo opaco e pés alinhados ao piso.

### 2. Gnomo Neveiro

- Função: controle de linha de visão e uso de cobertura.
- Leitura: pequeno guardião encapuzado com luvas grandes; ergue uma bola de neve brilhante antes de lançar.
- Estados: patrulha curta → mira por 600 ms → arremessa em arco → recupera por 900 ms.
- Soluções: usar parede/bloco como cobertura, mudar de altura, passar durante a recuperação, usar escudo ou derrotar.
- Projétil: arco lento, um quique visual no chão e destruição na parede; nunca persegue após lançado.
- Vida: 2 acertos.
- Animações mínimas: `idle/patrol` 4 frames, `aim` 2, `throw` 3, `recover` 1, `hurt` 1 e `defeat` 2.
- Tamanho em cena inicial: cerca de `76 x 96`; ataque e projétil precisam contrastar com a neve.

### 3. Guardião Mamute

- Função: prova final de leitura, movimento entre alturas e janela de contra-ataque.
- Leitura: mamute jovem de lã azul-clara, presas curtas e ornamentos do Reino; grande sem ocupar mais de um terço da largura visível.
- Arena: piso inferior, dois patamares laterais e um bloco de gelo central que funciona como cobertura.
- Padrão inicial: pisada telegrafada → duas ondas baixas evitáveis por pulo → recuperação.
- Segunda variação: investida telegrafada → colisão com batente → atordoamento.
- Terceira variação, após metade da vida: bola de neve em arco, sempre alternada com uma janela segura.
- Vida: 6 acertos no modo normal, ajustada pelos modos existentes sem alterar a regra global de dano.
- Animações mínimas: `idle` 2 frames, `walk` 4, `anticipate` 2, `stomp` 3, `charge` 2, `stunned` 2, `hurt` 1 e `defeat` 3.
- Derrota: senta tonto, reconhece o cavaleiro e libera o portal; não é destruído de forma violenta.

### Pipeline obrigatório de arte

1. Criar um `character master` de cada inimigo antes das animações.
2. Usar primeiro referências locais de aparência e a biblioteca local de movimentos; hoje não há referência externa incorporável selecionada.
3. Gerar cada ciclo como conjunto coerente a partir do master, não frame a frame de forma independente.
4. Exportar PNG transparente em `public/assets/reino-portas/personagens/<personagem>/` com `source.json`.
5. Usar células uniformes com margem mínima de 8 px ou 4% da menor dimensão, o que for maior.
6. Registrar design original, ferramenta/processo, referências estruturais e classificação de uso/licença.
7. Validar identidade, continuidade, pivô, pés, hitbox, transparência, frame range, FPS e playback no Phaser.

## Assets de cenário previstos

- fundo vertical de neve com base, paredão, nuvens e aurora, preparado para parallax a partir de imagens raster;
- terreno de neve e terreno de gelo com topo apoiável inequívoco;
- parede nevada e conjunto de saliências;
- plataforma de gelo fixa, móvel e quebrável, reutilizando a mesma identidade visual quando possível;
- bloco de gelo deslizante e batentes;
- entrada do abrigo e portal do cume;
- pegadas/setas raster para sinalização espacial;
- flocos raster para a camada persistente; partículas efêmeras simples continuam permitidas para feedback.

Não será criado um tileset universal nem variantes sem consumidor. Cada asset precisa aparecer na fase e declarar tamanho visual e corpo físico, evitando o erro EC-003.

## Arquitetura e impacto planejado

- Entrada do fluxo: `ConfiguracaoReino.ts` → fase 9 → `ReinoDasPortas.ts`.
- Dados da região e tipos inimigos: `src/game/dados/mundoReinoPortas.ts`.
- Layout autoral da neve: manter junto de `LevelReino.ts` ou em um único `NivelNeveReino.ts` somente se o arquivo atual ficar ilegível; não criar um gerador genérico vertical.
- Cena: parametrizar largura/altura, câmera, queda, portas, portal, barreiras, checkpoints e progresso para consumir coordenadas do nível.
- Superfícies: reutilizar `TerrestreReino.ts`; ampliar apenas para o bloco deslizante se o corpo existente não bastar.
- Inimigos: uma entidade por personagem e inclusão direta em `CriarInimigoReino.ts`.
- Loader/animações: `AssetsEducApp.ts` e preparação já centralizada do Reino.
- Persistência: ampliar checkpoint com altura ou ID de superfície mantendo fallback da chave v2.
- Seleção de fase: reorganizar `ConfiguracaoReino.ts` para nove cartões legíveis sem reduzir os alvos de toque.
- HUD: progresso por marcos (início, três portas e cume), não por `x` puro.
- Assets finais: `public/assets/reino-portas/` e subpastas de personagens previstas pela skill.

Pontos fixos que precisam desaparecer da lógica da neve: `y > 620`, câmera com altura 640 como limite mundial, barreiras em `y = 470`, portal em `y = 455`, inimigos derrotados em `y > 650`, portas sem `y` e checkpoint sem altura. Isso será feito por dados do nível, não por novos `if (tema === 'neve')` espalhados.

## Sequência de implementação futura

### Etapa 1 — contrato vertical mínimo

- Acrescentar dimensões e coordenadas completas a `NivelReino`.
- Fazer câmera, queda, spawn, portal, portas, perigos e checkpoints consumirem esses dados.
- Preservar valores atuais como defaults para as oito fases existentes.
- Criar um teste pequeno para nível atual + nível vertical + fallback de checkpoint.

### Etapa 2 — mapa cinza com assets raster existentes

- Declarar Picos das Trilhas com superfícies e plataformas existentes, sem arte final procedural.
- Provar as três rotas e todas as reconexões.
- Medir saltos com o movimento real do cavaleiro; rota obrigatória não depende do pulo duplo.
- Ajustar câmera e retorno de queda antes de produzir cenário final.

### Etapa 3 — obstáculos de neve

- Integrar gelo localizado, bloco deslizante, elevadores e plataformas quebráveis recuperáveis.
- Ensinar cada elemento sozinho, variar e só então combinar.
- Validar carregamento sobre plataforma móvel e alinhamento terrestre conforme EC-001.

### Etapa 4 — personagens e encontros

- Produzir masters e spritesheets conforme `personagem-generator`.
- Implementar estados mínimos de cada inimigo.
- Montar encontros de um papel e depois encontros de dois papéis.
- Verificar que todas as zonas de combate têm uma passagem sem combate obrigatório.

### Etapa 5 — arte, atmosfera e pedagogia

- Substituir o mapa cinza pelos assets finais de neve antes da interface final.
- Posicionar portas e objetivo ambiental nos pontos de reconexão.
- Construir a progressão visual céu claro → neve leve → vento → aurora/nevasca legível.
- Integrar gema, pergaminho, moedas, áudio e feedback.

### Etapa 6 — validação e balanceamento

- Executar checks estáticos e testes relacionados.
- Jogar cada rota separadamente, com teclado, touch e gamepad quando disponível.
- Fazer sessões em 960 x 640 e viewport estreita.
- Ajustar antecipação, câmera e distâncias antes de aumentar quantidade de conteúdo.

## Critérios de aceite

- [ ] A fase possui mundo `6200 x 1440` e a câmera percorre pelo menos 1000 px úteis no eixo vertical sem revelar fora do cenário.
- [ ] A criança sai da base próxima de `y = 1260` e alcança o cume próximo de `y = 220`, percebendo quatro patamares distintos.
- [ ] Existem três bifurcações, cada uma com duas rotas completas, legíveis e reconectadas antes da porta seguinte.
- [ ] Corrida e pulo básico bastam para toda rota obrigatória; pulo duplo e dash oferecem atalhos tolerantes.
- [ ] Pelo menos uma parede é subida por saliências, uma por plataforma móvel e uma com auxílio de bloco de gelo, sem wall-jump.
- [ ] Bloco móvel, gelo, elevador e plataforma quebrável são apresentados isoladamente antes de aparecerem combinados.
- [ ] Pinguim, Gnomo e Mamute exibem antecipação, ataque e recuperação claramente distintos.
- [ ] Todo encontro principal pode ser evitado por espaço, timing ou rota; somente o guardião é obrigatório.
- [ ] Nenhum inimigo ataca fora da câmera ou imediatamente ao entrar nela.
- [ ] Neve e nevasca não reduzem o contraste de plataformas, inimigos, projéteis, portas ou cavaleiro.
- [ ] As três portas continuam usando a configuração pedagógica e preservam combo, voz, feedback e save.
- [ ] Checkpoints restauram a criança no andar correto e saves antigos continuam carregando.
- [ ] Plataforma quebrável, bloco e colecionáveis recuperam um estado jogável após queda/reentrada.
- [ ] Base opaca, pés e corpos físicos coincidem em terreno fixo, gelo, bloco e plataforma móvel.
- [ ] Spritesheets têm células uniformes, transparência, margem mínima, pivô consistente e nenhum vazamento entre frames.
- [ ] A fase 9 aparece selecionável sem tornar os cartões/botões pequenos ou sobrepostos.
- [ ] As fases 1 a 8 mantêm geração, progressão, câmera, inimigos e conclusão observáveis como hoje.

## Plano de validação

- Estática: `npx tsc --noEmit` e `npm run build`.
- Regras: `npm run test:levels`, `npm run test:terrestres`, `npm run test:sprites`, testes novos de rotas verticais/estados inimigos e `npm run test:arte`.
- Regressão: `npm run test:desafios`, `npm run test:voo` e `npm run test:smoke`.
- Integração: iniciar fase nova, abrir três portas, morrer/cair em cada patamar, recarregar checkpoint, derrotar guardião, concluir e retornar ao seletor.
- Rotas: completar a fase uma vez por cada rota principal; repetir sem derrotar inimigos comuns e sem pulo duplo/dash nos trechos obrigatórios.
- Visual/interação: 960 x 640 e viewport estreita; inspecionar câmera, contraste, touch, HUD, partículas, fundo, chão e console.
- Física: usar debug para pés, superfícies, plataformas móveis, bloco, perigos, projéteis e spawn.
- Crianças de 6 a 8 anos: observar se reconhecem as duas rotas, antecipam ataques após a primeira demonstração e entendem “subir” sem instrução adulta. Meta inicial: 4 de 5 encontram ambas as entradas de rota; 4 de 5 evitam o segundo ataque de cada inimigo; nenhuma fica presa por mais de 45 s sem progresso ou feedback.

## Riscos e contenções

- **Câmera causa enjoo ou esconde pouso:** dead zone vertical, suavização e enquadramento antecipado só durante subida/queda significativa.
- **Rota alta vira obrigatória por recompensa:** manter portas nas reconexões e colecionáveis opcionais.
- **Neve reduz leitura:** limitar opacidade e densidade por teste, com silhuetas e projéteis contrastantes.
- **Nove fases quebram telas de oito itens:** tratar seleção e contadores como parte necessária da adição, sem refazer toda a configuração.
- **Checkpoint antigo perde compatibilidade:** fallback para a superfície segura em `x`; não mudar a chave do `localStorage`.
- **Escopo explode em um framework vertical:** layout da neve será explícito e específico; generalizar somente após segundo bioma vertical real.
- **Personagem inconsistente entre frames:** master único, ciclos gerados em conjunto e validação de continuidade antes de integrar.

## Autorizações e propriedade intelectual

A pesquisa web de artigos foi solicitada pelo usuário e realizada. Nenhum asset externo foi baixado.

Para implementação futura, geração de arte original pode usar o processo local sem copiar propriedade de terceiros. Nova pesquisa ou download de referências/áudio/assets exigirá autorização explícita imediatamente antes do acesso. Toda fonte terá URL, autor, licença, uso e data em `source.json`; material protegido ou com licença desconhecida será apenas referência e ficará fora do build.

## Resultado da validação

Implementação iniciada em 2026-09-09:

- contrato de nível ampliado com dimensões, spawn, queda, portas, portal, checkpoints, marcos e rotas, preservando defaults das fases 1 a 8;
- Picos das Trilhas declarada como fase 9, com mundo `6200 x 1440`, três bifurcações, gelo, elevadores, plataforma quebrável, bloco móvel e posições verticais persistidas;
- Pinguim Sentinela, Gnomo Neveiro e Guardião Mamute integrados em código com espera de entrada em câmera, antecipação e recuperação;
- seletor reorganizado em grade 3 x 3 e mapa da jornada ajustado para nove destinos.

Validações já executadas:

- `npx tsc --noEmit`: passou;
- `npm run test:levels`: passou com 900 gerações, fase vertical e nove microaventuras;
- `npm run test:terrestres`: passou;
- `npm run test:arte`: passou.

Pendente: gerar e integrar os PNGs originais, executar build e validar visualmente a fase em 960 x 640 e viewport estreita. O gerador de imagens é um serviço remoto e aguarda autorização explícita conforme `AGENTS.md`.
