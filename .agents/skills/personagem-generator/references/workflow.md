# Workflow de personagem e animação

Use este guia depois de confirmar que `personagem-generator` se aplica. Resolva decisões técnicas autonomamente a partir do projeto; pergunte somente quando estilos subjetivos incompatíveis continuarem plausíveis após a investigação.

## 1. Investigar e especificar

Identifique no pedido e no repositório:

- nome, função, jogo/fase e público;
- aparência, personalidade, silhueta, equipamentos e paleta;
- tamanho em cena, perspectiva, direção principal e escala;
- imagem oficial, spritesheets, animações, loader, entidade, cena e configuração existentes;
- ações realmente exigidas pelo gameplay e estados/transições que as acionam.

Não pergunte o que os assets, a spec ou o código já respondem. Se for personagem existente, a imagem oficial é a fonte de verdade; não o redesenhe para adicionar uma animação. Se for novo e não houver design, crie e aprove internamente um `character master` com vista principal, proporções, paleta, equipamentos e detalhes invariantes antes de animar.

Na spec, registre separadamente:

- **design:** fonte oficial da aparência e invariantes visuais;
- **animações:** conjunto mínimo derivado do gameplay, por exemplo `idle`, `run`, `jump_start`, `jump`, `fall`, `land`, `attack_01`, `hurt` e `death` somente quando usados;
- **integração:** dimensões esperadas, origem/pivô, chão, hitbox, direção, escala e consumidores Phaser;
- **autorização:** pesquisa/download remoto ainda requer permissão segundo `AGENTS.md`.

## 2. Reutilizar antes de pesquisar

Procure, nesta ordem:

1. `referencias/movimentos/` por movimento, anatomia/peso e perspectiva compatíveis;
2. `public/assets/` por personagem, folha ou movimento aproveitável;
3. assets oficiais já anexados à tarefa ou presentes fora do diretório final;
4. somente então, fontes externas licenciadas;
5. geração do movimento do zero apenas quando as anteriores não resolverem.

Reutilize uma boa referência em personagens futuros quando licença e metadados permitirem. Não baixe coleções “para talvez usar”.

## 3. Pesquisar fontes externas

Antes da primeira pesquisa, navegação, API ou download, peça uma autorização explícita que descreva o acesso pretendido. Depois de autorizada, pesquise semanticamente pelo tipo, movimento, perspectiva e licença, por exemplo `2d knight run spritesheet CC0` ou `cartoon dinosaur run animation`.

Priorize fontes oficiais com licença clara:

1. Kenney — https://kenney.nl/assets/
2. OpenGameArt — https://opengameart.org/
3. itch.io Game Assets — https://itch.io/game-assets
4. GameArt2D — https://www.gameart2d.com/
5. CraftPix — https://craftpix.net/

A lista é ponto de partida, não limite. Prefira a página do autor/original a agregadores. The Spriters Resource (`https://www.spriters-resource.com/`) e sprites extraídos de jogos comerciais podem ajudar a estudar pose, antecipação, impacto, squash/stretch, trajetória e timing, mas são `referencia_apenas` salvo licença explícita em contrário.

Quando houver oferta suficiente, compare de 3 a 8 candidatos, sem escolher automaticamente o primeiro. Avalie:

- leitura, continuidade e qualidade do movimento;
- adequação ao gameplay, anatomia/peso e perspectiva;
- quantidade de frames e timing;
- resolução, margem e facilidade de adaptação;
- cobertura das animações necessárias;
- licença, atribuição, share-alike, restrições comerciais e permissão de modificação.

Escolha uma referência principal e, quando necessário, complementares diferentes por movimento. Registre a decisão; não force um pacote incompleto a cobrir tudo.

## 4. Classificar licença e uso

Registre uma destas classificações sem inferir permissão:

- `CC0`;
- `CC-BY`;
- `CC-BY-SA`;
- `comercial_permitida`;
- `licenca_autor`;
- `gratuito_com_restricoes`;
- `referencia_apenas`;
- `desconhecida`.

Ordem de preferência: CC0; licença explícita que permita modificação e distribuição no projeto; gratuito compatível; pago excepcional; protegido somente como referência. Confira os termos na fonte na data do uso. Cumpra atribuição, share-alike e demais obrigações. Licença desconhecida, incompatível ou meramente comercial sem direitos suficientes nunca autoriza incorporação.

`referencia_apenas` permite analisar princípios gerais do movimento, não copiar pixels, personagem, traço distintivo ou sequência reconhecível quadro a quadro. Não distribua o arquivo nem uma recoloração dele.

## 5. Baixar e registrar

Quando licença e autorização permitirem, use URL direta/oficial e a ferramenta mais simples disponível (`curl`, `wget`, `Invoke-WebRequest`, browser ou API oficial). Não burle login, paywall, anti-download ou restrição contratual.

Para ZIP:

1. baixe e preserve o arquivo original permitido;
2. extraia sem sobrescrever arquivos existentes;
3. inspecione spritesheets, frames, README, autoria e licença;
4. registre origem antes de adaptar;
5. retenha somente o que tem uso real.

Se o download precisar ser manual, informe asset, motivo, URL, licença e arquivo esperado e peça somente essa ação ao usuário.

Guarde uma referência reutilizável permitida em:

