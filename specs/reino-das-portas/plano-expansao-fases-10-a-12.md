# Reino das Portas — plano de expansão das fases 10 a 12

Status: Concluída — validação técnica

## Resultado para a criança

A criança continuará a jornada depois dos Picos das Trilhas por três fases que parecem aventuras diferentes, não apenas novos cenários:

1. fará moinhos e pontes voltarem a funcionar numa costa com vento;
2. abrirá ruínas móveis e libertará uma raposa presa;
3. conduzirá pedras por um cânion e derrubará uma delas para criar a própria ponte.

Cada fase mantém corrida, pulo, ataque, defesa, dash opcional, três portas educativas, rotas protegida e ágil, checkpoints seguros e um guardião legível. Nenhum caminho obrigatório depende de equipamento comprado, companheiro, dash ou pulo duplo.

## Resumo executivo

| Fase | Tema e promessa | Mecânica principal | Apoios | Transformação memorável |
| --- | --- | --- | --- | --- |
| 10 — Costa dos Moinhos | “Suba do cais ao farol fazendo o vento mover o caminho.” | manivelas cadenciadas | plataformas de moinho e paredes-comporta | as velas giram, uma ponte vira e o farol acende |
| 11 — Ruínas da Lua | “Abra as ruínas adormecidas e liberte a Raposa-Luz.” | paredes movidas por placas lunares | raízes cortáveis e contrapesos | a prisão se abre e a raposa passa a guiar o caminho |
| 12 — Cânion dos Colossos | “Guie pedras gigantes e derrube uma para construir a travessia.” | rochas guiadas por trilho físico | paredes rachadas e rampas basculantes | uma rocha cai, encaixa no abismo e vira ponte |

As três fases formam um arco curto: o farol revela um símbolo lunar; a Raposa-Luz interpreta o símbolo e aponta o cânion; a ponte de pedra leva ao último portal. O arco aparece em gestos e transformações de cenário, sem diálogos longos.

## Situação atual encontrada no projeto

- Há nove regiões, da fase 1 `bosque` à fase 9 `neve`.
- Todos os níveis têm 6.200 px de largura; a fase 9 já possui layout vertical autoral de 1.440 px de altura.
- As fases atuais têm três bifurcações, três portas educativas, checkpoints, inimigos e microaventura persistida por IDs de eventos.
- `AVENTURAS_REINO` já cobre chave, placa, cristais, alavanca, resgate, páginas, corda e guardião.
- A cena já aceita ataque em `Z`, `J`, botão de gamepad e botão touch. A dica inicial mostra apenas `J`; qualquer dica nova deve mostrar a ação “ATAQUE” e o ícone correspondente ao dispositivo.
- O save usa `educapp:reino-portas:v2` e já guarda `aventura: { fase, seed, eventos }`. A expansão não precisa mudar a chave nem criar um segundo formato de progresso.
- `ReinoDasPortas.ts` já coordena muitos mecanismos. A expansão não deve colocar três roteiros extensos diretamente nessa cena.
- Toda superfície terrestre deve usar `superficieAbaixo`, `assentarTerrestre`, `configurarAtorTerrestre` e `alinharCorpoTerrestre`.
- A seleção atual foi ajustada para nove fases; doze cartões exigirão paginação ou rolagem com alvos de toque preservados.

## Estudo das referências

### O que aproveitar

| Referência | Evidência pesquisada | Aplicação no Reino |
| --- | --- | --- |
| Super Mario World | A análise de estrutura mostra evolução por iteração e acumulação, introduzindo ideias antes de combiná-las.^1 | Cada fase ensina sua mecânica em segurança, varia depois e só então combina com inimigo ou altura. |
| Super Mario Bros. Wonder | A equipe preserva a confiança nas regras conhecidas mesmo quando o curso se transforma; também defende concluir “do seu jeito”, com habilidade e raciocínio, e usa animação para comunicar o estado do personagem.^2 ^3 ^4 | As transformações são grandes, mas chão, paredes e controles continuam previsíveis; há rota protegida e ágil; poses deixam intenção e recuperação claras. |
| Donkey Kong Country: Tropical Freeze | Cenário, mecânica e narrativa visual são uma só coisa: moinhos justificam plataformas, máquinas explicam perigos e cada trecho parece parte de um processo.^5 | O moinho move a ponte, as ruínas movem paredes e o cânion usa pedras; nenhuma plataforma temática parece flutuar sem causa. |
| Rayman Legends | O processo descrito pela Ubisoft/GDC aproxima visão artística e direção de gameplay e favorece prototipação rápida dos mundos.^6 | Validar primeiro mapa cinza e causa/efeito; produzir a arte final apenas depois de provar as rotas. |
| Shovel Knight: Specter of Torment | A equipe documenta objetivos por fase, atribui objetos e mecânicas e faz iteração, revisão, teste e balanceamento do macro ao micro.^7 | Cada fase abaixo fixa promessa, verbos, encontros, assets e passes de validação antes da integração. |
| Kirby and the Forgotten Land | A câmera mostra marcos e direção; materiais do cenário destacam diferenças de altura; tolerâncias escondidas reduzem frustração.^8 | Usar enquadramento de destino, bordas jogáveis fortes, coyote/buffer já existentes e câmera breve para mostrar consequências. |
| Mushroom 11 | O tutorial é composto de desafios graduais e focados, com pouca condução verbal.^9 | A primeira manivela, placa ou rocha aparece sem ameaça; a instrução é curta e a ação ensinada pelo próprio espaço. |
| Tiny Thor | A câmera olha na direção do movimento e pode mostrar por instantes a consequência de um interruptor.^10 | Após um mecanismo, foco de até 1,2 s na ponte/parede e retorno ao herói em piso seguro. |
| Xbox Accessibility Guidelines | Toques rápidos repetidos, pressionamentos longos e combinações podem bloquear pessoas; deve existir alternativa menos exigente.^11 | Manivela e rocha aceitam toques sem cronômetro, segurar por até 1,5 s e conclusão por um toque com assistência. |

As decisões das três fases são uma síntese autoral inferida dessas fontes e das regras do projeto. Nenhum layout, personagem, sequência de frames, texto ou asset externo deve ser copiado.

## Regras comuns às três fases

### Estrutura de cada fase

