# minemods — Regras do repositório

> **Leitura obrigatória:** consulte este arquivo antes de QUALQUER mudança no repositório.

## Propósito

Este repositório é um conjunto de mods para Minecraft criados pelo autor.

## Regras

1. **Uma pasta por mod.** Cada mod vive em sua própria pasta na raiz do repositório (ex.: `meu-mod/`), com todo o seu código, recursos e documentação dentro dela.
2. **Isolamento de mudanças.** Uma alteração em um mod só pode modificar arquivos da pasta daquele mod. Nunca altere arquivos de outras pastas de mods na mesma mudança.
3. **Versão sempre atualizada.** Toda mudança em um mod deve incrementar a versão dele (no arquivo de build/metadados do mod, ex.: `gradle.properties`, `fabric.mod.json`, `mods.toml`).
4. **Documentação por mod.** Cada mod deve ter um `README.md` na sua pasta contendo:
   - **Objetivo do mod** — o que ele faz e para que serve (manter atualizado).
   - **Changelog** — a cada mudança, adicionar uma entrada com a nova versão, a data e um resumo do que foi alterado.

## Modelo de `README.md` do mod

```markdown
# <Nome do Mod>

**Versão atual:** 1.0.0

## Objetivo

<Descrição do que o mod faz e seu propósito.>

## Changelog

### 1.0.0 — AAAA-MM-DD
- <Resumo do que foi alterado.>
```

## Checklist antes de concluir uma mudança

- [ ] Somente a pasta do mod alvo foi alterada.
- [ ] A versão do mod foi incrementada.
- [ ] O `README.md` do mod tem nova entrada no changelog e o objetivo está atualizado.
