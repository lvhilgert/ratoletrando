# Spec: refatoração arquitetural do EducApp

Status: Concluída

## Resultado para a criança

Os oito jogos continuam funcionando e parecendo os mesmos, mas carregam apenas seus próprios recursos, mantêm personagens/objetos corretamente apoiados e ficam mais seguros para evoluir sem regressões.

## Situação atual

- `Carregamento.ts` carrega os assets de todos os jogos na inicialização.
- `ReinoDasPortas.ts` concentra mundo, HUD, física, combate, objetivos, coletáveis e progresso.
- Algumas folhas de armas são reparadas em runtime por limites fixos.
- 259 ocorrências de primitivas Phaser produzem parte da arte visível.
- `src/game/scenes/` era um template não registrado e sem importadores; sua remoção foi autorizada.

## Escopo

- Inclui: etapas 2 a 6 de `PLANO_REFATORACAO.md`, preservando comportamento e saves.
- Não inclui: novas regras pedagógicas, fases, economia ou balanceamento.

## Arquitetura e impacto

- Entrada do fluxo: `src/game/main.ts` -> `Carregamento` -> `EducApp` -> cena escolhida.
- Arquivos/responsabilidades afetados: carregamento, cenas de entrada, sistemas do Reino, assets visuais e documentação.
- Consumidores verificados: todas as cenas registradas e entidades/sistemas que usam chaves Phaser.
- Estado/persistência: formatos e chaves atuais serão preservados.
- Assets e animações: preservar chaves, ordem de frames, FPS, escala, origem e hitboxes.
- Erros comuns aplicáveis: EC-001, apoio de elementos terrestres no chão.

## Decisões de implementação

- Manter as pastas atuais e extrair apenas responsabilidades com fronteira real.
- Manter `Carregamento` como boot do shell; cada domínio carrega seu conjunto antes de criar a cena.
- Preservar chaves globais do Phaser para reduzir alterações em consumidores.
- Migrar arte procedural por componentes reutilizados e depois por tela, usando assets raster.
- Não eliminar arquivos ou assets sem autorização explícita.

## Critérios de aceite

- [x] A entrada carrega apenas shell e recursos necessários ao EducApp.
- [x] Cada jogo carrega seus assets antes de usá-los e suporta saída/reentrada.
- [x] `ReinoDasPortas` delega HUD, aventura, inimigos e coletáveis sem mudar gameplay.
- [x] Spritesheets migrados têm células uniformes, margem e nenhum reparo runtime correspondente.
- [x] Arte visível migrada usa imagens raster; exceções seguem `AGENTS.md`.
- [x] Todo elemento terrestre alterado respeita EC-001.
- [x] Saves atuais continuam compatíveis.
- [x] Comportamentos não relacionados permanecem iguais.

## Plano de validação

- Estática: TypeScript e build local.
- Regra automatizada: testes terrestres, desafios, níveis e voo; novos checks mínimos quando necessário.
- Integração: abrir cada jogo, executar interação central, voltar e reentrar.
- Visual/interação: 960 x 640 e viewport estreita, console, assets, chão, animações, toque e leitura.
- Evidências esperadas: resultados de comandos e capturas das telas modificadas.

## Autorizações

- Internet: concedida para instalar e registrar o Playwright 1.62.1.
- Eliminação: concedida somente para as cinco cenas isoladas do template em `src/game/scenes/`.
- Comportamento fora do pedido: nenhuma alteração planejada.

## Resultado da validação

- `npx tsc --noEmit`: passou.
- `npm run build`: passou.
- `test:terrestres`, `test:desafios`, `test:levels`, `test:voo`, `test:sprites` e `test:arte`: passaram.
- `npm run test:smoke`: oito jogos abriram, reentraram e receberam uma interação central em desktop 960 x 640 e viewport 390 x 844, sem erros de console/runtime.
- Evidências: `test-results/refatoracao/`, incluindo cenas centrais de RatoLetrando, Reino e Detetive.
- Revisão visual encontrou e corrigiu EC-003: dimensão intrínseca de PNG alterando a área física de coletáveis.
- As cinco cenas de template isoladas em `src/game/scenes/` foram eliminadas após autorização e nova confirmação de zero importadores.
- O Playwright 1.62.1 está declarado em `devDependencies` e travado em `package-lock.json`, tornando o smoke reproduzível em instalações limpas.
