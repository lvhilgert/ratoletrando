# Spec: skill de criação de personagens 2D

Status: Concluída

## Resultado para a criança

Novos personagens e novas animações poderão manter identidade visual, movimento legível e integração correta com o chão e o gameplay, sem depender de poses improvisadas ou de assets sem procedência.

## Situação atual

- Skills locais vivem em `.agents/skills/<nome>/SKILL.md` e são descobertas pela descrição do frontmatter.
- `AGENTS.md` exige raster em `public/assets`, movimento para seres vivos, células uniformes e margem transparente em spritesheets.
- `desenvolver-educapp` governa especificação, implementação e validação, mas ainda não encaminha criação ou animação de personagens para um fluxo especializado.
- Não há convenção para biblioteca de movimento nem metadados de origem/licença dos assets.
- `CLAUDE.md` e as instruções do GitHub não apontam agentes externos para as skills locais.

## Escopo

- Inclui: skill reutilizável para pesquisar, selecionar, documentar, produzir, validar e integrar personagens 2D; convenções mínimas de procedência, biblioteca de movimentos e assets finais; acionamento nos pontos de entrada do projeto.
- Não inclui: produzir personagem, acessar a internet, baixar referências, adicionar dependência ou alterar gameplay.

## Arquitetura e impacto

- Entrada do fluxo: pedido semântico para criar personagem ou adicionar animação a personagem existente.
- Arquivos/responsabilidades afetados: `.agents/skills`, instruções de agentes, processo de desenvolvimento, template de spec e mapa arquitetural.
- Consumidores verificados: Codex pelas skills locais; Claude Code por `CLAUDE.md`; agentes que sigam `AGENTS.md` ou `.github/instructions`.
- Estado/persistência: nenhum.
- Assets e animações: originais reutilizáveis em `referencias/movimentos/`; finais distribuídos em `public/assets/<jogo>/personagens/<personagem>/`; ambos criados somente quando houver conteúdo real.
- Erros comuns aplicáveis: EC-001 para personagens terrestres; margens e continuidade de spritesheets definidas em `AGENTS.md`.

## Decisões de implementação

- Nomear a skill `personagem-generator`, seguindo a convenção minúscula com hífens.
- Manter `SKILL.md` como roteador conciso e colocar o procedimento detalhado em uma única referência.
- Não criar diretórios vazios, scripts, catálogo ou dependências; os diretórios de referências/assets nascem na primeira execução real.
- Exigir autorização imediatamente antes de pesquisa, download ou outro acesso remoto, conforme `AGENTS.md`.
- Nunca distribuir material comercial, desconhecido ou marcado como referência apenas.

## Critérios de aceite

- [x] Pedidos de personagem novo, NPC, inimigo, criatura, animal ou animação nova acionam semanticamente `personagem-generator`.
- [x] O fluxo separa design do personagem de movimento e consulta biblioteca/assets locais antes da internet ou geração do zero.
- [x] Pesquisa externa exige autorização e compara candidatos por movimento, adequação e licença antes da escolha.
- [x] Download automatizado só ocorre de fonte oficial, sem contorno de proteção, e preserva original permitido e metadados.
- [x] O guia define produção consistente, spritesheet válido, integração Phaser e validação visual/física.
- [x] Referências e assets finais têm caminhos e controle de licença explícitos.
- [x] `AGENTS.md`, `CLAUDE.md`, `desenvolver-educapp` e o fluxo de especificação encaminham corretamente para a skill.
- [x] Nenhum personagem ou asset visual é produzido nesta mudança.
- [x] Comportamentos não relacionados permanecem iguais.

## Plano de validação

- Estática: executar o validador oficial de skills no novo diretório.
- Regra automatizada: não aplicável; não há código executável.
- Integração: conferir links relativos, frontmatter, gatilhos semânticos e ausência de instruções conflitantes.
- Visual/interação: não aplicável; nenhum asset ou tela será alterado.
- Evidências esperadas: validador sem erros, busca textual pelos pontos de integração e revisão do diff.

## Autorizações necessárias

Nenhuma. Esta tarefa não acessa internet, não baixa assets e não elimina conteúdo.

## Resultado da validação

- O validador oficial `quick_validate.py` não iniciou porque o ambiente não possui o módulo local `PyYAML`; nenhuma instalação foi feita, pois exigiria internet e seria desnecessária para uma skill sem código executável.
- Validação nativa equivalente: frontmatter, nome da pasta, ausência de placeholders de scaffold e todos os links relativos válidos.
- Exemplo de `source.json` convertido com sucesso por `ConvertFrom-Json`.
- Cobertura dos requisitos e integração em sete pontos de entrada conferidas por busca automatizada.
- `git status --short -- public/assets` confirmou que nenhum personagem ou asset visual foi criado ou alterado.
- TypeScript, testes e browser não se aplicam: nenhum código ou comportamento visual foi alterado.