```text
referencias/movimentos/<movimento>/<referencia>/
├── source.json
└── original/        # apenas arquivos cuja retenção/redistribuição seja permitida
```

Use o movimento principal como pasta e liste movimentos adicionais nos metadados. Para material comercial/protegido ou quando os termos não permitirem reter o arquivo, guarde somente `source.json` com URL e notas de análise; `original/` não deve existir.

Formato mínimo de `source.json`:

```json
{
  "nome": "Knight Hero",
  "origem": "OpenGameArt",
  "url": "https://...",
  "autor": "...",
  "licenca": "CC0",
  "uso": "referencia_animacao",
  "movimentos": ["run", "attack"],
  "baixado_em": "YYYY-MM-DD",
  "incorporado_ao_jogo": false,
  "creditos_obrigatorios": "",
  "observacoes": "Run e attack usados como referência estrutural."
}
```

Valores de `uso`: `referencia`, `referencia_animacao`, `asset_base` ou `referencia_apenas`. Em assets finais derivados/adaptados, inclua um `source.json` ao lado da arte com uma entrada por fonte e as obrigações aplicáveis. Para criação inteiramente original, registre isso e a ferramenta/processo usado.

## 6. Extrair a lógica do movimento

Antes de gerar a versão final, anote para cada ciclo:

- número, ordem e duração dos frames;
- poses-chave, antecipação, impacto e recuperação;
- contato dos pés, mãos e arma;
- cabeça, torso e centro de massa;
- deslocamento local versus movimento realizado pela física;
- transições de entrada/saída e se deve repetir.

Exemplo de corrida humanoide: contato direito, compressão, impulso, passagem, contato esquerdo, compressão, impulso, passagem. Adapte a anatomia, peso e personalidade; não copie os pixels.

## 7. Produzir no estilo oficial

A referência oficial determina rosto, proporções, roupas, acessórios, cores, arma, silhueta e estilo. A referência de movimento determina pose, timing e continuidade. Ao usar IA, forneça ambas e declare explicitamente que a segunda é apenas estrutural.

Produza o ciclo como conjunto coerente ou por edição sequencial a partir do mesmo master. Evite prompts vagos e geração independente de cada quadro. Em todos os frames, confira:

- cabeça, rosto, mãos/dedos visíveis, braços e pernas;
- roupa, botas, arma, escudo e acessórios;
- paleta, luz, perspectiva, escala e direção;
- base dos pés e centro do corpo;
- ausência de elementos surgindo, desaparecendo ou mudando de tamanho.

Se a consistência falhar, corrija os frames antes de montar a folha. Não aceite variações de equipamento como “efeito da animação”.

## 8. Exportar e integrar

Siga primeiro o padrão real do jogo. Na ausência de padrão mais específico, use:

```text
public/assets/<jogo>/personagens/<personagem>/
├── <personagem>-<animacao>.png
└── source.json
```

Exporte PNG transparente, folhas por animação ou atlas somente quando o consumidor real justificar. Frames individuais podem ser mantidos quando ajudam o pipeline, mas não duplique formatos no build sem consumidor.

Para spritesheets:

- todas as células têm `frameWidth` e `frameHeight` uniformes;
- nenhum pixel opaco toca a borda ou invade a célula vizinha;
- a margem transparente mínima é 8 px ou 4% da menor dimensão da célula, o que for maior;
- pivô/origem, escala e base dos pés permanecem consistentes;
- loops não contêm frames duplicados por acidente.

Integre nos loaders, entidades/cenas e animações já existentes. Centralize por personagem os números que formam um contrato real — chaves, intervalos, FPS, repetição e dimensões — conforme o padrão do projeto; não crie uma camada genérica para um único consumidor. Em terreno, alinhe base opaca, corpo físico e superfície usando os sistemas descritos em EC-001.

## 9. Validar

Antes de concluir, confirme:

- [ ] identidade visual e silhueta preservadas;
- [ ] pose e ação legíveis para crianças de 6 a 8 anos;
- [ ] ordem correta, sem duplicatas acidentais e com alternância coerente;
- [ ] pés sem deslizamento absurdo e base alinhada ao chão quando aplicável;
- [ ] anatomia, roupa, arma, acessórios, escala, perspectiva e luz consistentes;
- [ ] transparência real, células uniformes, margem e pivô consistentes;
- [ ] loop correto nas animações cíclicas e transições corretas nas finitas;
- [ ] loader, frame ranges, FPS, repetição, playback e hitbox funcionam no Phaser;
- [ ] teste visual em 960 x 640 e viewport estreita, com console limpo;
- [ ] origem, licença, uso e créditos documentados;
- [ ] nenhum material `referencia_apenas` ou desconhecido está no build.

Execute `npx tsc --noEmit` e os testes relacionados quando houver integração TypeScript. Para tarefa somente de arte, faça a menor verificação determinística disponível das dimensões, transparência, células e arquivos, além da inspeção visual.

## 10. Relatar a execução

Informe de forma compacta:

- personagem e animações concluídas;
- referência principal/complementar por movimento, com fonte, URL, licença e uso;
- arquivos finais e metadados;
- spritesheet/atlas, dimensões, frames e FPS;
- obrigações de crédito/licença;
- materiais usados somente como referência e ausentes da distribuição;
- pendência real, se existir.
