# Reino das Portas — plano de refatoração das oito fases atuais

Status: Implementação

Base obrigatória: [Princípios para construção e revitalização de fases](PRINCIPIOS_CONSTRUCAO_FASES.md).

Fase-piloto do novo modelo: [Picos das Trilhas](plano-revitalizacao-fase-neve.md).

## Resultado para a criança

As oito regiões atuais deixam de parecer variações horizontais do mesmo percurso. Cada uma passa a ter relevo, rotas, obstáculos, encontros e progressão visual próprios, preservando as três portas educativas, as aventuras existentes, os equipamentos, os colecionáveis e o progresso salvo.

## Estratégia de refatoração

Não implementar as oito fases simultaneamente. Primeiro concluir e validar o contrato vertical na fase de neve. Depois revitalizar uma fase por vez na ordem da campanha, mantendo defaults antigos até a migração de cada região.

Cada fase terá:

- mundo entre `1280` e `1440` px de altura;
- ao menos `900` px de progressão vertical útil;
- três bifurcações principais;
- uma mecânica central e até duas de apoio;
- três portas em reconexões seguras;
- inimigos existentes redistribuídos por papel e geometria;
- cenário raster com quatro planos e arco visual;
- checkpoint completo após os grandes atos;
- layout autoral determinístico, sem exigir um gerador universal.

## Investigação desta execução

- A fundação vertical e Picos das Trilhas já estão parcialmente implementados em `LevelReino.ts` e `ReinoDasPortas.ts`; as fases 1 a 8 ainda usam a gramática horizontal antiga de `720` px.
- Câmera, mundo, portas, portal, checkpoint com `y`, plataformas móveis/quebráveis, impulso, gelo e progresso por marcos já consomem dados do nível. A refatoração deve ampliar esse caminho compartilhado, sem condições por bioma espalhadas na cena.
- Aventuras, encontros e colecionáveis ainda dependem de coordenadas horizontais ou números `y` fixos em alguns pontos. Eles serão assentados nas superfícies declaradas pelo nível.
- Os oito fundos, terrenos e props raster já carregados cobrem a entrega funcional sem criar arte procedural ou acessar a internet. Novos assets de acabamento ficam fora desta execução porque não são necessários para tornar os mapas verticais, distintos e jogáveis.

## Plano desta execução

1. Substituir a gramática horizontal das fases 1 a 8 por oito layouts determinísticos declarados, cada um com relevo, três bifurcações, reconexões, portas, portal, checkpoints e marcos.
2. Dar coordenadas completas às aventuras e encontros e remover os últimos limites verticais fixos do fluxo compartilhado.
3. Reusar as mecânicas já existentes por bioma: impulso, caixa/placa, cristais, plataformas móveis, poções, páginas, ponte e plataformas quebráveis/perigos.
4. Validar dimensões, amplitude vertical, rotas, superfícies seguras e objetivos por teste; depois executar TypeScript, build, testes relacionados e navegador nas duas viewports.

## Escopo compartilhado

### Inclui

- parametrizar dimensões, câmera, limites de queda, portas, portal, inimigos e checkpoints pelos dados do nível;
- transformar os oito mapas em composições verticais próprias;
- reposicionar aventuras, colecionáveis, obstáculos e encontros;
- criar ou ajustar assets raster de bioma quando o visual atual não cobrir o novo enquadramento;
- ampliar animações de inimigos existentes somente quando o novo comportamento realmente exigir;
- preservar saves antigos com fallback para superfície segura;
- validar cada fase antes de iniciar a seguinte.

### Não inclui

- substituir desafios pedagógicos;
- alterar preços, armas, roupas ou companheiros;
- criar inimigo novo para toda fase por obrigação;
- adicionar wall-jump, voo ou árvore de habilidades;
- refazer todas as entidades antes de existir um encontro que demande isso;
- retirar fases, aventuras ou colecionáveis existentes;
- alterar simultaneamente a arquitetura de outros jogos.

## Fundação compartilhada, feita uma vez

1. `NivelReino` passa a declarar largura, altura, spawn, limite de queda, portas, portal e checkpoints com coordenadas completas.
2. Câmera recebe bounds verticais, suavização, zona morta e enquadramento previsível.
3. Checkpoint salva `x` e `y` ou ID estável de superfície; saves v2 antigos encontram piso seguro por `x`.
4. Progresso do HUD passa a usar marcos: início, portas 1–3 e portal.
5. Inimigos só ativam ataque quando visíveis e após tempo mínimo de entrada em tela.
6. Validador de níveis confirma alcançabilidade, reconexões, pisos seguros e objetivos obrigatórios.
7. As fases antigas mantêm seus valores atuais como fallback até receberem novo layout.

