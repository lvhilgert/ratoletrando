# Prompt contextualizado — Fase 2 do Reino das Portas

Implemente a Fase 2 de evolução do jogo **Reino das Portas**, um platformer infantil em Phaser 4 dentro do EducApp.

## Contexto real do projeto

- A cena jogável é `src/game/cenas/ReinoDasPortas.ts`.
- A configuração e escolha de fase ficam em `ConfiguracaoReino.ts`.
- O estado persistente usa `ProgressoReino.ts` e a chave local `educapp:reino-portas:v2`.
- O mundo tem 6.200 px, oito regiões (`bosque`, `vila`, `caverna`, `montanha`, `pantano`, `biblioteca`, `castelo`, `fogo`) e três portões pedagógicos em `x=1600`, `3300` e `5000`.
- Os desafios pedagógicos são gerados por `DesafiosReino.ts` e renderizados por `RenderizadorDesafioReino.ts`. Não criar um segundo sistema de perguntas.
- Terrenos, plataformas e gaps são gerados por seed em `LevelReino.ts`; todos os novos apoios físicos devem usar `TerrestreReino.ts`.
- Já existem terreno temático, chunks, gaps, safe respawn, checkpoints, plataformas estáticas/móveis/quebráveis/de impulso, inimigos contextuais, moedas e ambientação por bioma.
- O Mímico da Porta já é o guardião final. Reutilizá-lo.
- Controles: setas/A-D, pulo, ataque, defesa e dash; os mesmos comandos possuem áreas touch. Interações ambientais devem funcionar com aproximação ou ataque, sem adicionar outro botão obrigatório.
- O jogo é infantil e roda em tablet. Priorizar leitura visual, tolerância, ausência de softlock e poucos objetos animados.

## Objetivo

Transformar cada fase de “percurso bonito” em uma **microaventura ambiental** com:

1. objetivo visual curto;
2. descoberta;
3. uma interação temática;
4. feedback claro;
5. progressão persistente até o checkpoint/reload;
6. conclusão condicionada ao objetivo, aos três portões pedagógicos e ao guardião já existente.

Não criar diálogos longos, inventário complexo, sistema de missões global ou outro motor de física.

## Estado centralizado

Adicionar ao progresso somente um registro serializável da aventura atual:

- fase;
- seed;
- IDs de eventos concluídos.

Ao iniciar uma nova fase/seed, limpar os eventos antigos. Ao recarregar um checkpoint da mesma fase/seed, restaurá-los. Nenhum `porta1Aberta`, `pegouChave` ou booleano solto por mecanismo.

## Microaventura de cada bioma

1. **Bosque — Chave da Clareira:** subir pela rota alta, encontrar uma chave e abrir o portão ambiental.
2. **Vila — Engrenagem da Praça:** empurrar uma caixa até uma placa de pressão para abrir o portão. A caixa retorna ao ponto inicial se cair ou ficar fora da área útil.
3. **Caverna — Cristais dos Ecos:** ativar três cristais visíveis distribuídos entre chão e rota alta.
4. **Montanha — Ponte dos Ventos:** alcançar e atacar uma alavanca; mostrar o mecanismo e materializar/baixar uma ponte sobre um gap.
5. **Pântano — Amigo Perdido:** alcançar e libertar uma pequena criatura presa em uma gaiola legível.
6. **Biblioteca — Páginas Mágicas:** recolher três páginas luminosas que indicam exploração vertical.
7. **Castelo — Travessia da Muralha:** cortar uma corda com ataque; a carga cai e libera uma ponte sobre o fosso.
8. **Fogo — Guardião da Fornalha:** derrotar o Mímico já existente; melhorar apenas a apresentação do objetivo e sua conclusão.

## Interações mínimas reutilizáveis

Implementar com métodos e dados pequenos dentro dos sistemas atuais:

- coletável de objetivo;
- ativável por aproximação;
- ativável por ataque;
- bloqueio ambiental que abre com animação;
- ponte ativável construída com `Surface`;
- objeto empurrável e placa de pressão com recuperação contra softlock.

Não criar uma hierarquia de classes `Interactable` para meia dúzia de objetos. Os eventos por ID são o contrato comum.

## HUD e feedback

- Mostrar um cartão compacto no HUD com ícone, nome curto e progresso (`0/3`, cadeado, chave etc.).
- Exibir a instrução por poucos segundos no início e quando o jogador tenta usar a saída cedo demais.
- Ao concluir um evento: som já existente, partículas limitadas, animação curta e atualização do cartão.
- Objetivo concluído deve ficar marcado com `✓`.
- Áudio pode complementar, mas a leitura visual deve bastar.

## Integração com o fluxo existente

- Os três portões pedagógicos continuam obrigatórios e inalterados.
- O portal final só fica pronto quando: objetivo ambiental concluído + portões abertos + Mímico derrotado.
- Checkpoints salvam também os eventos da microaventura.
- Trocar de fase pelo mapa ou pelo botão “Próxima fase” cria nova seed e limpa a microaventura.
- Reload na mesma fase e seed restaura chave, cristais, placa, ponte, resgate ou páginas já concluídos.

## Segurança de level design

- Posicionar mecanismos a partir de superfícies geradas, nunca por `y` antigo fixo.
- Portões ambientais devem ficar em trecho plano e nunca sobre os portões pedagógicos.
- Itens obrigatórios precisam estar em superfícies alcançáveis.
- Alavanca/corda ficam antes do gap controlado.
- Ponte ativada deve usar o mesmo grupo `plataformas` e o mesmo sistema de colisão.
- A rota até o mecanismo nunca depende da própria ponte que ele ativa.
- Caixa não pode bloquear permanentemente o jogador nem desaparecer sem retorno.

## Validação obrigatória

Criar um teste pequeno que valide as oito configurações:

- ID único;
- objetivo e quantidade válidos;
- posições dentro do mundo;
- mecanismos antes dos bloqueios;
- fases com ponte possuem gap disponível;
- mesma fase/seed restaura os mesmos eventos.

No navegador, testar pelo menos:

- chave + portão;
- caixa + placa;
- três cristais;
- alavanca + ponte;
- resgate;
- páginas;
- corda + ponte;
- guardião;
- checkpoint/reload;
- tentativa de saída incompleta;
- saída completa e próxima fase;
- controles após troca de fase;
- ausência de erros novos no console.

Capturar screenshots representativas e executar `npx tsc --noEmit`, testes existentes, teste novo e `npm run build`.

## Critério de conclusão

A tarefa só termina quando as oito fases possuem uma microaventura funcional, o objetivo aparece de forma compacta, o progresso sobrevive a checkpoint/reload, não existem softlocks conhecidos e o portal respeita todas as condições.
