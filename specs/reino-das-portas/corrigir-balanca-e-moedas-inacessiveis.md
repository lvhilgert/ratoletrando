# Spec: Corrigir encerramento da balança e moedas inacessíveis

Status: Concluída

## Resultado para a criança

Ao equilibrar a balança, a criança volta ao jogo sem travamento. Todas as moedas posicionadas pela fase ficam visíveis e alcançáveis, nunca dentro do terreno.

## Situação atual

- Ao destruir o modal depois da resposta correta, a limpeza da balança chamava `setDraggable` em blocos cujo estado de input já havia sido destruído, causando `Cannot set properties of undefined (setting 'draggable')`.
- `gerarNivelReino` centraliza os layouts das 12 fases, mas os dois construtores de nível convertem todas as plataformas em moedas sem validar interseção com os terrenos.
- A inspeção das 12 fases encontrou moedas cujo volume de 46 x 46 px invade terreno.

## Escopo

- Inclui: encerramento seguro da balança; geração compartilhada de moedas sem interseção com terreno; regra preventiva no MD-base e em erros comuns; teste de regressão.
- Não inclui: redesenho do minijogo, novas moedas ou alteração de recompensas concedidas diretamente por desafios/inimigos.

## Arquitetura e impacto

- Entrada do fluxo: porta com desafio `EQUILIBRAR_BALANCA`; `gerarNivelReino`.
- Arquivos/responsabilidades afetados: `MiniJogoBalancaReino.ts`, `LevelReino.ts`, seu teste, `AGENTS.md` e `ERROS_COMUNS.md`.
- Consumidores verificados: `RenderizadorDesafioReino.ts`, `ReinoDasPortas.ts` e `NiveisExpansaoReino.ts`.
- Estado/persistência: formatos e chaves preservados.
- Assets e animações: sem asset novo; apenas ciclo de vida de tweens existente.
- Personagens: não se aplica.
- Erros comuns aplicáveis: EC-001 (superfícies físicas); nova recorrência de coletável dentro de terreno.

## Decisões de implementação

Usar uma função de geração de moedas no sistema de nível, compartilhada pelos layouts regulares e de expansão. Ela mantém somente moedas cujo volume visual não cruza um terreno. Na limpeza da balança, remover o arraste somente de blocos cujo input ainda existe.

## Critérios de aceite

- [x] Ao completar corretamente a balança, o modal fecha, a física volta e não ocorre erro de runtime.
- [x] Toda moeda gerada nas 12 fases fica fora do volume dos terrenos e sobre uma plataforma de suporte.
- [x] O MD-base proíbe moedas dentro de paredes ou em posições inalcançáveis.
- [x] Comportamentos não relacionados permanecem iguais.

## Plano de validação

- Estática: `npx tsc --noEmit`.
- Regra automatizada: `npm run test:levels` e `npm run test:desafios`.
- Integração: concluir balança em navegador e verificar modal, física e console.
- Visual/interação: conferir em 960 x 640 e viewport estreita; inspecionar moedas junto a superfícies.
- Evidências esperadas: console sem erro e validação geométrica das 12 fases.

## Autorizações necessárias

Nenhuma.

## Resultado da validação

- `npx tsc --noEmit`: passou.
- `npm run test:levels`: passou com 1.200 gerações das 12 fases; nenhuma moeda sobrepôs terreno.
- `npm run test:desafios`: passou com 7.200 gerações das oito famílias.
- `npm run test:balanca-moedas`: passou em 960 x 640 e 390 x 844; cobriu resposta errada, troca do bloco, resposta correta, fechamento do modal, retomada da física e console sem erros.
- Inspeção visual: balança legível e sem recorte nas duas viewports; moedas visíveis junto às superfícies sem atravessar o terreno.