## Fase 1 — Bosque dos Números

### Nova promessa

“Saia da clareira, atravesse raízes e copas e encontre a chave que abre o caminho da floresta.”

### Identidade mecânica

- Principal: alternância entre chão e copa.
- Apoio: cogumelos de impulso e troncos/raízes como degraus.
- Progressão: apresentar subida simples → oferecer chão/copa → combinar plataformas vivas e morcego → alcançar o portão.

### Estrutura vertical e rotas

- Base na clareira inferior; meio entre raízes gigantes; topo nas copas iluminadas.
- Rota protegida segue o chão, com plataformas largas e mais slimes.
- Rota ágil cruza galhos e cogumelos, com menos combate e maior risco de queda curta.
- Desvio de exploração entra num tronco oco e retorna à clareira seguinte.
- A chave da aventura permanece obrigatória, visível num patamar central alcançável pelas duas rotas.

### Encontros

- Slime apresenta patrulha no chão.
- Cogumelo demonstra salto em área sem abismo.
- Morcego aparece apenas depois de a copa estar estabelecida.
- Goblin usa troncos como cobertura; Furacão ocupa espaço aberto, nunca um salto cego.
- Mímico atual encerra a fase com padrão introdutório, sem combo acelerado.

### Direção visual

- Base úmida e sombreada, troncos monumentais no plano médio, copa clara no topo.
- Folhas e raios de luz aumentam durante a subida.
- Bordas apoiáveis recebem musgo claro consistente; galhos decorativos não imitam plataformas.
- Reusar floresta, flores, árvore-colmeia, borboletas e tronco; gerar somente extensões verticais e raízes necessárias.

### Critérios próprios

- A criança entende a primeira bifurcação por ver simultaneamente chão e galho.
- A chave pode ser alcançada por ambas as rotas.
- Nenhum tronco, árvore ou cogumelo flutua ou discorda do corpo físico.

## Fase 2 — Vila das Palavras

### Nova promessa

“Atravesse ruas e telhados, mova a caixa e faça a engrenagem abrir o portão da praça.”

### Identidade mecânica

- Principal: empurrar e posicionar objetos.
- Apoio: telhados e elevadores de carga.
- Progressão: caixa como degrau → caixa como cobertura → caixa sobre placa.

### Estrutura vertical e rotas

- Rua no nível inferior, varandas no intermediário e telhados no superior.
- Rota protegida percorre ruas e arcos, usando caixas contra flechas.
- Rota ágil usa toldos, varandas e um elevador de carga.
- Desvio entra num celeiro/depósito e retorna à praça.
- A caixa da aventura permanece num corredor controlado; se cair ou sair do trecho, retorna ao ponto seguro.

### Encontros

- Goblin e slime ocupam ruas largas.
- Arqueiro é apresentado num telhado com cobertura disponível.
- Espantalho investe numa praça onde pode ser contornado por varanda.
- Cogumelo oferece acesso opcional a um telhado, não acesso obrigatório.
- Nunca alinhar dois arqueiros em alturas opostas.

### Direção visual

- Ruas quentes na base, bandeirolas e varandas no meio, relógio/torre da praça como destino.
- Silhueta dominante: telhados inclinados e chaminés.
- Portas educativas ocupam pequenas praças, não o meio de uma rua estreita.
- Reusar fazenda, galinhas, barris/baús e arqueiro; criar telhados, toldos e elevador raster somente conforme o layout.

### Critérios próprios

- A caixa resolve três funções sem exigir instrução longa.
- Telhados formam rota contínua, não plataformas isoladas decorativas.
- A placa permanece alcançável e recuperável após erro.

## Fase 3 — Caverna dos Ecos

### Nova promessa

“Desça às câmaras de cristal, acenda os três ecos e volte pela grande coluna de luz.”

### Identidade mecânica

- Principal: alternância entre descida e subida em câmaras.
- Apoio: cristais que iluminam/orientam e plataformas de pedra móveis.
- Progressão: câmara clara → bifurcação iluminada → combinação com morcegos → retorno vertical.

### Estrutura vertical e rotas

- Entrada alta, galerias intermediárias, poço inferior e saída novamente elevada.
- Rota protegida contorna o poço por saliências largas.
- Rota ágil atravessa plataformas centrais móveis.
- Desvio de exploração passa atrás de uma cortina de cristais claramente marcada.
- Os três cristais obrigatórios ficam em reconexões sucessivas, não em rotas mutuamente exclusivas.