```text
entrada acolhedora
  -> demonstração segura da mecânica
  -> bifurcação 1
  -> porta educativa 1 + checkpoint
  -> variação da mecânica
  -> bifurcação 2
  -> porta educativa 2 + checkpoint
  -> combinação com um inimigo conhecido
  -> bifurcação 3
  -> porta educativa 3 + checkpoint
  -> transformação principal
  -> guardião
  -> portal
```

- Duração-alvo do percurso: 9 a 13 minutos sem contar o tempo nas portas.
- Mundo: `6200 x 1440` por fase.
- Progressão vertical útil: no mínimo 900 px.
- Três zonas de decisão; rotas reconectam antes das portas.
- Pouso obrigatório: largura mínima recomendada de 190 px; praça de porta: 460 px ou mais.
- Trecho seguro antes de mecanismo obrigatório: 220 px sem inimigo nem perigo.
- Checkpoint após cada porta; cerimônia de mecanismo concluída também persiste imediatamente.
- Ataque inimigo: antecipação audiovisual mínima de 500 ms; guardião, 700 ms.
- No máximo dois papéis inimigos simultâneos.
- Nenhum inimigo ataca fora da câmera, durante porta, transformação ambiental ou resgate.
- Queda restitui personagem e mecanismo ao último estado jogável em até 1,2 s.
- O portal exige: objetivo ambiental completo + três portas abertas + guardião superado.

### Gramática das interações

| Ação | Teclado | Gamepad | Touch | Regra |
| --- | --- | --- | --- | --- |
| mover | setas ou A/D | direcional/eixo | botões laterais | não muda |
| pular | seta para cima ou espaço | botão de pulo | botão de pulo | não muda |
| agir/atacar | Z ou J | botão de ataque | botão ATAQUE | sempre o mesmo verbo contextual |
| defender | X/S/baixo | defesa | botão ESCUDO | nunca exigido por mecanismo |

Quando o herói entra a 110 px de um acionador e está apoiado:

1. o acionador ganha contorno luminoso e balança uma vez;
2. aparece por até 2,5 s: `ATAQUE PARA GIRAR`, `ATAQUE A TRAVA` ou `ATAQUE A PEDRA`;
3. cada ataque válido avança uma etapa e produz pose, som e movimento visível;
4. não existe janela de tempo para perder progresso;
5. manter ataque por 1,2 s completa as etapas restantes;
6. com `assistencia=true`, um ataque completa a interação;
7. o evento final é salvo antes da câmera mostrar a consequência.

Não criar um botão “interagir”. O ataque contextual existente basta.

### Câmera de consequência

1. Bloquear dano e parar inimigos da zona.
2. Manter o cavaleiro parado em superfície segura.
3. Panorâmica de 250 ms até a transformação.
4. Permanecer 450 a 700 ms apenas se a consequência não estiver clara em movimento.
5. Voltar em 250 ms.
6. Reativar controle e ameaças.

Se acionador e consequência já estiverem visíveis, não mover a câmera; um pequeno `shake`, som e reação do cenário bastam.

### Estados persistentes

Continuar usando o `Set<string>` atual. IDs propostos:

```text
fase 10: costa-manivela-1-1 .. costa-manivela-1-4
         costa-manivela-2-1 .. costa-manivela-2-4
         costa-manivela-3-1 .. costa-manivela-3-4
         costa-farol-aceso, costa-guardiao-superado

fase 11: lua-placa-1, lua-raiz-cortada, lua-placa-2
         lua-trava-1, lua-trava-2, lua-trava-3
         lua-raposa-liberta, lua-guardiao-superado

fase 12: canion-rocha-1-posicao, canion-parede-1-aberta
         canion-rocha-2-posicao, canion-rampa-2-baixa
         canion-rocha-3-posicao, canion-ponte-formada
         canion-guardiao-superado
```

Eventos intermediários das manivelas existem porque o progresso não pode sumir após reload. Um registrador idempotente restaura diretamente o frame/ângulo correspondente sem repetir som, partículas ou câmera.

---

# Fase 10 — Costa dos Moinhos

## Promessa e identidade

“Suba do cais ao farol fazendo o vento mover o caminho.”

- Cor dominante: azul-turquesa, cobre e tecido coral.
- Silhueta: mastros, rodas d’água, moinhos e farol no alto.
- Arco visual: manhã calma no cais -> rajadas entre telhados -> céu dourado no farol.
- Mecânica principal: manivela de quatro etapas.
- Apoios: plataformas presas a rodas e paredes-comporta.
- Objetivo no HUD: `⚙ ACENDA O FAROL 0/3`.

## Mapa e marcos

| Faixa x | Altura dominante | Conteúdo |
| --- | --- | --- |
| 0–650 | y 1260 | cais inicial, tutorial sem ameaça |
| 650–1900 | y 1260 -> 990 | moinho baixo, bifurcação 1, porta 1 |
| 1900–3500 | y 990 -> 680 | estaleiro, comporta, bifurcação 2, porta 2 |
| 3500–5050 | y 680 -> 390 | falésia, velas móveis, bifurcação 3, porta 3 |
| 5050–6200 | y 390 -> 240 | farol, guardião e portal |

Coordenadas de contrato:

- spawn seguro: `(120, 1140)` sobre terreno de topo `1260`;
- portas: `(1900, 909)`, `(3500, 599)`, `(5050, 309)`;
- checkpoints: `(2040, 950)`, `(3660, 640)`, `(5160, 350)`;
- guardião: `(5540, 275)`;
- portal: `(5960, 220)`;
- limite de queda: `1410`.

## Roteiro passo a passo

### Ato 1 — O moinho parado

1. A câmera abre com o farol apagado no canto superior direito e desce ao cavaleiro no cais.
2. Um moinho pequeno está parado a 420 px. Uma ponte curta ligada à roda está levantada; problema e acionador cabem na mesma tela.
3. A criança se aproxima da manivela em `x=560`. Surge `ATAQUE PARA GIRAR` e quatro dentes vazios ao redor da roda.
4. Cada ataque gira 90 graus, preenche um dente e move a ponte 25% do percurso. Não há inimigos.
5. Quatro ataques sem prazo, segurar por 1,2 s ou um ataque com assistência baixam a ponte. Salvar `costa-manivela-1-1..4`.
6. A ponte trava horizontalmente, recebe corpo estático e permanece assim após reload.
7. Bifurcação 1:
   - protegida: atravessa a ponte larga e contorna armazéns, com um Caranguejo Marinheiro isolado;
   - ágil: sobe em pás lentas do moinho, ganha três moedas e evita o caranguejo;
   - exploração: plataforma baixa sob o cais contém a gema e retorna por mola de carga.
