# Erros comuns e prevenção

Este é um registro de falhas reais com risco de reincidência. Antes de especificar ou desenvolver, verifique as entradas relacionadas ao fluxo alterado. Ao adicionar uma falha, registre sintoma, causa, prevenção e validação obrigatória.

## EC-001 — Elementos terrestres não respeitam o chão

**Aplica-se a:** jogos 2D com personagens, inimigos, árvores, construções, obstáculos ou props apoiados; especialmente Reino das Portas.

**Sintoma:** personagem parece flutuar ou afundar; pés deslizam fora da plataforma; árvore nasce acima ou abaixo do terreno; o visual e a colisão discordam.

**Causa recorrente:** posicionar pelo centro ou por um `y` mágico, ignorando margem transparente, base opaca do asset e topo físico da superfície.

**Regra preventiva:** toda cena terrestre define superfícies físicas explícitas. A base opaca de qualquer elemento apoiado coincide com o topo da superfície; o corpo físico do ator termina nos pés. Árvores e objetos enraizados são assentados no chão. Algo só pode flutuar quando isso for comportamento intencional registrado na spec.

**Implementação no Reino:**

- obtenha o piso com `superficieAbaixo`;
- assente props e visuais com `assentarTerrestre`;
- configure atores com `configurarAtorTerrestre`;
- após mudança de frame, escala ou postura, preserve os pés com `alinharCorpoTerrestre`;
- não replique em cenas o cálculo já centralizado em `TerrestreReino.ts` e `GeometriaTerrestre.ts`.

**Validação obrigatória:**

- teste a geometria opaca e o topo apoiável em `GeometriaTerrestre.test.mjs`;
- confira com `physics-debug` a coincidência entre pés/base visual e superfície;
- observe parado, andando, pulando, mudando de frame/escala e sobre plataforma móvel;
- confira pelo menos terreno normal, plataforma e borda; para props, confira que tronco, raiz ou base encostam no chão;
- repita após reentrada na cena e em 960 x 640 e viewport estreita.

**Critério de aceite reutilizável:** para todo elemento terrestre criado ou alterado, a distância visual entre sua base opaca e o piso físico deve permanecer imperceptível durante spawn, animação e movimento.

## EC-002 — Harness Node não inicia comando `.cmd` no Windows

**Aplica-se a:** scripts Node que iniciam `npm.cmd`, `npx.cmd` ou outro wrapper de comando do Windows.

**Sintoma:** `child_process.spawn` falha imediatamente com `spawn EINVAL`.

**Causa recorrente:** tentar executar um arquivo `.cmd` diretamente sem o interpretador de comandos no Windows.

**Regra preventiva:** ao iniciar wrappers `.cmd`, habilite `shell` somente no Windows; mantenha argumentos constantes ou controlados para não introduzir injeção de comando.

**Validação obrigatória:** execute o harness pelo script npm no Windows e confirme que o servidor inicia, o teste termina e o processo filho é encerrado.

## EC-003 — PNG novo usa o tamanho intrínseco como tamanho de gameplay

**Aplica-se a:** imagens raster geradas ou substituídas em sprites, coletáveis, props e interfaces.

**Sintoma:** o objeto parece pequeno por causa da transparência, mas sua área física ou interativa ocupa grande parte da cena; itens são coletados à distância ou colidem sem contato visual.

**Causa recorrente:** trocar uma textura pequena por um PNG de alta resolução e não definir `displaySize` e corpo físico lógico após o carregamento.

**Regra preventiva:** o canvas do arquivo não define o tamanho de gameplay. Todo asset novo deve declarar escala/tamanho visual no consumidor e, quando físico, corpo e offset coerentes com a área opaca.

**Validação obrigatória:** inspecionar a cena com `physics-debug`, verificar contato visual antes do overlap/collider e executar ao menos uma interação real, não apenas confirmar que a cena abriu.
