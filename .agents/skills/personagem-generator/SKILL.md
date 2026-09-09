---
name: personagem-generator
description: Criar ou ampliar personagens 2D do EducApp a partir de design oficial e referências de movimento licenciadas. Use semanticamente para personagem jogável, NPC, inimigo, chefe, animal, criatura, monstro, companheiro ou montaria, inclusive quando um personagem existente precisar de sprites, frames ou nova animação; não use para cenários, UI ou apenas configurar no Phaser uma animação cujo asset já está pronto.
---

# Gerar personagens 2D

Crie o personagem e suas animações sem improvisar ciclos que já possuem boas referências. Separe sempre:

1. **Design:** quem é o personagem e qual imagem define sua aparência.
2. **Movimento:** o que o gameplay exige e quais referências definem poses, timing e continuidade.

Leia [references/workflow.md](references/workflow.md) integralmente antes de pesquisar, baixar, gerar, editar ou integrar qualquer personagem.

## Regras essenciais

- Leia `AGENTS.md`, `ARQUITETURA.md`, `PROCESSO_DESENVOLVIMENTO.md` e `ERROS_COMUNS.md`; em mudança de produto ou código, use também `desenvolver-educapp`.
- Investigue o personagem, seus consumidores, assets, animações e escala atuais antes de decidir. Para personagem existente, preserve o design oficial e acrescente somente o movimento pedido.
- Derive a lista mínima de animações do gameplay. Não crie ciclos apenas porque uma referência os oferece.
- Procure nesta ordem: biblioteca local, assets do projeto, bancos externos licenciados, material externo como referência de movimento e geração inteiramente nova.
- Pesquisa, navegação, download, API ou serviço remoto exigem autorização explícita imediatamente antes do acesso, mesmo quando criar o personagem já foi pedido.
- Prefira fonte oficial e licença clara. Internet não implica permissão de uso; licença ausente ou incompatível significa `referencia_apenas`.
- Sprite comercial ou protegido serve apenas para estudar princípios do movimento. Não copie pixels, identidade visual, sequência reconhecível quadro a quadro nem faça recoloração para incorporá-lo.
- Se não houver design oficial, produza primeiro um `character master`; só depois gere as animações.
- Ao usar geração/edição por IA, combine a fonte oficial de aparência com referências de pose e movimento. Não gere cada frame isoladamente.
- Arte final é PNG raster em `public/assets/<jogo>/personagens/<personagem>/`, seguindo o padrão já existente do jogo quando ele for mais específico.
- Referências reutilizáveis permitidas ficam em `referencias/movimentos/<movimento>/<referencia>/`; não crie nem preencha a biblioteca preventivamente.
- Todo material retido ou incorporado recebe `source.json`; nada com licença desconhecida ou `referencia_apenas` entra no build distribuído.
- Em spritesheets, use células uniformes e a margem transparente exigida em `AGENTS.md`. Em atores terrestres, preserve pés, pivô e alinhamento com a superfície física conforme EC-001.
- Não crie arquitetura, dependência, placeholder, asset ou animação para necessidade hipotética.

## Conclusão mínima

Só conclua depois de validar identidade, continuidade, transparência, dimensões, margens, pivô, loop, chão/física, carregamento e playback no Phaser. Informe personagem, animações, referências por movimento, licença/uso, arquivos finais, dimensões/FPS e qualquer referência que não faça parte da distribuição.

Para carregar e integrar a saída, consulte as skills locais [loading-assets](../loading-assets/SKILL.md), [sprites-and-images](../sprites-and-images/SKILL.md) e [animations](../animations/SKILL.md) apenas quando essa etapa fizer parte da tarefa.