8. As rotas reconectam numa praça seca de 500 px. Porta educativa 1; depois dela, checkpoint.

### Ato 2 — A comporta do estaleiro

9. A criança vê uma parede-comporta fechada e, através de uma janela, o caminho alto atrás dela.
10. Uma Gaivota de Carga demonstra o mergulho sobre chão largo; sombra cresce por 600 ms antes do ataque.
11. A manivela 2 fica num abrigo inferior em `x=2520`; a rota até ela não depende da comporta.
12. A primeira volta levanta a parede 25%; as seguintes revelam gradualmente o outro lado. O som sobe em quatro notas.
13. Na última volta, a comporta para no batente visível. Breve foco de câmera, sem retirar o piso do cavaleiro da tela.
14. Bifurcação 2:
    - protegida: passa pelo túnel aberto, com teto que impede salto alto e oferece cobertura contra a gaivota;
    - ágil: cruza duas plataformas presas a uma roda, amplitude vertical 85 px e pousos de 210 px;
    - exploração: nicho lateral contém pergaminho e volta ao túnel.
15. Um encontro combina um caranguejo no chão e uma gaivota, mas sem gap. A gaivota só inicia mergulho depois de o caranguejo terminar a pinça.
16. Rotas reconectam na oficina. Porta educativa 2; checkpoint.

### Ato 3 — As velas da falésia

17. O farol agora ocupa o fundo médio e continua apagado. Três cabos levam visualmente à última manivela.
18. A manivela 3 em `x=4380` gira as velas da falésia. Cada etapa muda a orientação das plataformas em 90 graus, mas o herói fica numa varanda segura durante a mudança.
19. Após quatro etapas, as plataformas param em posições atravessáveis; não continuam girando sob os pés.
20. Bifurcação 3:
    - protegida: escada de manutenção com quatro patamares largos e um caranguejo evitável;
    - ágil: sequência de três velas fixadas, com moedas marcando saltos; nenhuma exige dash;
    - exploração: desvio atrás de uma lona contém baú e retorna antes da porta.
21. Porta educativa 3 em pátio sem vento mecânico; checkpoint.

### Ato 4 — Farol e guardião

22. Ao entrar no terraço, as três linhas de transmissão acendem. Registrar `costa-farol-aceso`.
23. O farol gira um feixe raster pelo céu e revela o símbolo lunar nas ruínas distantes.
24. O Caranguejo do Farol sai de uma casa de concha, fecha as pinças e bloqueia o caminho, sem atacar por 1 s.
25. Padrão do guardião:
    - patrulha lenta por 2 s;
    - antecipa pinça com olhos e garras erguidas por 800 ms;
    - avança 220 px;
    - bate no batente e fica tonto por 1,4 s;
    - aceita um golpe durante a recuperação;
    - repete três vezes, sem aumentar velocidade.
26. Na derrota, senta tonto, faz sinal de passagem e recolhe as pinças. Registrar `costa-guardiao-superado`.
27. Com farol, portas e guardião completos, o portal acende. A câmera enquadra por menos de 1 s e devolve o controle.

## Inimigos e movimentos

| Personagem | Papel | Estados e timing | Movimento mínimo do asset |
| --- | --- | --- | --- |
| Caranguejo Marinheiro | bloqueio horizontal, evitável por altura | `idle -> walk -> warn 600 ms -> pinch -> recover 900 ms`; anda 55 px/s, alcance 90 px | idle 4f/4fps, walk 6f/8fps, warn 2f/4fps, pinch 3f/10fps, recover 2f/4fps, hurt 1f, defeat 3f/5fps |
| Gaivota de Carga | ameaça aérea anunciada por sombra | `perch -> fly -> shadow 600 ms -> dive -> climb 1 s`; só mergulha com área de pouso visível | perch 2f/3fps, fly 6f/9fps, warn 2f/4fps, dive 3f/10fps, recover 3f/7fps, defeat 3f/5fps |
| Caranguejo do Farol | guardião de leitura e contra-ataque | ciclo descrito no ato 4; 3 acertos; nunca toca porta ou portal durante ataque | idle 4f, walk 6f, warn 3f, charge 4f, crash 3f, dizzy 4f, hurt 1f, defeat 4f |

Todos usam derrota cômica, sem destruição gráfica. Caranguejos assentam os pés/casco no chão; gaivota declara altitude intencional e sombra separada.

## Falhas e recuperação

- Sair da manivela mantém as etapas já feitas.
- Cair durante rota de velas retorna ao checkpoint; as velas permanecem travadas se concluídas.
- Plataforma de roda nunca para numa posição que prende o cavaleiro contra parede.
- Se um corpo móvel perder sincronismo, reposicionar no batente mais próximo antes de reativar colisão.
- Guardião não recupera vida após queda do jogador; recupera apenas ao reiniciar a fase com nova seed.

---

# Fase 11 — Ruínas da Lua

## Promessa e identidade

“Abra as ruínas adormecidas e liberte a Raposa-Luz.”

- Cor dominante: violeta noturno, pedra clara e verde-musgo.
- Silhueta: arcos quebrados, discos lunares, aquedutos e grades.
- Arco visual: entrada sob lua crescente -> pátios profundos -> santuário iluminado após o resgate.
- Mecânica principal: placas lunares que deslocam paredes entre batentes.
- Apoios: raízes cortáveis e contrapesos.
- Objetivo no HUD: `♡ LIBERTE A RAPOSA 0/3 TRAVAS`.

## Mapa e marcos

A fase forma um “V”: começa alta, desce até a prisão e sobe ao portal. O destino é mostrado cedo para impedir que a descida pareça retrocesso.

| Faixa x | Altura dominante | Conteúdo |
| --- | --- | --- |
| 0–650 | y 320 | mirante inicial e visão da prisão ao fundo |
| 650–1850 | y 320 -> 620 | primeira parede, bifurcação 1, porta 1 |
| 1850–3500 | y 620 -> 1020 | aqueduto, raiz, bifurcação 2, porta 2 |
| 3500–5050 | y 1020 -> 650 | prisão, três travas, resgate, bifurcação 3, porta 3 |
| 5050–6200 | y 650 -> 300 | subida guiada pela raposa, guardião e portal |

