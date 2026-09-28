# minemods — Regras do repositório

> **Leitura obrigatória:** consulte este arquivo antes de QUALQUER mudança no repositório.

## Propósito

Este repositório é um conjunto de mods para Minecraft criados pelo autor.

## Regras

1. **Uma pasta por mod.** Cada mod vive em sua própria pasta na raiz do repositório (ex.: `meu-mod/`), com todo o seu código, recursos e documentação dentro dela.
2. **Isolamento de mudanças.** Uma alteração em um mod só pode modificar arquivos da pasta daquele mod. Nunca altere arquivos de outras pastas de mods na mesma mudança.
3. **Versão sempre atualizada.** Toda mudança em um mod deve incrementar a versão dele (no arquivo de build/metadados do mod, ex.: `manifest.json` no Bedrock; `gradle.properties`, `fabric.mod.json`, `mods.toml` no Java).
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

## Conhecimento técnico: add-ons Bedrock

Lições aprendidas no desenvolvimento dos mods. Consulte antes de criar ou alterar um add-on Bedrock.

### Diagnóstico
- **Primeiro passo para qualquer problema no jogo:** ativar **Configurações → Criador → Interface do registro de conteúdo** (Content Log GUI) e entrar no mundo. Os erros de JSON, receita e script aparecem na tela. Peça o texto ou um print ao usuário antes de tentar correções às cegas.
- Na dúvida sobre um formato JSON, compare com os arquivos vanilla em [Mojang/bedrock-samples](https://github.com/Mojang/bedrock-samples) (`behavior_pack/recipes`, `behavior_pack/items`). A documentação da Microsoft às vezes está desatualizada.

### Receitas
- **`unlock` com `context` é um objeto, não uma lista:** `"unlock": { "context": "AlwaysUnlocked" }`. A forma em lista só serve para itens e tags: `"unlock": [ { "item": "minecraft:bone" } ]`, `[ { "tag": "minecraft:planks" } ]`.
- Com `[ { "context": ... } ]`, o jogo acusa `has an invalid unlock ingredient` e `recipe ingredient is invalid, must contain either a valid item name or item tag`. A receita continua craftável e aparece na busca do livro de receitas, mas fica bloqueada e **não aparece nas abas**.

### Empacotamento e versões
- O `.mcaddon` é um zip com as pastas dos packs na raiz. Os caminhos dentro do zip precisam usar `/`. O `Compress-Archive` do Windows PowerShell 5.1 grava `\`, o que quebra a importação no celular; use `System.IO.Compression.ZipFile` com os nomes das entradas montados à mão.
- Scripts `.ps1` com acentos precisam ser salvos em **UTF-8 com BOM**. Sem BOM, o PowerShell 5.1 lê o arquivo como ANSI e corrompe as strings.
- **Importar uma versão nova não substitui a antiga:** cada versão fica instalada lado a lado, com o mesmo nome. Por isso a descrição de cada pack deve começar com `vX.Y.Z - `, e as versões antigas são apagadas em **Configurações → Armazenamento**.
- A versão de um add-on Bedrock aparece em vários lugares: `header.version` e `modules[].version` dos dois manifests, a dependência do BP para o RP, a descrição dos packs e o README do mod. Todos precisam ter o mesmo número (regra 3). Um script de build deve conferir isso.

### Script API (`@minecraft/server`)
- A versão `2.0.0` é estável (jogo 1.21.90+) e não exige experimentos.
- Para checar o script sem o jogo, baixe as tipagens oficiais com `npm pack @minecraft/server@<versão>` numa pasta temporária, fora do repositório, e rode `tsc --noEmit --allowJs --checkJs`.
- `player.camera.fade()` **não aceita transparência**: a cor sempre cobre a tela inteira.
- `world.getDefaultSpawnLocation()` retorna `y = 32767` quando a altura do spawn não é fixa. Nesse caso é preciso achar o chão com `dimension.getTopmostBlock()`, que falha se o chunk não estiver carregado.

### Plataformas
- O mesmo `.mcaddon` funciona em iPhone, Android, PC e console.
- No iPhone: abrir o arquivo pelo app Arquivos (ou por um anexo), tocar em **Compartilhar → Minecraft**, e depois ativar o Behavior Pack nas configurações do mundo.

## Checklist antes de concluir uma mudança

- [ ] Somente a pasta do mod alvo foi alterada.
- [ ] A versão do mod foi incrementada.
- [ ] O `README.md` do mod tem nova entrada no changelog e o objetivo está atualizado.
