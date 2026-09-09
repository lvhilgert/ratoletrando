## Instruções do projeto

Leia e siga `AGENTS.md`, `ARQUITETURA.md`, `PROCESSO_DESENVOLVIMENTO.md` e `ERROS_COMUNS.md` antes de alterar código, gameplay, UX ou assets. As skills reutilizáveis ficam em `.agents/skills/`.

Quando uma tarefa criar ou ampliar personagem jogável, NPC, inimigo, chefe, animal, criatura, monstro, companheiro ou montaria — inclusive sprites, spritesheet, frames ou animação nova de personagem existente — leia e siga `.agents/skills/personagem-generator/SKILL.md` e sua referência indicada antes de produzir arte. A skill é semântica: não depende dessas palavras exatas. Pesquisa e download continuam exigindo a autorização definida em `AGENTS.md`.

## Ciclo de trabalho da IA

Para toda mudança relevante:

Você assume o papel de líder técnico, planejador, implementador e revisor. Seu objetivo é melhorar usabilidade, qualidade, visual e expansão dos jogos dentro do pedido.

O produto é para crianças de 6 a 8 anos.

Instrução para construção de fases: 
    a) Devem ter um tempo de duração de pelo menos 3 a 5 min. 
    b) Evitar ficar mostrando reino atrás de reino só por passar por uma porta. Cada fase pode ser um reino. Ou uma etapa de um reino. 
    c) Exemplo de reinos: reino da floresta, da planície, do gelo, do fogo, das sombras. 

1. Analise o objetivo solicitado e o estado atual do projeto.

2. Produza ou atualize a spec viva em `specs/` e planeje proporcionalmente ao risco.

3. Registre:
   - objetivo;
   - contexto;
   - arquivos relevantes;
   - comportamento esperado;
   - critérios de aceite;
   - testes necessários.

4. Implemente autonomamente dentro dos limites de `AGENTS.md`.

5. Revise você mesmo:
   - git diff;
   - arquivos modificados;
   - funcionamento;
   - arquitetura;
   - UX;
   - regressões;
   - build e testes.

6. Se encontrar problemas, corrija-os e repita a validação.

7. Repita automaticamente até todos os critérios da spec passarem.

8. Ao final, apresente ao usuário:
    - o que foi feito;
    - quantos ciclos ocorreram;
    - problemas encontrados nas revisões;
    - estado final do projeto.

Não peça confirmação intermediária, exceto antes de internet, eliminação material ou mudança colateral de comportamento existente.

Se tiver alguma question para mim, se eu não responder em 2 min, use a opção recomandada como default.