Coordenadas de contrato:

- spawn: `(120, 200)` sobre topo `320`;
- portas: `(1850, 539)`, `(3500, 939)`, `(5050, 569)`;
- checkpoints: `(1990, 580)`, `(3630, 980)`, `(5160, 610)`;
- prisão: `(4230, 1040)`;
- guardião: `(5520, 380)`;
- portal: `(5960, 260)`;
- limite de queda: `1410`.

## Roteiro passo a passo

### Ato 1 — A parede que acorda

1. A câmera mostra por 900 ms a Raposa-Luz atrás de uma grade distante. Ela ergue a cauda luminosa e aponta para um disco lunar.
2. O controle começa em piso largo. Um mural raster mostra pé sobre uma lua; não há texto obrigatório.
3. Ao pisar na placa em `x=520`, uma parede desliza 120 px até o batente em 700 ms. A consequência fica na mesma tela.
4. A placa fica acesa e a parede não volta. Registrar `lua-placa-1`.
5. Bifurcação 1:
   - protegida: desce por três patamares largos atrás da parede;
   - ágil: usa o topo da parede como plataforma antes de ela terminar o curso; existe pouso de correção abaixo;
   - exploração: alcova visível contém gema e reconecta pelo patamar inferior.
6. Um Morcego dos Ecos existente aparece sozinho; seu ataque é conhecido e há teto alto suficiente para evitá-lo.
7. Porta educativa 1 em arco lunar; checkpoint.

### Ato 2 — Raiz e contrapeso

8. Uma raiz grossa prende a segunda parede. O contrapeso balança do outro lado, deixando clara a causa.
9. Ao se aproximar, surge `ATAQUE A RAIZ`. Um golpe corta a raiz; não exigir repetição.
10. A raiz recolhe, o peso desce e a parede sobe. Registrar `lua-raiz-cortada` e `lua-placa-2` após o batente.
11. Bifurcação 2:
    - protegida: acompanha o aqueduto inferior, coberto contra o morcego;
    - ágil: salta pelo contrapeso e pelas cornijas superiores;
    - exploração: uma varanda atrás da antiga parede contém pergaminho e retorna pela rampa.
12. Uma Planta do Reino existente protege uma recompensa, não o caminho. Morcego e planta nunca atacam ao mesmo tempo.
13. A prisão reaparece no fundo, agora maior e mais clara. A raposa reage com `hope`.
14. Porta educativa 2; checkpoint.

### Ato 3 — As três travas

15. A tela da prisão não contém inimigos, projéteis, piso móvel ou perigo.
16. Há três travas grandes na grade, visualmente numeradas por luas crescente, meia e cheia; não depender só de cor.
17. Cada trava exige um golpe. Após o golpe:
    - a trava gira e cai para dentro da cena;
    - a raposa executa `hope`;
    - o HUD avança `1/3`, `2/3`, `3/3`;
    - o evento é salvo antes da próxima reação.
18. As travas ficam em alturas alcançáveis pelo ataque no chão; não exigir pulo + ataque simultâneo.
19. Na terceira, a grade sobe, a raposa espera 500 ms, olha para ambos os lados e corre até o cavaleiro. Registrar `lua-raposa-liberta`.
20. A Raposa-Luz faz três saltinhos, aponta a saída e corre até o começo da bifurcação 3. Texto curto: `SIGA A LUZ!`.
21. Bifurcação 3:
    - protegida: segue pegadas lunares da raposa por rampas largas;
    - ágil: sobe pelos arcos quebrados; a raposa aparece em mirantes, mas não é plataforma;
    - exploração: desvio curto sob o aqueduto contém baú e saída sinalizada.
22. A raposa espera em cada reconexão; nunca pode cair, receber dano, bloquear o herói ou ficar para trás.
23. Porta educativa 3 no santuário; checkpoint.

### Ato 4 — Sentinela e portal

24. O Sentinela de Musgo acorda quando a raposa ilumina o símbolo no peito dele.
25. Padrão do guardião:
    - observa por 900 ms e mostra a direção do ataque;
    - bate os braços no chão, criando duas ondas baixas lentas;
    - a criança pula uma onda ou sobe num bloco lateral;
    - o núcleo permanece exposto por 1,5 s;
    - três acertos, sem acelerar; a terceira rodada usa duas ondas com intervalo amplo de 700 ms.
26. A raposa fica em plataforma de fundo, reage e nunca participa fisicamente do combate.
27. Ao ser superado, o Sentinela ajoelha, o musgo floresce e ele abre passagem. Registrar `lua-guardiao-superado`.
28. A raposa toca o portal, transforma a luz em seta para o cânion e sai por uma passagem segura.

## Personagens e movimentos

| Personagem | Fonte de design | Estados e movimento mínimo |
| --- | --- | --- |
| Raposa-Luz | novo character master autoral; silhueta distinta da Raposa Curiosa por cauda branca luminosa e pingente lunar | cage_idle 4f/4fps, alert 3f, hope 4f, freed 4f, run 6f/9fps, point 3f, celebrate 4f |
| Morcego dos Ecos | reutilizar asset e entidade existentes | nenhuma animação nova; apenas distribuição e tempo de ativação |
| Planta do Reino | reutilizar asset e entidade existentes | nenhuma animação nova; serve recompensa opcional |
| Sentinela de Musgo | novo character master, estátua arredondada e protetora, não assustadora | sleep 2f, wake 4f, warn 3f, slam 4f, recover 4f, hurt 1f, kneel 4f |

Se o jogador estiver com a Raposa Curiosa equipada, ambas continuam distinguíveis: a companheira mantém design atual e a Raposa-Luz usa cauda branca, pingente e escala 15% maior. Não esconder silenciosamente equipamento comprado.

## Falhas e recuperação

- Parede móvel tem batentes visuais e corpo desativado durante tween; reativa somente ao terminar.
- Se o jogador ficar na área de fechamento, a parede não se move até a área ficar livre; nesta fase as paredes obrigatórias só abrem, nunca fecham.
- Travas abertas não reaparecem após checkpoint/reload.
- O resgate nunca começa com inimigo ativo na câmera.
- A raposa teleporta com brilho ao próximo ponto de espera se ficar 900 px atrás; isso é apresentação, não mecânica exigida.
- Cair depois do resgate restaura a raposa no ponto de espera seguinte ao checkpoint.