### Encontros

- Planta ensina janela de vulnerabilidade em piso amplo.
- Morcego usa volume vertical da câmara, mas mergulha somente quando visível.
- Cogumelo ajuda a recuperar altura em trecho seguro.
- Furacão é substituído visualmente por corrente de ecos apenas se houver asset e função coerentes; caso contrário, não aparece.
- Arqueiro não dispara através de parede de rocha.

### Direção visual

- Entrada azul suave, profundidade escura controlada e saída ciano-dourada após cristais.
- Cristais ativos clareiam o plano jogável sem esconder ameaças.
- Estalactites permanecem fundo/decoração, nunca parecem superfície segura.
- Usar cristais e props existentes; criar fundo vertical modular e coluna de luz raster.

### Critérios próprios

- Ativar cristal sempre melhora orientação visual.
- A volta para cima não exige repetir todo o poço após queda.
- Morcegos têm espaço de reação e não atacam durante mudança cega de câmera.

## Fase 4 — Montanha das Formas

### Nova promessa

“Escale paredões, domine o vento e acione a ponte que leva ao pico das formas.”

### Identidade mecânica

- Principal: plataformas influenciadas pelo vento.
- Apoio: pontes e paredões com saliências.
- Progressão: rajada visual sem perigo → plataforma horizontal → elevador vertical → travessia combinada.

### Estrutura vertical e rotas

- Pé da montanha, paredão, garganta e pico.
- Rota protegida segue grutas e escadas de pedra.
- Rota ágil cruza a face externa usando plataformas móveis.
- Desvio alcança uma formação geométrica visível ao fundo.
- A alavanca da ponte fica num mirante acessível pelas duas rotas; a ponte cria reconexão, não punição.

### Encontros

- Furacão é o inimigo-tema e precisa indicar direção/amplitude antes de cruzar a rota.
- Morcego ocupa grutas; espantalho e goblin ficam em patamares largos.
- Arqueiro só aparece onde existe rocha de cobertura.
- Combinação final: vento previsível + um inimigo terrestre, sem projétil cruzado.

### Direção visual

- Escala crescente de paredões, nuvens abaixo do pico e cristais triangulares reforçando “formas”.
- Vento visível por bandeiras, folhas ou neve mineral raster, não apenas por partículas abstratas.
- Diferenciar claramente rocha apoiável de montanha distante.
- Aproveitar o fundo-montanha existente como fonte de estilo, gerando extensões verticais coerentes.

### Critérios próprios

- A direção do vento é identificável sem texto.
- Toda plataforma móvel pausa e mostra trajetória.
- A ponte aberta permanece segura após save/reentrada.

## Fase 5 — Pântano das Poções

### Nova promessa

“Atravesse raízes e passarelas, use poções como vantagem e encontre o amigo perdido.”

### Identidade mecânica

- Principal: escolher terreno firme ou passarelas móveis.
- Apoio: poções opcionais e raízes como pontes.
- Progressão: água rasa segura → lama/perigo sinalizado → passarela móvel → resgate.

### Estrutura vertical e rotas

- Água/solo no nível inferior, raízes no intermediário e copas baixas no superior.
- Rota protegida segue raízes largas, com mais distância.
- Rota ágil usa troncos/passarelas móveis sobre áreas perigosas.
- Desvio leva a uma cabana de poções e retorna antes da porta.
- A raposa resgatada fica num ilhote central visível; nenhuma poção é obrigatória para chegar.

### Encontros

- Planta domina margens e abre/fecha passagem com ritmo claro.
- Slime e cogumelo aparecem em ilhas firmes.
- Morcego não mergulha onde vegetação oculta o cavaleiro.
- Furacão de folhas aparece só em clareira ampla.
- Poção de salto cria atalho; poção de escudo ajuda no resgate, mas ambas são opcionais.

### Direção visual

- Água verde-clara com reflexo, névoa atrás do plano jogável e pontos quentes das poções.
- Silhueta dominante: raízes arqueadas e árvores baixas.
- Passarela apoiável tem borda clara; reflexos e bolhas não parecem itens.
- Reusar plantas, flores, tronco e poções; criar raízes e passarelas raster necessárias.

### Critérios próprios

- Terreno perigoso e água decorativa são distinguíveis também por forma/movimento.
- O resgate é alcançável sem poção.
- A raposa e a grade respeitam chão e permanecem legíveis na névoa.

## Fase 6 — Biblioteca Encantada

### Nova promessa

“Suba por estantes e passarelas mágicas para reunir as três páginas perdidas.”

