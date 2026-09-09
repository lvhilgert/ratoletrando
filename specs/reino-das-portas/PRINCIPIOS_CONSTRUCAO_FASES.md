# Reino das Portas — princípios para construção e revitalização de fases

Este é o guia permanente para criar fases novas e revisar gameplay ou visual das fases existentes do Reino das Portas. Specs individuais podem adaptar números e conteúdo, mas qualquer exceção a estes princípios deve ser explícita e validada com crianças de 6 a 8 anos.

Referência de aplicação: [plano da fase Picos das Trilhas](plano-revitalizacao-fase-neve.md).

## 1. Promessa de uma fase

Cada fase precisa poder ser resumida em uma frase que combine **lugar, ação e descoberta**.

Exemplo: “Suba uma montanha de neve escolhendo entre trilhas protegidas e atalhos pelo gelo.”

Uma fase do Reino deve entregar:

- um bioma reconhecível em poucos segundos;
- uma ideia principal de movimento ou interação;
- ao menos duas maneiras honestas de atravessar os encontros principais;
- três portas educativas integradas ao percurso;
- um pequeno arco visual, do ponto inicial ao portal;
- começo acolhedor, desenvolvimento, combinação e conclusão.

Se duas fases têm o mesmo relevo, os mesmos obstáculos e apenas cores diferentes, uma delas ainda não possui identidade suficiente.

## 2. Estrutura: apresentar, variar e combinar

Cada fase escolhe uma mecânica principal e no máximo duas mecânicas de apoio.

1. **Apresentar:** mostrar a mecânica sozinha, em espaço seguro.
2. **Variar:** alterar altura, direção, velocidade ou contexto, mantendo a regra reconhecível.
3. **Combinar:** juntar a mecânica já aprendida a um inimigo ou obstáculo conhecido.
4. **Concluir:** usar a ideia na aproximação final ou no guardião, sem introduzir uma regra nova.

Não combinar perigos antes de a criança ter visto cada um isoladamente. Dificuldade nasce da combinação de regras conhecidas, não de surpresa.