---

# Fase 12 — Cânion dos Colossos

## Promessa e identidade

“Guie pedras gigantes e derrube uma para construir a travessia.”

- Cor dominante: laranja, areia clara e basalto azul-escuro.
- Silhueta: pilares enormes, trilhos escavados, pontes naturais e estátuas de gigantes.
- Arco visual: planalto ao amanhecer -> fundo do cânion -> ponte formada sob céu aberto.
- Mecânica principal: rocha guiada e persistente.
- Apoios: paredes rachadas e rampas basculantes.
- Objetivo no HUD: `● FORME A PONTE 0/3 ETAPAS`.

## Regra técnica da rocha

A rocha parece pesada, mas não usa física livre capaz de sair do mapa. Ela se move num corredor de trilho declarado pelo nível:

- repousa em encaixes seguros;
- cada ataque do lado correto avança uma marca do trilho;
- três marcas completam o trecho; segurar ataque ou assistência também funciona;
- se atacada do lado errado, balança e uma seta no chão indica a direção, sem perder progresso;
- ao chegar ao encaixe, troca para estado estático e salva o evento;
- queda fora do corredor reposiciona no último encaixe salvo;
- na ponte final, uma animação controlada termina antes de criar a `Surface` definitiva.

Isso entrega peso e causa visual sem permitir softlock por simulação imprevisível.

## Mapa e marcos

| Faixa x | Altura dominante | Conteúdo |
| --- | --- | --- |
| 0–650 | y 360 -> 560 | tutorial da rocha e parede rachada |
| 650–1900 | y 560 -> 820 | descida, bifurcação 1, porta 1 |
| 1900–3600 | y 820 -> 1180 | rampa basculante, bifurcação 2, porta 2 |
| 3600–5100 | y 1180 -> 760 | rocha da ponte, bifurcação 3, porta 3 |
| 5100–6200 | y 760 -> 300 | arena do colosso e portal alto |

Coordenadas de contrato:

- spawn: `(120, 240)` sobre topo `360`;
- portas: `(1900, 739)`, `(3600, 1099)`, `(5100, 679)`;
- checkpoints: `(2020, 780)`, `(3710, 1140)`, `(5220, 720)`;
- gap da ponte: `x=4470..4750`, largura 280 px;
- guardião: `(5540, 400)`;
- portal: `(5960, 260)`;
- limite de queda: `1410`.

## Roteiro passo a passo

### Ato 1 — Pedra contra parede

1. A câmera mostra uma parede rachada e uma rocha redonda no mesmo enquadramento.
2. O primeiro trilho possui três marcas grandes no chão. Não há inimigo.
3. Texto curto: `ATAQUE A PEDRA`.
4. Cada golpe move a rocha uma marca, levanta poeira efêmera e aprofunda a pose do cavaleiro; não usar velocidade do ataque como requisito.
5. No terceiro avanço, a rocha toca a parede. A parede treme, mas só quebra depois de 500 ms para a criança perceber causa e efeito.
6. Abertura larga de 150 px, sem fragmentos físicos perigosos. Registrar `canion-rocha-1-posicao` e `canion-parede-1-aberta`.
7. Bifurcação 1:
   - protegida: atravessa a abertura e desce por zigue-zague largo;
   - ágil: usa o topo quebrado como atalho de salto;
   - exploração: nicho atrás de um fragmento contém gema e retorna por rampa.
8. Um Tatu-Pedra demonstra patrulha e enrolamento num piso sem abismo.
9. Porta educativa 1; checkpoint.

### Ato 2 — Peso sobre a rampa

10. A segunda rocha fica num encaixe alto; abaixo, uma rampa levantada impede a rota protegida.
11. A criança vê linhas gravadas ligando o encaixe ao pivô da rampa.
12. Três ataques guiam a rocha até a plataforma de peso. A plataforma desce, a rampa bascula e trava.
13. Registrar `canion-rocha-2-posicao` e `canion-rampa-2-baixa`; câmera mostra o batente por até 1 s.
14. Bifurcação 2:
    - protegida: desce pela rampa larga, com cobertura contra um Urubu do Cânion;
    - ágil: atravessa pilares altos antes do fundo do cânion;
    - exploração: plataforma atrás do contrapeso contém pergaminho.
15. Encontro combinado em chão contínuo: Tatu-Pedra rola primeiro; Urubu só larga a pedrinha depois de o tatu entrar em recuperação.
16. Porta educativa 2 no fundo do cânion; checkpoint.

### Ato 3 — A ponte de pedra

17. Do mirante, a criança vê o grande gap, a saída do outro lado e a terceira rocha acima de uma rampa.
18. A rota até a rocha usa plataformas fixas; não depende da futura ponte.
19. Três ataques movem a rocha até o topo da rampa. Registrar `canion-rocha-3-posicao`.
20. No encaixe final, um último ataque contextual solta o calço, não a própria rocha. Texto: `ATAQUE O CALÇO`.
21. A rocha rola por trajetória controlada, cai no centro do gap, encaixa entre dois pilares e para. Partículas não encobrem a aterrissagem.
22. Depois do impacto, criar uma superfície estática de 300 px alinhada ao topo dos dois lados; a rocha visual e a colisão compartilham a mesma base.
23. Registrar `canion-ponte-formada` antes de devolver o controle.
24. Bifurcação 3:
    - protegida: cruza a ponte de rocha, larga e sem inimigo;
    - ágil: passa por quatro pilares laterais acima do gap; há plataforma de recuperação sob os dois primeiros saltos;
    - exploração: alcova antes do calço contém baú e volta ao mirante.
25. Porta educativa 3 depois da reconexão; checkpoint.

### Ato 4 — Gigante de Basalto

26. A arena mostra três pilares rachados, um de cada lado e um ao fundo. O Gigante de Basalto acorda sentado.
27. Padrão do guardião:
    - aponta a direção e pisa duas vezes por 900 ms;
    - investe horizontalmente por no máximo 300 px;
    - se o cavaleiro sair da linha, bate num pilar rachado;
    - o pilar solta uma pedra pequena que atinge o ombro do gigante, deixando-o tonto por 1,6 s;
    - o cavaleiro toca/ataca o símbolo exposto uma vez;
    - três ciclos, um por pilar; sem aumento de velocidade.