### Identidade mecânica

- Principal: estantes e plataformas que mudam de posição.
- Apoio: escadas/passarelas e páginas que orientam a progressão.
- Progressão: estante fixa → estante móvel → duas estantes coordenadas → salão final.

### Estrutura vertical e rotas

- Salão térreo, galerias, arquivo alto e observatório de leitura.
- Rota protegida usa escadarias e passarelas largas.
- Rota ágil sobe por estantes móveis e lustres-plataforma claramente mágicos.
- Desvio entra numa sala secreta de leitura e retorna ao corredor principal.
- Cada página obrigatória fica após uma reconexão; as rotas mudam como alcançá-la, não se ela será encontrada.

### Encontros

- Goblin/arqueiro atua entre estantes, sempre com cobertura.
- Morcego pode virar ameaça de corredor alto, sem mudar seu design oficial.
- Planta não é usada se parecer deslocada do bioma.
- Espantalho guarda galeria larga; cogumelo aparece apenas se receber integração visual coerente, não por preencher lista.
- Objetos móveis e inimigos não mudam de estado ao mesmo tempo na primeira apresentação.

### Direção visual

- Madeira quente na base, magia violeta nas galerias e luz dourada no observatório.
- Silhueta dominante: estantes verticais, arcos e escadas.
- Livros decorativos têm baixo contraste; páginas coletáveis brilham e se movem.
- Criar módulos raster de estante, escada e passarela; não desenhar prateleiras com retângulos Phaser.

### Critérios próprios

- A criança vê a próxima página ou um sinal dela antes de escolher a subida.
- Estantes móveis não esmagam nem prendem.
- As três páginas continuam persistidas corretamente após reentrada.

## Fase 7 — Castelo do Rei Confuso

### Nova promessa

“Escolha muralhas ou salões, corte a corda e atravesse a fortaleza até o rei.”

### Identidade mecânica

- Principal: alternância entre exterior e interior da muralha.
- Apoio: pontes, portões e plataformas de contrapeso.
- Progressão: pequeno portão → ponte curta → contrapeso → grande ponte liberada pela corda.

### Estrutura vertical e rotas

- Pátio inferior, salões intermediários, muralhas superiores e torre final.
- Rota protegida atravessa interiores com coberturas e escadas.
- Rota ágil segue ameias e plataformas de contrapeso.
- Desvio leva a uma sala do tesouro e retorna ao pátio seguinte.
- A corda obrigatória fica visível no encontro das rotas; cortá-la abre ponte permanente.

### Encontros

- Arqueiro e goblin ocupam muralhas, mas nunca disparam de fora da câmera.
- Espantalho investe em corredor largo com alcova de escape.
- Planta e cogumelo ficam fora se não houver justificativa visual de jardim interno.
- Morcego aparece em torre/porão com espaço vertical.
- Mímico ganha arena de dois níveis, preservando seu design e padrão regional.

### Direção visual

- Pátio frio, salões dourados, muralha sob céu dramático e torre final iluminada.
- Silhueta dominante: torres, ameias e pontes.
- Interior e exterior compartilham pedra/paleta para parecerem o mesmo lugar.
- Portas educativas recebem arquitetura real de antecâmara e área de descanso.

### Critérios próprios

- Interior e muralha são rotas completas e reconhecíveis.
- Corda e ponte permanecem coerentes após checkpoint/reentrada.
- Ameias decorativas não ocultam pés, projéteis ou bordas.

## Fase 8 — Fornalha das Chamas

### Nova promessa

“Suba pela fornalha, use caminhos frios e quentes e derrote o guardião diante do portal.”

### Identidade mecânica

- Principal: ciclos térmicos previsíveis que abrem e fecham passagens.
- Apoio: elevadores industriais e plataformas sobre lava.
- Progressão: brasa decorativa → jato lento → ciclo de plataformas → combinação na forja final.

### Estrutura vertical e rotas

- Entrada de mineração, câmaras de forja, chaminés e plataforma superior do portal.
- Rota protegida usa túneis de resfriamento, mais longos e com cobertura.
- Rota ágil cruza plataformas industriais sobre lava durante janelas largas.
- Desvio de exploração entra numa câmara de cristal e retorna antes da terceira porta.
- O guardião permanece obrigatório numa arena estável de dois níveis; lava não invade o piso seguro.

### Encontros

- Diabrete é o atacante rápido, mas recebe antecipação antes da arrancada.
- Golem é o inimigo pesado, com golpe anunciado e recuperação; não apenas patrulha com mais vida.
- Arqueiro aparece atrás de cobertura térmica somente depois de o padrão do cenário estar aprendido.
- Morcego ocupa chaminés e não mergulha durante subida cega do elevador.
- Combinação final usa um golem e um ciclo ambiental lento, nunca enxame.

