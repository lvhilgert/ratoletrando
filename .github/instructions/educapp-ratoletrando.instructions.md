---
description: "Use when developing EducApp or RatoLetrando: architecture decisions, feature implementation, code patterns, asset usage, and scope boundaries. Covers platform evolution, game mechanics reuse, UX principles, and preventing unnecessary refactoring."
applyTo: "**"
name: "EducApp & RatoLetrando Development Guidelines"
---

# EducApp & RatoLetrando Development Guidelines

## Project Context

**EducApp** é uma plataforma local com oito jogos 2D para crianças de 6 a 8 anos. RatoLetrando é um desses jogos. `AGENTS.md`, `ARQUITETURA.md`, `PROCESSO_DESENVOLVIMENTO.md` e `ERROS_COMUNS.md` são as fontes de verdade.

### Current Scope
- Os oito jogos atuais estão em escopo.
- Evolua a arquitetura gradualmente, **preservando comportamento, saves e estado funcional**.
- Planeje em spec antes de implementar e valide antes de concluir.
- Internet, eliminação material e mudança colateral de comportamento exigem autorização explícita.

### Future Direction
- Jogos de linguagem, matemática e exploração com Phaser compartilhado
- Default content + per-classroom customization
- Reusable game mechanics and data structures

---

## Core Principles

### 1. No Child Login
- Children use the app without authentication
- Default content and configurations must work out-of-the-box
- No per-device or per-child setup required

### 2. Teacher Personalization
- Teachers (authenticated) create classrooms
- Each classroom = one configuration set
- **No sub-layers or unnecessary nesting**—keep structure flat
- Tablets linked to classroom via code

### 3. UX for Children
- **Visual-first, minimal text**
- **Large, touch-friendly buttons**
- Simple navigation, clear feedback
- Avoid text-heavy dialogs or small UI elements
- Test assumptions with real tablet interaction patterns

### 4. Asset Management
- **Reuse existing assets first** and never create placeholder code for missing art
- Toda arte permanente usa PNG/spritesheet local; HTML/CSS e primitivas Phaser não desenham objetos do jogo
- Spritesheets mantêm células uniformes e margem transparente entre frames
- For a new or expanded 2D character, follow `.agents/skills/personagem-generator/SKILL.md` before producing art
- Keep character design separate from movement references and document source/license
- Research or download external assets only after the authorization required by `AGENTS.md`

### 5. Architecture Simplicity
- Avoid premature architecture complexity
- **Reutilize existing game engines and mechanics** before adding new layers
- Before creating a new entity/concept:
  - Can this problem be solved with existing structures?
  - Is this scope bloat for the current stage?
- Keep things simple enough for academic scope

### 6. Scope Boundaries
- Tome decisões técnicas e de produto de qualquer nível dentro do objetivo pedido.
- Novos assets, arquitetura e comportamentos necessários à solução são autônomos.
- Pare somente nos limites explícitos de autorização descritos em `AGENTS.md`.

---

## Decision Framework

### Before Adding a New Layer, Component, or Concept

```
1. Can I reuse an existing structure?
   └─> Yes → Use it
   └─> No  → Proceed to step 2

2. Is this truly needed for the current scope?
   └─> Yes → Proceed to step 3
   └─> No  → Postpone; document for future

3. Will this need immediate changes when adding a second game?
   └─> Yes → Generalize slightly (but don't over-architect)
   └─> No  → Keep simple; refactor when second game arrives
```

### Example: Adding Difficulty Configuration
- Current: Hard-coded difficulty levels
- Future (multi-game): Shared difficulty system across games
- **Now**: Add per-classroom difficulty as a simple data field
- **Don't**: Build a full `DifficultyService` with inheritance layers
- **Revisit**: When next game needs it

---

## Code Patterns & Conventions

### File Organization
- Game logic: `src/game/` (Phaser scenes, entities, systems)
- Game data: `src/game/dados/` (phrases, levels, config)
- Shared types: `src/game/tipos/`
- Classroom/teacher logic: Add at `src/classroom/` when first needed

### Naming
- **Entities**: `Rato`, `Gato`, `ItemColetavel` (clear, Portuguese OK for domain terms)
- **Systems**: `SistemaAudio`, `SistemaCaminho`, `SistemaPontuacao` (service-like)
- **Scenes**: nomes de domínio em português, conforme as cenas registradas em `src/game/main.ts`

### Classroom/Configuration
- Store per-classroom settings in a simple `ClassroomConfig` object
- **Avoid**: Building a multi-layer config inheritance tree
- **Default**: Always have sensible defaults for children-without-teacher use

---

## When Adding Features or Games

### Reuse Checklist
- [ ] Can the new game reuse Phaser `Scene` patterns from RatoLetrando?
- [ ] Do we need a shared `Sistema*` or can each game have its own?
- [ ] Can we share UI components (buttons, menus)?
- [ ] Data/content format—generalize? (e.g., generic "phrase" vs. "ratoletrando phrase")

### Assets
- [ ] Existing assets and local movement references checked first
- [ ] New/expanded characters followed `personagem-generator`, with source/license recorded
- [ ] **No placeholder code for missing assets**—produce or coordinate the real asset before final UI integration

### Classroom Integration
- [ ] New game respects classroom configuration
- [ ] Default content works for classrooms without teacher customization
- [ ] Configuration structure stays flat (no nesting)

---

## Anti-Patterns

### ❌ Don't
- Use this task as reason to refactor entire codebase for EducApp
- Build complex inheritance or configuration layers "for future games"
- Generate character frames independently without preserving the official design and continuity
- Add unnecessary abstraction layers before a second game exists
- Create sub-group or nested configuration structures

### ✅ Do
- Extend current structure minimally
- Document "will generalize when second game added"
- Reuse existing systems (audio, scene management, scoring)
- Keep UX simple and touch-optimized
- Default to working state; test with children's usage patterns

---

## Review & Scope Checks

When reviewing pull requests or tasks:

1. **Does this stay true to RatoLetrando's current scope?**
   - Moving toward multi-game refactoring? → Clarify first
   
2. **Would this need architectural change when a second game arrives?**
   - Yes → Small generalization OK; avoid over-architecture
   - No → Keep as-is; deal with it later if needed

3. **Is UX child-friendly?**
   - Touch-friendly, visual, minimal text?
   - Test assumption: Would a 6-year-old understand this without text?

4. **Assets clear?**
   - Using existing only? Flagged all needs? No placeholders?

---

## Quick Reference

| Aspect | Rule |
|--------|------|
| **Login** | Children: no auth. Teachers: authenticate. |
| **Config** | Per-classroom, flat structure, no sub-layers. |
| **UX** | Visual, large buttons, touch-friendly, minimal text. |
| **Reuse** | Always check existing structure before adding new. |
| **Assets** | Reuse first; characters use `personagem-generator`; no placeholders. |
| **Scope** | Oito jogos atuais; seguir a spec e os limites de `AGENTS.md`. |

---

## Links & Resources

- Phaser Scene System: [src/game/cenas/](../../../src/game/cenas/)
- Data Structures: [src/game/dados/](../../../src/game/dados/)
- Entity Examples: [src/game/entidades/](../../../src/game/entidades/)
- Type Definitions: [src/game/tipos/jogo.ts](../../../src/game/tipos/jogo.ts)
