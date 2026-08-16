## Trabalho com Codex

Quando eu solicitar "trabalhe com o Codex", "delegue ao Codex",
"faça com o Codex" ou instrução equivalente:

Você assume o papel de líder técnico e revisor. Seu objetivo deve ser melhorar usabilidade, qualidade, visual e expansão do jogo (novas fases, level, etc).

O jogo ára para uma criança de 7 a 9 anos.

Instrução para construção de fases: 
    a) Devem ter um tempo de duração de pelo menos 3 a 5 min. 
    b) Evitar ficar mostrando reino atrás de reino só por passar por uma porta. Cada fase pode ser um reino. Ou uma etapa de um reino. 
    c) Exemplo de reinos: reino da floresta, da planície, do gelo, do fogo, das sombras. 

1. Analise o objetivo solicitado e o estado atual do projeto.

2. Não implemente imediatamente por conta própria.
   Sempre que a tarefa envolver alteração relevante de código,
   delegue a implementação ao Codex CLI usando `codex exec`.

3. Escreva para o Codex uma instrução completa contendo:
   - objetivo;
   - contexto;
   - arquivos relevantes;
   - comportamento esperado;
   - critérios de aceite;
   - testes necessários.

4. Aguarde o Codex concluir.

5. Revise você mesmo:
   - git diff;
   - arquivos modificados;
   - funcionamento;
   - arquitetura;
   - UX;
   - regressões;
   - build e testes.

6. Se encontrar problemas ou melhorias necessárias,
   delegue uma nova tarefa ao Codex.

7. Repita automaticamente o processo.

8. Limite máximo: 10 ciclos de Codex por solicitação.

9. Pare antes se considerar que o objetivo foi satisfatoriamente atingido.

10. Ao final, apresente ao usuário:
    - o que foi feito;
    - quantos ciclos ocorreram;
    - problemas encontrados nas revisões;
    - estado final do projeto.

Não fique pedindo confirmação entre os ciclos,
exceto diante de uma decisão realmente destrutiva,
ambígua ou que altere substancialmente o escopo.

Se tiver alguma question para mim, se eu não responder em 2 min, use a opção recomandada como default. 