### Direção visual

- Rocha escura na entrada, laranja crescente nas forjas e contraste azul de resfriamento nas rotas seguras.
- Silhueta dominante: fornalhas, tubos, correntes e chaminés.
- Lava permanece abaixo da base visual do piso; brilho não apaga bordas ou projéteis.
- Reusar inimigos de fogo e lava existentes; gerar mecanismos raster e fundo vertical coerentes.

### Critérios próprios

- Ciclos térmicos são previsíveis após uma observação.
- Toda seção de lava tem pouso seguro visível antes do salto.
- Golem e diabrete têm antecipação/recuperação compatíveis com os princípios gerais.

## Ordem de execução

1. Concluir a fundação compartilhada e Picos das Trilhas.
2. Bosque, para calibrar tutorial, câmera e menor dificuldade.
3. Vila, para validar objeto movível e cobertura.
4. Caverna, para validar descida/retorno e iluminação.
5. Montanha, para validar vento e plataformas móveis em escala.
6. Pântano, para validar perigos de solo e poções opcionais.
7. Biblioteca, para validar ambientes internos verticais.
8. Castelo, para acumular rotas internas/externas e mecanismos.
9. Fornalha, como culminação dos sistemas já apresentados.

Cada fase deve encerrar Implementação e Validação antes da próxima. Ajustes compartilhados descobertos numa fase recebem teste de regressão nas fases já revitalizadas.

## Critérios de aceite globais

- [ ] As oito fases têm promessa, silhueta, mecânica e arco visual próprios.
- [ ] Cada fase percorre ao menos 900 px úteis no eixo vertical.
- [ ] Cada fase possui três bifurcações e reconexão antes das portas.
- [ ] Toda rota essencial funciona com corrida e pulo básico.
- [ ] Inimigos comuns são evitáveis e guardiões têm padrões telegrafados.
- [ ] Aventuras atuais continuam obrigatórias e coerentes com o novo mapa.
- [ ] Portas preservam configuração, voz, combo, feedback e persistência.
- [ ] Saves antigos reaparecem em superfície segura.
- [ ] Assets visíveis são raster, legíveis e fisicamente alinhados.
- [ ] Nenhuma fase revitalizada é apenas uma troca de cor do mesmo layout.
- [ ] Touch, teclado, câmera e HUD permanecem utilizáveis nas duas viewports exigidas.
- [ ] Fases ainda não migradas continuam funcionando pelo contrato antigo durante a execução incremental.

## Plano de validação por fase

- Estática: `npx tsc --noEmit` e `npm run build`.
- Regras: `npm run test:levels`, `npm run test:terrestres`, `npm run test:sprites`, `npm run test:arte` e teste específico do novo mecanismo da fase.
- Regressão: `npm run test:desafios`, `npm run test:voo` e `npm run test:smoke`.
- Rotas: uma conclusão por rota principal, uma sem inimigos comuns e uma sem dash/pulo duplo no caminho essencial.
- Persistência: queda, morte, reload e reentrada em cada checkpoint e após cada objetivo ambiental.
- Visual: 960 x 640 e viewport estreita, com console limpo, contraste, chão e câmera conferidos.
- Infantil: observar reconhecimento de rota, leitura do segundo ataque e tempo sem progresso.

## Riscos

- **Oito mapas viram um projeto único impossível de validar:** execução estritamente fase a fase.
- **Generalização precoce:** compartilhar apenas o que a neve e uma segunda fase realmente usarem.
- **Verticalidade alonga demais a sessão:** medir tempo por ato e remover repetição antes de reduzir legibilidade.
- **Novos fundos ficam bonitos, mas confundem gameplay:** aprovar primeiro a hierarquia em mapa funcional e só depois finalizar arte.
- **Objetivos antigos quebram em rotas novas:** posicioná-los em reconexões e testar save/reentrada.
- **Inimigos ganham comportamento sem frames adequados:** acionar `personagem-generator` apenas para animações exigidas pelo encontro.

## Autorizações necessárias

Nenhuma para este plano. Na implementação, qualquer pesquisa, download ou serviço remoto exigirá autorização imediatamente antes do acesso. Eliminação de conteúdo ou mudança fora das fases descritas também exigirá autorização.

## Resultado da validação

Ainda não aplicável. Este documento define o plano; nenhum comportamento ou asset das fases atuais foi alterado.
