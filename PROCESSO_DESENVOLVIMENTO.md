# Processo de desenvolvimento

Toda mudança não trivial percorre, nesta ordem, **Especificação -> Implementação -> Validação**. Uma única spec viva em `specs/` acompanha o trabalho; não crie documentos separados para cada fase.

## 1. Especificação

Antes de editar código:

1. Transforme o pedido no resultado observável esperado para a criança.
2. Reproduza ou localize o comportamento atual e trace entrada, consumidores, estado e assets.
3. Consulte `ARQUITETURA.md` e `ERROS_COMUNS.md`.
4. Crie a spec a partir de `specs/TEMPLATE.md` com escopo, fora de escopo, arquivos/responsabilidades, decisões, riscos, critérios de aceite e plano de validação.
5. Marque qualquer ação que exija autorização segundo `AGENTS.md`.
6. Se houver personagem novo ou nova animação/folha de personagem existente, use `personagem-generator` para separar design, movimentos, referências, licença e integração antes de produzir arte.

Critérios devem descrever comportamento observável. Para gameplay, use situações concretas: estado inicial, ação, resultado e casos-limite. Para mudança visual, inclua chão/apoio, escala, animação, contraste, legibilidade e viewport.

## 2. Implementação

1. Implemente somente o necessário para cumprir os critérios da spec.
2. Reuse código e assets existentes antes de criar novos; corrija a causa no ponto compartilhado.
3. Para personagens, siga a ordem da skill `personagem-generator`: biblioteca local, assets do projeto, fontes externas licenciadas, referência externa e só então geração do zero.
4. Consulte os erros comuns aplicáveis durante a implementação, não apenas no final.
5. Registre na spec decisões relevantes e divergências inevitáveis. Se o resultado pretendido mudar, ajuste primeiro a spec.
6. Continue autonomamente dentro do objetivo. Pare apenas nos limites de autorização do `AGENTS.md`.

## 3. Validação

Valide em camadas proporcionais ao risco:

1. **Estática:** TypeScript e build quando aplicável.
2. **Regra:** teste unitário pequeno para lógica, geometria, progressão ou persistência alterada.
3. **Integração:** cena abre, fluxo principal funciona, saída/reentrada e save continuam válidos.
4. **Visual e interação:** resolução 960 x 640 e viewport estreita, console limpo, todas as chaves de textura resolvidas em arquivos reais, assets íntegros, movimento, chão, colisões, toque e leitura. Placeholder de textura do Phaser reprova a validação.
5. **Regressão:** testes relacionados do `package.json` e critérios da spec conferidos um a um.

Registre comandos, evidências e resultado na própria spec. Uma falha devolve o trabalho à Implementação. Não marque como concluído com critério de aceite pendente.

## Aprendizado com erros

Quando implementação, teste ou revisão encontrar uma falha real com chance de repetição:

1. Corrija o problema atual.
2. Adicione uma entrada em `ERROS_COMUNS.md` com sintoma, causa, regra preventiva e teste obrigatório.
3. Leve essa regra para futuras specs afetadas.

Não registre hipóteses ou preferências como erro; o arquivo deve conter aprendizado comprovado.

## Definição de concluído

- Todos os critérios de aceite estão verificados.
- Testes e evidências estão registrados na spec.
- Comportamento não relacionado foi preservado.
- Arquitetura e erros comuns foram atualizados quando necessário.
- Nenhum limite de autorização foi ultrapassado.