Esse princípio adapta a progressão por iteração e acumulação observada em Super Mario World: [análise de temas e dificuldade](https://thegamedesignforum.com/features/RD_SMW_5.html).

## 3. Verticalidade significativa

Verticalidade não é empilhar plataformas no mesmo enquadramento. Ela existe quando a criança:

- percorre patamares que exigem movimento real da câmera;
- escolhe subir, permanecer no nível atual ou descer por uma recompensa;
- reconhece visualmente base, meio e topo;
- usa altura para evitar, observar ou atacar inimigos;
- consegue olhar para trás e perceber a progressão espacial.

Parâmetros-base:

- resolução lógica e viewport: `960 x 640`;
- fases revitalizadas: mundo entre `1280` e `1440` px de altura, salvo justificativa específica;
- progressão útil vertical: ao menos `900` px entre o menor e o maior patamar visitável;
- quatro ou mais patamares visualmente distintos;
- pousos obrigatórios largos o bastante para uma criança corrigir o movimento;
- queda longa nunca apaga progresso além do último trecho aprendido.

A câmera deve usar suavização, zona morta e enquadramento antecipado moderado. Ela nunca pode esconder o piso de pouso, mostrar fora do cenário ou oscilar a cada salto curto.

## 4. Rotas e escolhas

Cada fase possui pelo menos três zonas de decisão. Em cada uma, duas rotas principais devem estar perceptíveis antes da escolha.

### Papéis das rotas

- **Protegida:** mais larga, longa e tolerante; oferece cobertura e menos risco de queda.
- **Ágil:** mais curta e vertical; recompensa domínio, mas não exige precisão de um frame.
- **Exploração:** desvio curto e opcional para gema, pergaminho ou moedas; retorna claramente à rota.

Regras:

- as rotas principais convergem antes da próxima porta obrigatória;
- nenhuma rota obrigatória depende de compra, poção, arma, companheiro, dash ou pulo duplo;
- corrida e pulo básico completam o caminho essencial;
- habilidades extras oferecem velocidade, segurança ou recompensa;
- entrada que parece passagem leva a progresso, recompensa ou retorno sinalizado;
- uma rota não pode ser secretamente superior em segurança, velocidade e recompensa ao mesmo tempo;
- inimigos comuns podem ser evitados por rota, altura, cobertura ou timing.

Donkey Kong Country mostra como atalhos e sequências de movimento recompensam domínio, enquanto Super Mario World permite soluções distintas com poucos verbos. O Reino incorpora a escolha sem copiar layouts, personagens ou objetos dessas obras. Fontes: [equipe de Donkey Kong Country sobre fluxo](https://www.videogameschronicle.com/news/donkey-kong-country-team-reflects-on-the-games-25th-anniversary/) e [equipe de Super Mario World sobre exploração e dificuldade](https://shmuplations.com/supermarioworld/).

## 5. Movimento do cavaleiro

O layout nasce das capacidades reais do cavaleiro, não de distâncias desenhadas por intuição.

- Medir corrida, pulo curto, pulo sustentado e recuperação de pouso.
- Projetar o caminho obrigatório para corrida e pulo básico.
- Usar pulo duplo e dash como correção ou atalho.
- Preservar espaço para antecipar, saltar e pousar quando houver HUD e controles touch.
- Não acrescentar wall-jump, escalada, voo ou outro verbo para resolver apenas uma fase.
- Moedas, pegadas e bordas apontam a trajetória esperada sem exigir texto.
- Parede alta é vencida com saliências, plataforma, rampa, elevador ou objeto movível.

## 6. Chão, paredes e superfícies

O chão é contrato físico e visual:

- toda superfície apoiável é explícita;
- pés, base opaca e corpo físico coincidem;
- paredes têm limite visual coerente com sua colisão;
- props enraizados ou apoiados nascem da superfície, nunca de `y` arbitrário;
- plataforma suspensa mostra suporte, magia ou intenção clara de flutuar;
- plataforma atravessável é visualmente diferente de teto sólido quando a distinção importa;
- tamanho do PNG nunca define sozinho o tamanho de gameplay.

No código, reutilizar `superficieAbaixo`, `assentarTerrestre`, `configurarAtorTerrestre` e `alinharCorpoTerrestre`. Aplicam-se EC-001 e EC-003 de `ERROS_COMUNS.md`.

## 7. Obstáculos são verbos espaciais

Um obstáculo bom muda a decisão, não apenas ocupa espaço.

Papéis úteis:

- **parede:** força subida, desvio ou uso de objeto;
- **bloco movível:** vira degrau, cobertura ou peso;
- **plataforma móvel:** altera timing e conecta alturas;
- **plataforma quebrável:** pede decisão rápida com aviso e recuperação;
- **ponte/mecanismo:** modifica a topologia depois de uma ação clara;
- **túnel/teto:** muda salto, visibilidade ou linha de tiro;
- **perigo de chão:** altera a rota, mas mantém área segura antes e depois.

Todo obstáculo novo é apresentado sozinho. Estados móveis exibem trajetória ou batente. Estados temporários reaparecem após falha; prêmio obrigatório nunca é de tentativa única.

### Causa e consequência legíveis

Todo mecanismo obrigatório segue o ciclo `ver o problema -> encontrar o acionador -> agir -> ver a transformação -> atravessar`.

- A criança vê a parede, grade, ponte ausente ou destino antes de precisar procurar a solução.
- Acionador e consequência ficam no mesmo enquadramento sempre que possível. Quando não couberem, uma câmera guiada mostra a consequência por no máximo 1,2 s e devolve o controle em piso seguro.
- O mundo alterado permanece visualmente diferente: manivela girada, trava aberta, parede recolhida, pedra encaixada ou aliado livre. O HUD apenas confirma o que a cena já comunica.
- Durante a transformação, ataques inimigos e perigos próximos pausam; o controle só é retomado quando existe apoio seguro.
- O estado final é persistente e idempotente: recarregar não repete a cerimônia nem recria o bloqueio.
- Um mecanismo não pode exigir a travessia que ele próprio ainda precisa liberar.

A câmera direcionada por área e o breve foco na consequência adaptam práticas descritas por Kirby and the Forgotten Land e Tiny Thor: [entrevista da Nintendo sobre câmera, marcos e superfícies](https://www.nintendo.com/en-ca/whatsnew/ask-the-developer-vol-4-kirby-and-the-forgotten-land-part-2/) e [artigo técnico de câmera do Tiny Thor](https://asylumsquare.com/backstage/2017-11-25/Camera-Logic-in-a-2D-Platformer).

### Interações repetidas sem barreira motora

- Repetição serve para dar peso a uma ação, nunca para medir velocidade de dedos.
- Não há cronômetro oculto, perda de progresso entre toques nem exigência de cadência rápida.
- Toda ação de múltiplos toques também aceita manter pressionado o mesmo comando por até 1,5 s; com assistência, um toque completa a ação.
- Cada toque produz avanço visível, som distinto e mudança de pose. Use no máximo quatro etapas para uma interação obrigatória.
- A dica mostra a ação (`ATAQUE`) e o ícone do dispositivo atual; não fixa uma tecla quando teclado, gamepad e touch usam comandos diferentes.
- Nenhum mecanismo exige dois botões simultâneos, gesto de precisão ou alternância rápida.

Essa regra aplica a recomendação oficial da Microsoft de evitar button mashing e oferecer alternativa menos exigente quando houver repetição: [Xbox Accessibility Guideline 107](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107).

## 8. Inimigos como problemas legíveis

Cada inimigo tem um papel espacial único e uma máquina de estados pequena:

`repouso/patrulha → percepção → antecipação → ataque → recuperação`

Princípios:

- ataque perigoso possui antecipação audiovisual de pelo menos 400 ms, ajustada por teste;
- inimigo não inicia ataque fora da câmera nem imediatamente ao entrar nela;
- silhueta e pose deixam clara a função;
- projétil contrasta com fundo, partículas e personagem;
- recuperação oferece passagem ou contra-ataque;
- terreno, paredes e altura participam da solução;
- combinar no máximo dois papéis inimigos no mesmo encontro infantil;
- não juntar ataque rápido, salto cego e abismo;
- inimigos comuns não bloqueiam a conclusão da fase;
- derrota é não gráfica e positiva: tontura, fuga, sono, estrelas ou dissipação.

Antes de criar personagem, definir função, estados, movimentos mínimos, tamanho, pivô, hitbox e chão. Depois seguir `personagem-generator`; design e movimento são fontes separadas.

Mega Man 7 é referência para padrões e combate condicionado pela geometria, mas também alerta contra inimigos rápidos com pouca visibilidade e recompensas de uma tentativa: [análise de Freeze Man Stage](https://themmnetwork.com/2015/07/03/a-critical-look-at-mega-man-7-stages-freeze-man/).

## 9. Portas e aprendizagem

As portas educativas são a espinha dorsal do Reino, não interrupções colocadas a cada distância fixa.

- Três portas por fase, salvo mudança explícita de produto.
- Cada porta fica num pouso seguro e amplo, após reconexão de rotas.
- Nenhum inimigo, projétil, plataforma móvel ou perigo atua durante o desafio.
- Abrir uma porta preserva combo, voz, feedback, checkpoint e configuração pedagógica.
- A paisagem prepara visualmente a chegada: arco, praça, clareira, salão ou plataforma de descanso.
- A aventura ambiental dialoga com o bioma, mas não altera o conteúdo configurável dos exercícios.
- Objetivo obrigatório não fica escondido numa única rota opcional.

## 10. Ritmo, falha e checkpoints

Uma fase alterna tensão e descanso:

`descoberta → prática → porta/descanso → variação → porta/descanso → combinação → guardião → portal`

- Checkpoint após cada grande ato ou porta relevante.
- Checkpoint guarda posição completa ou identidade de superfície.
- Spawn nunca ocorre em perigo, gelo móvel, plataforma quebrável ou alcance imediato de inimigo.
- Cair devolve rapidamente a um estado jogável.
- O trecho entre tentativa e nova ação deve ser curto.
- A criança recebe feedback positivo sobre o que fazer, não uma punição vaga.
- Dificuldade tranquila/normal/aventura modifica tolerância, não a topologia essencial.

## 11. Recompensas e orientação

- Moedas indicam saltos, curvas e rotas rápidas.
- Gema recompensa observação ou domínio.
- Pergaminho recompensa exploração acessível e entrega conhecimento curto.
- Baú fica em desvio intencional, nunca sobreposto a porta ou perigo.
- Recompensa visível comunica que uma rota é válida.
- Item coletável permanece recuperável após queda ou reentrada.
- HUD mostra progresso por marcos da jornada, não apenas por coordenada horizontal.

## 12. Princípios visuais para fases novas e existentes

### Hierarquia

Em todo enquadramento, a ordem de leitura deve ser:

1. cavaleiro;
2. superfície alcançável e perigos;
3. inimigos, projéteis e mecanismos;
4. portas, objetivo e recompensas;
5. decoração e atmosfera.

Contraste de valor, contorno, saturação e movimento separam esses planos. Não depender apenas de cor.

### Profundidade

- **Fundo distante:** silhuetas grandes, baixo contraste e movimento lento.
- **Fundo médio:** arquitetura do bioma e indicação do destino.
- **Plano jogável:** bordas nítidas, cores consistentes e contato visível com o chão.
- **Primeiro plano:** poucos elementos laterais; nunca esconder personagem, ameaça ou pouso.
- Parallax reforça deslocamento e altura, mas não compete com gameplay.

### Arco visual

Cada fase muda ao longo da jornada: manhã para entardecer, clareira para copa, entrada para profundidade, base para cume, seco para chuvoso. A transformação precisa apoiar a progressão e permanecer legível.

### Regras de revitalização visual

- Antes de gerar arte, definir função física, dimensões e posição em cena.
- Toda arte permanente é PNG raster em `public/assets/reino-portas/`.
- Não cobrir falha de layout com decoração.
- Não mudar collider durante uma revisão somente visual sem registrar a mudança na spec.
- Preservar design oficial de personagens existentes.
- Personagem e objeto vivo têm animação ou movimento sutil.
- Reutilizar paleta e materiais por bioma para criar família visual.
- Cada bioma precisa de uma silhueta dominante: copas, telhados, cristais, picos, raízes, estantes, torres ou fornalhas.
- Repetição de asset deve variar composição, não apenas escala aleatória.
- Partículas ambientais são leves e nunca reduzem a leitura.
- Testar 960 x 640 e viewport estreita antes de aprovar o visual.

Donkey Kong Country é referência para atmosfera progressiva e camadas de cenário, especialmente a construção gradual de chuva/neve descrita pela equipe: [produção de Donkey Kong Country](https://www.nintendolife.com/news/2014/02/month_of_kong_the_making_of_donkey_kong_country).

## 13. Arquitetura mínima

- Dados descrevem dimensões, coordenadas, superfícies, rotas, portas, checkpoints, inimigos, mecanismos e marcos.
- Cena decide quando criar, atualizar, bloquear e concluir.
- Entidade implementa estados do ator.
- Sistemas compartilhados só surgem no segundo uso real.
- Uma fase excepcional pode ter layout autoral específico sem exigir gerador universal.
- Valores de mundo, queda, portal e checkpoints vêm do nível; não espalhar `if` por tema.
- Preservar formatos de `localStorage` com fallback para saves antigos.
- Não reorganizar pastas enquanto se altera comportamento.

## 14. Validação mínima de uma fase

### Regras automatizadas

- spawn e checkpoints possuem piso seguro;
- toda porta é alcançável pelas rotas declaradas;
- toda bifurcação volta a um marco obrigatório;
- saltos obrigatórios cabem nos limites medidos do cavaleiro;
- superfícies não se sobrepõem de forma impossível;
- nenhum objetivo obrigatório nasce em gap ou plataforma temporária;
- spritesheets cumprem dimensões, transparência, margens e frames.

### Jogo real

- completar cada rota principal;
- completar sem derrotar inimigos comuns;
- completar caminho essencial sem dash nem pulo duplo;
- cair antes e depois de cada checkpoint;
- sair e reentrar na fase;
- abrir as três portas e concluir o objetivo ambiental;
- testar teclado, touch e gamepad disponível;
- conferir console, áudio e retorno ao EducApp;
- inspecionar física e visual em 960 x 640 e viewport estreita.

### Teste infantil

- a criança identifica o destino e a primeira ação sem ajuda adulta;
- percebe ao menos duas entradas de rota;
- entende o segundo ataque de um inimigo após observar o primeiro;
- não fica mais de 45 segundos sem progresso ou feedback;
- descreve a identidade da fase por lugar e ação, não apenas por cor.

## Checklist curto para toda spec de fase

- [ ] Promessa em uma frase.
- [ ] Uma mecânica principal e até duas de apoio.
- [ ] Apresentar, variar, combinar e concluir.
- [ ] Progressão vertical e câmera definidas.
- [ ] Três bifurcações com reconexão.
- [ ] Caminho essencial possível com corrida e pulo.
- [ ] Portas em áreas seguras.
- [ ] Inimigos com antecipação, ataque e recuperação.
- [ ] Falha rápida e checkpoint seguro.
- [ ] Problema, acionador e consequência formam um ciclo causal visível.
- [ ] Interação repetida possui alternativa por segurar e assistência, sem limite de velocidade.
- [ ] Hierarquia visual e arco atmosférico.
- [ ] Chão, hitboxes, escala e assets definidos.
- [ ] Compatibilidade de save preservada.
- [ ] Rotas, física, regressão e viewports validadas.