28. A arena não tem abismo. Erro causa dano normal, não reinicia o puzzle.
29. Ao final, o gigante senta, esfrega a cabeça, reorganiza duas pedras para formar degraus e faz sinal de amizade. Registrar `canion-guardiao-superado`.
30. O portal final acende somente com ponte, portas e guardião completos. A Raposa-Luz aparece no fundo e comemora, sem criar requisito adicional.

## Inimigos e movimentos

| Personagem | Papel | Estados e timing | Movimento mínimo do asset |
| --- | --- | --- | --- |
| Tatu-Pedra | patrulha que vira perigo horizontal | `walk -> curl warn 650 ms -> roll 260 px -> dizzy 1,1 s`; não rola perto de borda | walk 6f/8fps, warn 3f/5fps, roll 4f/10fps, dizzy 3f/5fps, hurt 1f, defeat 3f |
| Urubu do Cânion | ameaça vertical com alvo no chão | `perch -> aim 700 ms -> drop -> recover 1,2 s`; sombra e círculo mostram queda | perch 2f, fly 6f, warn 3f, drop 2f, recover 3f, defeat 3f |
| Gigante de Basalto | guardião de isca espacial | ciclo descrito no ato 4; três exposições; corpo grande, arena sem contato inesperado | sleep 2f, wake 4f, warn 4f, charge 5f, impact 4f, dizzy 4f, hurt 1f, sit 4f |

## Falhas e recuperação

- A rocha sempre possui `ultimoEncaixe`; nunca volta ao início após um avanço salvo.
- O cavaleiro não pode ficar entre rocha e parede: zona de esmagamento apenas empurra gentilmente para o lado seguro e cancela o avanço.
- Fragmentos de parede são somente animação/partículas e não têm física.
- A ponte só recebe colisão quando a animação termina; durante a queda da rocha, o cavaleiro permanece no mirante seguro.
- Reload com `canion-ponte-formada` cria diretamente visual e superfície finais.
- Se o gigante perder alvo, retorna ao centro e ao estado de antecipação; não investe fora da arena.

---

## Direção de arte e assets

Toda arte final é PNG raster em `public/assets/reino-portas/`. Não usar HTML/CSS, primitivas Phaser visíveis nem placeholder procedural. Efeitos efêmeros simples continuam permitidos.

### Cenário mínimo

| Fase | Assets indispensáveis |
| --- | --- |
| Costa | fundo vertical/parallax da costa; terreno de madeira/pedra; moinho com base e velas; manivela em 5 estados; ponte articulada; comporta com batentes; plataformas-vela; farol apagado/aceso; sombra de gaivota |
| Ruínas | fundo das ruínas lunares; terreno de pedra/musgo; placa apagada/acesa; parede e batentes; raiz inteira/cortada; contrapeso; grade; três travas distintas; pegadas lunares; aqueduto e arcos |
| Cânion | fundo vertical do cânion; terreno de arenito/basalto; rocha em repouso/movimento; trilho com marcas; parede inteira/rachada/aberta; rampa e pivô; calço; rocha-ponte final; pilares do guardião |

Antes de gerar cada asset, declarar tamanho visual e collider. Spritesheets usam células uniformes, margem mínima de 8 px ou 4% e nenhum pixel opaco nas bordas.

### Pipeline de personagens

Aplicar `personagem-generator` separando design e movimento:

1. procurar referências locais de movimento em `referencias/movimentos/`;
2. preservar assets existentes de Morcego e Planta;
3. criar um `character master` autoral para cada novo personagem;
4. derivar somente os estados listados neste plano;
5. gerar cada ciclo como conjunto coerente, nunca frames independentes;
6. exportar em `public/assets/reino-portas/personagens/<personagem>/`;
7. incluir `source.json` com ferramenta, criação original e referências estruturais/licenças;
8. validar identidade, transparência, células, pivô, chão, hitbox, frame range, FPS e playback.

Não baixar ou incorporar assets das obras estudadas. Elas são referência de princípios apenas.

## Arquitetura mínima recomendada

### Dados

- Acrescentar `costa`, `ruinas-lua` e `canion` a `TemaReino` e `REGIOES_REINO`.
- Acrescentar apenas os novos tipos realmente usados: `caranguejo`, `gaivota`, `caranguejo-farol`, `sentinela-musgo`, `tatu-pedra`, `urubu`, `gigante-basalto`.
- Manter fases 1–8 no gerador atual e registrar fases 9–12 como builders autorais explícitos.
- Extrair os três novos layouts para um único `NiveisExpansaoReino.ts` somente para impedir que `LevelReino.ts` e a cena recebam centenas de coordenadas. Não criar gerador universal.
- Acrescentar `controladoPor?: string` ao gap somente porque a ponte da fase 12 cria o segundo uso real de um abismo largo controlado. O validador permite largura acima do salto apenas quando o evento declarado cria uma superfície obrigatória e a rota até o acionador independe dela.

### Mecanismos

Criar um único `MecanismosExpansaoReino.ts` com funções concretas, não uma hierarquia:

```ts
criarManivela(...)
criarParedeMovel(...)
criarRochaGuiada(...)
criarGradeComTravas(...)
restaurarEstadoMecanismo(...)
```

As funções recebem cena, superfícies, posições e callback de evento. A cena continua decidindo quando criar, pausar ameaças, salvar e concluir.

### Inimigos

- Uma entidade por personagem com estado próprio.
- `CriarInimigoReino.ts` apenas seleciona o construtor.
- Guardiões novos usam `guardiao=true`, mas não devem herdar entre si além do contrato já existente de `InimigoReino`.
- Morcego e Planta são reutilizados sem variantes cosméticas desnecessárias.

### Persistência

- Preservar `educapp:reino-portas:v2`.
- Reusar `aventura.eventos`; não criar booleanos por fase.
- `selectedLevel`, `faseAtual`, `checkpointLevel`, colecionáveis e contadores passam a aceitar índices 9–11.
- Saves antigos continuam válidos por fallback.

### Seleção de fase

- Manter cartões grandes.
- Usar duas páginas de seis cartões ou rolagem vertical com snap; preferir duas páginas por ser mais previsível para crianças.
- Botões `ANTERIORES` e `PRÓXIMAS` com pelo menos 56 px de altura.
- A página atual deve preservar foco de teclado, touch e retorno da fase.

## Ordem de implementação

