# Spec: liberar portal após o guardião da fase 8

Status: Concluída

## Resultado para a criança

Ao derrotar o Guardião da Fornalha e abrir as três portas, a criança vê o portal ativar e consegue seguir para a fase 9.

## Situação atual

O portal exige o evento `guardiao-derrotado`. A cena passou a reconhecer guardiões pela propriedade `guardiao`, mas o `MimicoPortaReino` não a declarava; por isso sua derrota visual não chamava `recompensarGuardiao` nem registrava o evento.

## Escopo

- Inclui: restaurar a identificação do Mímico da Porta como guardião.
- Não inclui: alterar combate, dificuldade, fases, assets ou persistência.

## Arquitetura e impacto

- Entrada do fluxo: ataque ao Mímico na fase 8.
- Arquivos/responsabilidades afetados: `MimicoPortaReino.ts`, contrato já existente de `InimigoReino` e consumidores em `ReinoDasPortas.ts`.
- Consumidores verificados: recompensa do guardião, objetivo da aventura, estado visual e colisão do portal, contador de ameaças.
- Estado/persistência: mantém o formato atual; a derrota volta a registrar o evento já previsto.
- Assets e animações: sem alteração.
- Personagens: sem criação ou ampliação visual; apenas corrige a classificação já descrita pelo personagem existente.
- Erros comuns aplicáveis: nenhum.

## Decisões de implementação

Declarar `guardiao=true` no próprio Mímico, restaurando em um ponto a semântica que antes era verificada por `instanceof` em todos os consumidores.

## Critérios de aceite

- [x] Ao derrotar o Mímico da fase 8, `recompensarGuardiao` registra `guardiao-derrotado`.
- [x] Com as três portas abertas e o guardião derrotado, o portal fica pronto e permite concluir a fase 8.
- [x] Guardiões continuam obrigatórios nas fases anteriores, como antes da refatoração.
- [x] Comportamentos não relacionados permanecem iguais.

## Plano de validação

- Estática: `npx tsc --noEmit`.
- Regra automatizada: testes relacionados do Reino (`npm run test:levels`).
- Integração: confirmar que a propriedade usada pelos três consumidores da cena está presente no Mímico.
- Visual/interação: reproduzir a conclusão da fase 8 em 960 x 640 e viewport estreita, verificando portal e console.
- Evidências esperadas: checks sem erro e portal ativado após a derrota.

## Autorizações necessárias

Nenhuma.

## Resultado da validação

- `npx tsc --noEmit`: aprovado.
- `npm run test:levels`: aprovado; 900 gerações, fase vertical e nove microaventuras.
- `node scripts/test-portal-fase8.mjs`: aprovado em 960 x 640 e 390 x 844; validou bloqueio com guardião vivo, derrota por ataque real, evento salvo, portal pronto, reentrada, conclusão da fase e liberação da fase 9.
- Evidências visuais: `test-results/portal-fase8/`; portal ativo e modal “FASE CONCLUÍDA / PICOS DAS TRILHAS” sem recorte nas duas viewports.
- Console: sem erros relacionados ao fluxo testado.
