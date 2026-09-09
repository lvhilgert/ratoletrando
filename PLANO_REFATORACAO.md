# Plano de refatoração

Objetivo: reduzir erros de manutenção sem uma reorganização “big bang”, preservar a jogabilidade atual e fazer cumprir o contrato visual infantil.

## Estado de referência

- Phaser 4 + TypeScript + Vite, 15 cenas registradas.
- `ReinoDasPortas.ts` é o principal monólito.
- `Carregamento.ts` centraliza os assets dos oito jogos.
- Existem muitos elementos visuais desenhados por primitivas Phaser.
- Os testes de geometria terrestre, desafios, níveis e voo estão verdes; `npx tsc --noEmit` também está verde.

## Etapa 0 — Guardrails (concluída nesta mudança)

- Adicionar `AGENTS.md`, mapa arquitetural e skill local de planejamento.
- Formalizar Especificação -> Implementação -> Validação, criar o modelo de spec e iniciar o registro de erros comuns.
- Instalar ferramenta de teste visual no navegador.
- Não alterar runtime.

Aceite: arquivos descobertos pelo Codex, skill válida e nenhuma mudança em `src/`.

## Etapa 1 — Rede de segurança visual e inventário (concluída)

- Definir um roteiro curto de smoke test: abrir EducApp, entrar em cada jogo, jogar uma interação e voltar.
- Capturar referência em 960 x 640 e viewport estreita para as telas afetadas em cada etapa.
- Gerar um inventário simples de assets, chaves Phaser, dimensões de frames e consumidores. Preferir script curto somente se a checagem for repetida.
- Registrar casos de arte procedural por prioridade: objeto/personagem, controle, cenário, efeito.

Aceite: roteiro reproduzível, referências visuais e nenhuma chave de asset duplicada ou ausente no escopo inventariado.

### Baseline local registrada em 2026-09-07

- 136 PNGs em `public/assets/` (133,8 MiB): RatoLetrando 74 arquivos/43,9 MiB, Reino 56/83,3 MiB e Detetive 4/6,4 MiB, além de `bg.png` e `logo.png`.
- 6 arquivos de áudio em `src/game/sounds/` (75,2 MiB).
- `Carregamento.ts` contém 19 chamadas de imagem e 24 de spritesheet; listas dinâmicas ampliam o total efetivamente carregado.
- Nas 38 cargas com chave e caminho literais, não há chave duplicada. O único caminho ausente pertence a `src/game/scenes/Preloader.ts`, arquivo do template que não está registrado no jogo atual.
- Há 259 ocorrências de primitivas visuais Phaser em 25 arquivos. Maiores concentrações: `ReinoDasPortas.ts` (49), `EducApp.ts` (21) e `Jogo.ts` (21).
- Hotspots por responsabilidade/tamanho: `ReinoDasPortas.ts`, `Jogo.ts`, `FaseDetetive.ts`, `EducApp.ts` e `VooDragaoReino.ts`.

### Smoke test padrão

Para cada mudança visível, executar em 960 x 640 e numa viewport móvel estreita:

1. Abrir o EducApp e confirmar ausência de erro no console e de asset quebrado.
2. Entrar no jogo afetado pelo cartão correto.
3. Executar sua interação central: coletar letra, escrever, montar palavra, contar, calcular, formar par, explorar/abrir porta ou investigar pista.
4. Confirmar feedback de acerto e erro, áudio/voz conforme preferência e alvos de toque utilizáveis.
5. Voltar ao EducApp e entrar novamente, verificando estado e carregamento.
6. Capturar antes/depois apenas das telas alteradas em `test-results/`; as evidências atuais do Reino permanecem em `evidencias/` e `test-results/reino-review/`.

O inventário está concluído. As capturas dos demais jogos serão feitas quando cada tela entrar em refatoração, evitando produzir evidência descartável de telas ainda não alteradas.

## Etapa 2 — Carregamento por domínio (concluída)

- Manter em `Carregamento.ts` apenas o necessário para o shell/EducApp e recursos realmente compartilhados.
- Carregar assets específicos ao entrar em cada jogo, começando por Reino das Portas, o maior conjunto.
- Preservar as chaves existentes para evitar alterar todos os consumidores.
- Exibir progresso/erro compreensível durante a carga; não adicionar biblioteca.

Aceite: cada jogo abre diretamente e via EducApp, voltar e reentrar funciona, nenhum asset falta e a carga inicial deixa de baixar recursos dos jogos não abertos.

## Etapa 3 — Decompor `ReinoDasPortas` por responsabilidade (concluída)

Extrair uma responsabilidade por vez, somente quando houver fronteira clara:

1. HUD e controles de tela.
2. Objetivos/interações da aventura.
3. Spawns, colisões e ciclo dos inimigos.
4. Coletáveis, poções e economia.

A cena continua dona do ciclo de vida e coordena os sistemas. Não criar framework, event bus ou interfaces de implementação única. Cada extração deve manter comportamento e passar os quatro testes existentes.

Aceite: métodos e estado de cada responsabilidade ficam juntos; não há dependência circular; saves anteriores continuam carregando; smoke test das oito fases permanece igual.

## Etapa 4 — Pipeline de spritesheets (concluída)

- Corrigir arquivos-fonte de armas e demais folhas irregulares para células uniformes e margem transparente conforme `AGENTS.md`.
- Remover gradualmente os recortes/reparos em runtime de `Carregamento.ts`.
- Validar automaticamente dimensões divisíveis pela grade e ausência de pixel opaco na margem de cada célula.
- Documentar junto do asset somente frameWidth/frameHeight, ordem das animações e FPS quando não forem óbvios no carregador.

Aceite: nenhum frame vaza para o vizinho, animações preservam escala/pivô/colisão e não há canvas de reparo para as folhas migradas.

## Etapa 5 — Substituir arte procedural visível (concluída)

Migrar uma tela por vez, nesta ordem:

1. Componentes compartilhados (`ConfirmacaoSaida`, `ModalConclusao`).
2. Catálogo `EducApp`.
3. Minijogos menores.
4. RatoLetrando, Detetive e Reino das Portas.

Gerar ou selecionar primeiro os assets raster; depois substituir o desenho. Manter `Phaser.Text` para valores, palavras e instruções dinâmicas. Manter formas invisíveis de física/interação e efeitos efêmeros sem significado próprio.

Aceite: nenhuma figura visível da tela migrada depende de HTML/CSS ou primitivas Phaser; contraste, leitura, toque, movimento e feedback continuam adequados a 6–8 anos.

## Etapa 6 — Limpeza e alinhamento documental (concluída)

- Remover `src/game/scenes/` após nova busca confirmar zero importadores.
- Atualizar `README.md`, `CLAUDE.md` e `.github/instructions/` para público de 6–8 anos e arquitetura atual.
- Remover scripts, assets duplicados e documentos históricos somente com evidência de que não são consumidos.

Aceite: build/testes verdes, documentação sem regras conflitantes e busca sem referências aos arquivos removidos.

Estado: documentação alinhada; após autorização explícita, as cinco cenas isoladas do template em `src/game/scenes/` foram removidas e o Playwright 1.62.1 foi registrado como dependência de desenvolvimento. Nenhum jogo, asset ou funcionalidade ativa foi eliminado.

## Regra de execução

Atacar uma etapa por vez, em mudanças pequenas. Antes de cada etapa: registrar arquivos afetados, comportamento preservado, assets necessários, riscos e validação; depois executar sem aguardar aprovação intermediária. Parar para autorização apenas se a etapa exigir internet, eliminação material ou mudança de comportamento existente fora do objetivo pedido.