### Etapa 1 — Contratos e mapa cinza

1. Ampliar tipos de tema/inimigo e seleção para 12 fases.
2. Declarar os três níveis autorais com superfícies, paredes, gaps, portas e checkpoints.
3. Validar todos os saltos com movimento real do cavaleiro.
4. Provar cada rota sem dash e sem pulo duplo.
5. Criar testes determinísticos de marcos, rotas, pisos e gaps.

### Etapa 2 — Estado e mecanismos

1. Implementar progresso gradual/idempotente das manivelas.
2. Implementar paredes com batentes e zona anti-esmagamento.
3. Implementar grade/travas e restauração do resgate.
4. Implementar rocha guiada por encaixes e ponte estática final.
5. Testar reload após cada etapa intermediária.

### Etapa 3 — Inimigos e guardiões

1. Reutilizar Morcego e Planta na fase 11.
2. Produzir masters antes dos spritesheets novos.
3. Implementar um inimigo por vez e validar antecipação/recuperação isoladas.
4. Montar encontros de dois papéis somente depois dos isolados.
5. Implementar guardiões em arenas sem abismo e sem regra nova.

### Etapa 4 — Arte e resposta do mundo

1. Produzir fundos, terrenos e mecanismos raster finais.
2. Substituir completamente o mapa cinza antes de considerar fase pronta.
3. Integrar animação, som, partículas e câmera de consequência.
4. Confirmar que cada transformação mantém um estado visual final inequívoco.

### Etapa 5 — Pedagogia, progresso e acabamento

1. Posicionar portas somente nas praças seguras descritas.
2. Preservar desafios configuráveis, voz, combo e feedback atuais.
3. Integrar gema, pergaminho e baús apenas em desvios recuperáveis.
4. Atualizar mapa da jornada, contadores e conclusão após 12 fases.
5. Balancear quantidades e tempos com crianças de 6 a 8 anos.

## Critérios de aceite

### Comuns

- [ ] As fases 10, 11 e 12 aparecem em cartões grandes, navegáveis por teclado, touch e gamepad.
- [ ] Cada fase possui mundo `6200 x 1440`, três bifurcações completas e ao menos 900 px de progressão vertical útil.
- [ ] Corrida e pulo básico completam o caminho essencial.
- [ ] Cada fase tem uma transformação ambiental exclusiva, visível e persistente.
- [ ] Problema, acionador e consequência obedecem ao ciclo causal das diretrizes.
- [ ] Toda interação repetida aceita toques sem prazo, segurar e assistência.
- [ ] Todas as dicas exibem a ação/dispositivo correto; nenhuma afirma que apenas `J` ou apenas `Z` funciona.
- [ ] As três portas ficam em superfícies fixas, sem ameaça ativa, e continuam usando o sistema pedagógico existente.
- [ ] O portal exige objetivo, três portas e guardião.
- [ ] Nenhum inimigo comum é obrigatório; cada encontro pode ser evitado por rota, altura ou timing.
- [ ] Ataques mostram antecipação e recuperação; nenhum começa fora da câmera.
- [ ] Checkpoint/reload restaura posição, portas e estado exato do mecanismo.
- [ ] Nenhum asset ausente produz placeholder do Phaser.
- [ ] Todo apoio visual coincide com superfície física; corpos e tamanhos não dependem do PNG intrínseco.
- [ ] Fases 1–9, voo do dragão, loja, equipamentos e saves antigos permanecem funcionais.

### Fase 10

- [ ] A primeira manivela ensina a ação sem inimigo.
- [ ] As três manivelas exibem quatro etapas e persistem em qualquer etapa.
- [ ] Ponte, comporta e velas terminam em posições seguras e inequívocas.
- [ ] Farol acende somente após as três manivelas.
- [ ] Caranguejo e gaivota são legíveis isolados antes do encontro combinado.
- [ ] O Caranguejo do Farol oferece três recuperações de 1,4 s e não acelera.

### Fase 11

- [ ] A Raposa-Luz e a prisão são vistas antes do primeiro desvio.
- [ ] Paredes só abrem e nunca esmagam ou prendem o jogador.
- [ ] As três travas são alcançáveis do chão e registradas separadamente.
- [ ] O resgate acontece sem ameaça e sobrevive a reload.
- [ ] A raposa guia sem bloquear, sofrer dano ou virar requisito de precisão.
- [ ] O Sentinela de Musgo possui ondas contrastantes e arena sem gap.

### Fase 12

- [ ] As rochas permanecem em trilhos/encaixes e recuperam o último estado salvo.
- [ ] Ataque do lado errado orienta, mas não pune.
- [ ] A parede rachada, a rampa e a ponte mostram causa e consequência.
- [ ] A ponte final cria visual e superfície alinhados somente após o impacto.
- [ ] O caminho até o calço independe da ponte.
- [ ] O Gigante de Basalto usa três pilares previsíveis e não aumenta a velocidade.

## Plano de validação

### Estática e regras

Executar:

```text
npx tsc --noEmit
npm run build
npm run test:levels
npm run test:terrestres
npm run test:sprites
npm run test:arte
npm run test:desafios
npm run test:smoke
```

Adicionar o menor teste puro que cubra:

- 100 seeds por fase nova;
- spawn/checkpoint/porta com piso;
- três bifurcações reconectadas;
- mecanismos antes dos bloqueios;
- manivela aceita 0–4 etapas e restaura todas;
- paredes não fecham sobre zona ocupada;
- rocha restaura último encaixe;
- ponte só existe após evento final;
- IDs únicos e compatibilidade de save.

### Navegador

Testar em `960 x 640` e viewport estreita:

1. concluir cada rota protegida;
2. concluir cada rota ágil sem dash/pulo duplo;
3. abandonar e retomar cada interação intermediária;
4. cair antes e depois de cada checkpoint;
5. recarregar página em cada etapa da manivela, trava e rocha;
6. tentar portal com cada requisito faltante;
7. concluir cada guardião;
8. trocar de fase e confirmar nova seed/eventos limpos;
9. retornar ao EducApp;
10. verificar console, áudio, texturas e ausência de rolagem externa.

Evidências mínimas por fase:

- início com destino visível;
- primeira demonstração;
- cada bifurcação;
- cada porta em repouso seguro;
- transformação principal antes/depois;
- guardião em antecipação e recuperação;
- portal pronto;
- uma captura estreita de interação touch.

