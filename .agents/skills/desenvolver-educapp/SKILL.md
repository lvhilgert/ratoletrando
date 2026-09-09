---
name: desenvolver-educapp
description: Planejar mudanças de código, gameplay, arquitetura, UX ou assets no RatoLetrando/EducApp antes de implementá-las. Use para features, correções e refatorações relevantes deste repositório; não use para perguntas somente de leitura nem ajustes documentais triviais.
---

# Desenvolver no EducApp

Leia `AGENTS.md`, `ARQUITETURA.md`, `PROCESSO_DESENVOLVIMENTO.md` e `ERROS_COMUNS.md` integralmente.

## Fluxo orientado por especificação

Para toda mudança não trivial, use `specs/TEMPLATE.md` e cumpra as três fases sem invertê-las:

1. **Especificação:** investigue entrada, consumidores e estado; registre resultado infantil, escopo, arquitetura, assets, erros conhecidos aplicáveis, critérios de aceite e validações.
2. **Implementação:** implemente a menor solução que satisfaz a spec, atualizando nela decisões ou desvios relevantes.
3. **Validação:** execute checks estáticos, testes de regra e teste observável/visual proporcional. Se falhar, volte à implementação; não encerre com critério pendente.

Tome autonomamente decisões de baixo, médio e alto nível dentro do objetivo solicitado. Se a investigação revelar trabalho adicional ainda necessário ao mesmo objetivo, atualize o plano e continue.

## Ações que exigem autorização

Pare e peça permissão explícita antes de:

- qualquer acesso à internet, pesquisa web, download, instalação ou serviço remoto;
- eliminar arquivo, asset, jogo, fase, conteúdo, fluxo ou funcionalidade;
- mudar comportamento observável existente fora do resultado solicitado.

O pedido atual já autoriza o comportamento que descreve. Novos assets, comportamentos auxiliares e decisões arquiteturais necessários ao resultado são autônomos. Refatorar ou substituir código preservando integralmente funcionalidade e comportamento não é eliminação.

## Decisões do projeto

- Projete para crianças de 6 a 8 anos e valide clareza, tamanho dos alvos, contraste, feedback e ausência de punição confusa.
- Arte visível é raster em `public/assets`, nunca HTML/CSS nem desenho procedural Phaser. Texto dinâmico, hitboxes transparentes, máscaras, debug e efeitos efêmeros simples seguem as exceções de `AGENTS.md`.
- Se a mudança criar ou ampliar personagem, criatura, NPC ou inimigo, inclusive sprites/frames/animações, acione `personagem-generator` durante a especificação: separe design de movimento, consulte referências locais primeiro e registre origem/licença. A autorização de internet continua obrigatória antes de pesquisar ou baixar.
- Se faltar arte, planeje ou gere o asset antes do código final. Para spritesheets, valide células uniformes e margens transparentes sem vazamento entre frames.
- Consulte primeiro os tipos, skills e padrões locais da versão instalada do Phaser. Se o código local não responder, peça autorização antes de consultar documentação externa.
- Corrija a causa no ponto compartilhado, não sintomas repetidos. Não crie abstração, dependência ou pasta para uso hipotético.
- Em `ReinoDasPortas.ts` e `Carregamento.ts`, prefira uma extração isolada por mudança; não misture movimento de arquivos com alteração de comportamento.
- Em gameplay terrestre 2D, derive posições da superfície física. No Reino, reuse `superficieAbaixo`, `assentarTerrestre`, `configurarAtorTerrestre` e `alinharCorpoTerrestre`; nunca posicione pés, raízes ou bases com números mágicos independentes do chão.

## Entrega

Registre o resultado da validação na spec. Execute `npx tsc --noEmit` e os testes relacionados do `package.json`. Para mudança visível, teste no navegador em 960 x 640 e viewport estreita, observando console, carregamento, interação, retorno ao EducApp e legibilidade. Se uma falha real revelar um padrão reincidente, atualize `ERROS_COMUNS.md`. Atualize `ARQUITETURA.md` apenas se responsabilidades ou caminhos mudarem.
