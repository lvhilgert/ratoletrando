# RatoLetrando / EducApp

## Antes de alterar o projeto

- Leia [ARQUITETURA.md](ARQUITETURA.md), [PROCESSO_DESENVOLVIMENTO.md](PROCESSO_DESENVOLVIMENTO.md) e [ERROS_COMUNS.md](ERROS_COMUNS.md). Siga a skill local `desenvolver-educapp` para mudanças de código, gameplay, UX ou assets.
- Sempre que a tarefa criar ou ampliar personagem, NPC, inimigo, chefe, animal, criatura, monstro, companheiro ou montaria — inclusive novos sprites, frames ou animações — siga também a skill local `personagem-generator` antes de gerar arte.
- Para uma mudança relevante, primeiro investigue o fluxo real, registre um plano proporcional e então implemente sem aguardar aprovação do plano. Pare após o plano somente quando o usuário pedir explicitamente “só planeje”.
- Tome autonomamente decisões técnicas e de produto de baixo, médio e alto nível dentro do objetivo solicitado, incluindo arquitetura, novos assets e novos comportamentos necessários para resolver o problema.
- Preserve alterações existentes do usuário e limite a mudança ao objetivo solicitado.

## Limites de autonomia

Peça autorização explícita imediatamente antes de:

- usar a internet, inclusive pesquisar, navegar, baixar assets, instalar pacotes ou consultar serviços remotos;
- eliminar arquivo, asset, jogo, fase, conteúdo, fluxo ou funcionalidade;
- alterar comportamento observável já existente quando essa alteração não tiver sido pedida pelo usuário.

O pedido do usuário já autoriza o comportamento que ele solicita diretamente. Criar comportamento novo, asset novo ou estrutura nova necessária para entregar esse objetivo não exige nova aprovação. Substituir código durante uma refatoração não conta como eliminação quando preserva integralmente a funcionalidade e o comportamento existentes.

## Regras do produto

- Público: crianças de 6 a 8 anos. Instruções devem ser curtas, legíveis, positivas e compreensíveis sem ajuda adulta.
- Use cores vibrantes, contraste forte, alvos de toque grandes e feedback visual/sonoro imediato. Não dependa apenas de cor para comunicar estado.
- Toda arte visível do jogo deve ser uma imagem raster real em `public/assets`; não desenhe personagens, cenários, objetos, cartões ou botões com HTML/CSS nem com primitivas do Phaser.
- `Phaser.Text` é permitido para conteúdo dinâmico. Formas transparentes são permitidas para física, zonas de interação, máscaras e depuração. Traços desenhados pela própria criança em tempo real e efeitos efêmeros simples são permitidos quando não representam um asset do jogo.
- Personagens e objetos vivos devem ter movimento. Prefira animações de spritesheet e tweens sutis a elementos estáticos.
- Spritesheets novos ou alterados devem usar células uniformes com margem transparente. Nenhum pixel opaco pode tocar a borda da célula ou invadir a célula vizinha; use no mínimo 8 px ou 4% da menor dimensão da célula, o que for maior.
- Não use placeholder procedural para compensar asset ausente. Planeje ou gere o asset antes de implementar a interface final.
- Não considere fase, bioma ou personagem implementado enquanto alguma chave de textura consumida não possuir arquivo carregado. Antes de concluir, valide o carregamento sem erros e inspecione a cena real; o placeholder de textura do Phaser é falha bloqueante, não entrega parcial.
- Em jogos 2D terrestres, personagens, inimigos e objetos apoiados devem usar um conceito explícito de chão. A base visual do asset deve coincidir com a superfície física; árvores e demais elementos enraizados nascem no chão, nunca em um `y` visual arbitrário.
- Moedas e demais coletáveis obrigatórios devem nascer fora de paredes, terrenos e obstáculos, sobre uma rota alcançável pela criança. Todo gerador de fase valida o volume completo do coletável, não apenas seu ponto central.

## Convenções técnicas

- Stack: Phaser 4, TypeScript e Vite; resolução lógica 960 x 640.
- Mantenha a direção `cenas -> entidades/sistemas/dados/services`. Evite dependências entre jogos.
- Não faça reorganização ampla de pastas junto com mudança de comportamento. Extraia por responsabilidade em etapas pequenas e verificáveis.
- Reuse sistemas, dados e assets existentes antes de criar novos. Não adicione dependência sem necessidade demonstrada.
- Não use dependência nova nem fonte remota sem a autorização de internet exigida acima.
- Preserve compatibilidade das chaves e formatos do `localStorage`, salvo migração explicitamente aprovada.
- Após TypeScript: execute `npx tsc --noEmit`. Execute também os testes relacionados de `package.json`. Para mudança visível, faça teste no navegador em 960 x 640 e numa viewport estreita.

## Fontes de verdade

- Mapa do código e local de cada responsabilidade: [ARQUITETURA.md](ARQUITETURA.md).
- Ciclo obrigatório Especificação -> Implementação -> Validação: [PROCESSO_DESENVOLVIMENTO.md](PROCESSO_DESENVOLVIMENTO.md).
- Falhas conhecidas e prevenção de reincidência: [ERROS_COMUNS.md](ERROS_COMUNS.md).
- Modelo de spec por mudança: [specs/TEMPLATE.md](specs/TEMPLATE.md).
- Sequência aprovada para reduzir a dívida atual: [PLANO_REFATORACAO.md](PLANO_REFATORACAO.md).
- Assets servidos pelo jogo: `public/assets/`.
- Referências reutilizáveis de movimento: `referencias/movimentos/`, criadas sob demanda e sempre acompanhadas de origem/licença.
- Processo de criação e animação de personagens: `.agents/skills/personagem-generator/SKILL.md`.
- Registro das cenas e configuração do Phaser: `src/game/main.ts`.