### Teste com crianças de 6 a 8 anos

Meta inicial, com cinco crianças:

- 4/5 identificam a primeira ação sem ajuda adulta;
- 4/5 explicam o que o mecanismo mudou depois da primeira demonstração;
- 4/5 reconhecem duas entradas de rota;
- 4/5 evitam o segundo ataque de cada inimigo após observar o primeiro;
- 5/5 conseguem completar manivela e rocha por alguma modalidade de entrada;
- nenhuma fica mais de 45 s sem progresso ou feedback;
- nenhuma confunde decoração com superfície ou perigo;
- a descrição espontânea de cada fase contém lugar + ação, não apenas cor.

Se a meta falhar, ajustar primeiro enquadramento, contraste, pousos, antecipação e feedback. Não aumentar texto como primeira correção.

## Riscos e contenções

| Risco | Contenção |
| --- | --- |
| Escopo de sete personagens novos | Reutilizar Morcego e Planta; criar somente ciclos consumidos; concluir uma fase inteira antes da próxima. |
| Cena principal crescer demais | Um arquivo de layouts e um de mecanismos concretos; sem framework genérico. |
| Manivela virar button mashing | Sem prazo, quatro etapas, segurar e assistência. |
| Parede prender criança | Só abertura obrigatória, batentes, zona de ocupação e corpo desativado durante movimento. |
| Rocha gerar softlock | Corredor guiado, encaixes persistentes e ponte final determinística. |
| Câmera causar enjoo | Dead zone existente; panorâmica curta só com herói seguro; não seguir todo salto. |
| Fase 11 confundir duas raposas | Raposa-Luz tem master, silhueta, pingente, cauda e escala distintos; companheira comprada permanece visível. |
| Portal ou porta ficar fora do andar correto | Coordenadas vindas do nível e validação de superfície, nunca `y` mágico na cena. |
| Asset grande alterar hitbox | Declarar `displaySize`, corpo e offset por consumidor conforme EC-003. |
| Doze cartões encolherem | Paginar em duas telas de seis, sem reduzir alvos. |

## Fora de escopo

- inventário de itens de puzzle;
- novo botão de interação;
- wall-jump, escalada livre ou voo nas fases terrestres;
- física destrutível geral;
- editor ou gerador universal de mecanismos;
- diálogo ramificado;
- bestiário novo;
- variações cosméticas dos inimigos reutilizados;
- download ou incorporação de assets dos jogos pesquisados.

## Autorizações necessárias

- Pesquisa web: autorizada explicitamente pelo usuário em 9 de setembro de 2026; realizada somente para estudo.
- Download de assets externos: não autorizado nem necessário para este plano.
- Implementação futura e geração de arte original: fazem parte de uma tarefa posterior; qualquer novo acesso à internet continuará exigindo autorização imediatamente antes do uso.

## Resultado da validação desta especificação

- Implementadas as fases 10–12 com layouts autorais de `6200 x 1440`, três rotas, portas, checkpoints, inimigos, guardiões, objetivos ambientais e save v2 idempotente.
- Implementadas duas páginas de seis cartões, navegáveis por teclado, gamepad e touch, sem reduzir os alvos.
- Produzidos três fundos, atlas de mecanismos e folhas de quatro estados para oito personagens; todos são PNGs raster originais com procedência local e margens transparentes validadas.
- `npx tsc --noEmit`, `npm run build`, `test:levels` (1.200 gerações), `test:mecanismos`, `test:terrestres`, `test:sprites`, `test:arte`, `test:desafios`, `test:neve`, `test:expansao` e `test:smoke` passaram.
- O teste visual abriu as três fases em `960 x 640` e `390 x 844`, acionou e conferiu os eventos finais dos mecanismos, verificou elenco, texturas, placeholders, margens, console e rolagem externa. Evidências: `test-results/expansao-reino/`.
- O teste presencial com cinco crianças permanece uma validação externa de produto; não é simulável pelo harness automatizado.

## Fontes

1. The Game Design Forum. “[Reverse Design: Super Mario World](https://thegamedesignforum.com/features/RD_SMW_5.html).” Acesso em 9 set. 2026.
2. Nintendo. “[Ask the Developer Vol. 11, Super Mario Bros. Wonder — Chapter 1](https://www.nintendo.com/en-gb/News/2023/October/Ask-the-Developer-Vol-11-Super-Mario-Bros-Wonder-Chapter-1-2460393.html).” 25 out. 2023.
3. Nintendo. “[Ask the Developer Vol. 11, Super Mario Bros. Wonder — Chapter 3](https://www.nintendo.com/au/news-and-articles/ask-the-developer-vol-11-super-mario-bros-wonder-chapter-3/).” 19 out. 2023.
4. Nintendo. “[Ask the Developer Vol. 11, Super Mario Bros. Wonder — Bringing the Details to Life](https://www.nintendo.com/sg/interview/aqmx/02.html).” 2023.
5. Meristation. “[Análisis de Donkey Kong Country: Tropical Freeze](https://as.com/meristation/2018/05/01/analisis/1525179600_175284.html).” 1 maio 2018.
6. Game Developer. “[The Tools Used to Design Rayman Legends](https://www.gamedeveloper.com/design/video-the-tools-used-to-design-i-rayman-legends-i-).” 31 jan. 2018; apresentação original da GDC 2014.
7. Yacht Club Games. “[Specter of Torment Level Design Deep Dive](https://www.yachtclubgames.com/blog/specter-of-torment-level-design-deep-dive-1-5/).” 21 jan. 2020.
8. Nintendo. “[Ask the Developer Vol. 4: Kirby and the Forgotten Land — Part 2](https://www.nintendo.com/en-ca/whatsnew/ask-the-developer-vol-4-kirby-and-the-forgotten-land-part-2/).” 2022.
9. Itay Keren, GDC Vault. “[Teaching by Design: Tips for Effective Tutorials from Mushroom 11](https://www.gdcvault.com/play/1024187/Teaching-by-Design-Tips-for).” GDC 2017.
10. Asylum Square. “[Camera Logic in a 2D Platformer](https://asylumsquare.com/backstage/2017-11-25/Camera-Logic-in-a-2D-Platformer).” 25 nov. 2017.
11. Microsoft. “[Xbox Accessibility Guideline 107: Input](https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107).” Acesso em 9 set. 2026.
