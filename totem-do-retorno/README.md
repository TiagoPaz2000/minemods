# Totem do Retorno

**Versão atual:** 1.2.1
**Plataforma:** Minecraft Bedrock Edition 1.21.90+ (celular, PC e consoles: o add-on é o mesmo em todos)

## Objetivo

Adiciona o **Totem do Retorno**, um item que se usa como comida. Quando você termina de comê-lo, é teleportado para o seu **spawnpoint salvo** (a última cama em que dormiu) **sem morrer**, mantendo todos os itens e o XP.

- O totem é **destruído ao ser usado**: cada uso gasta 1 unidade.
- Cabem **até 64 totens** em um mesmo espaço do inventário.
- Dá para comer mesmo com a barra de fome cheia.
- Usar o totem **não altera a fome nem a vida** do personagem (nutrição e saturação são zero, e não há cura nem dano).
- Se você não tiver cama salva, o totem também é gasto e você vai para o **spawn do mundo**, o mesmo lugar onde nasceria ao morrer.
- Funciona entre dimensões: comer no Nether leva você de volta à cama no Overworld.

### Receita (bancada de trabalho)

| | | |
|:-:|:-:|:-:|
| Osso | Osso | Osso |
| Redstone | Couro | Redstone |
| | Barra de ouro | |

## Estrutura

```
totem-do-retorno/
├── behavior_pack/        # item, receita e script (@minecraft/server 2.0.0)
├── resource_pack/        # textura, nomes (pt_BR / en_US)
└── build.ps1             # gera dist/totem-do-retorno-<versao>.mcaddon
```

> A textura em `resource_pack/textures/items/totem_do_retorno.png` é **provisória** (16x16). Ela será substituída pela arte definitiva.

## Como instalar

1. No PC, rode `powershell -ExecutionPolicy Bypass -File build.ps1`. O arquivo sai em `dist/`.
2. Passe o `.mcaddon` para o celular e abra com o Minecraft. Ele importa os dois packs sozinho.
3. Nas configurações do mundo, ative o **Behavior Pack** "Totem do Retorno (BP)". O Resource Pack é ativado junto. Não precisa ligar nenhum experimento.

## Como versionar

A cada mudança, incremente a versão nestes lugares (sempre com o mesmo número):
- `behavior_pack/manifest.json`: `header.version` e `version` de cada módulo;
- `resource_pack/manifest.json`: `header.version` e `version` do módulo;
- `behavior_pack/manifest.json`: `version` da dependência do resource pack;
- a linha **Versão atual** deste README e uma nova entrada no changelog.

## Changelog

### 1.2.1 (2026-09-28)
- Documentado que usar o totem não altera a fome nem a vida do personagem. Não houve mudança de comportamento.

### 1.2.0 (2026-09-28)
- Sem cama salva, o totem agora é gasto e leva o jogador ao spawn do mundo. Antes ele era devolvido ao inventário com uma mensagem.
- Removida a mensagem de "sem spawnpoint".

### 1.1.0 (2026-09-28)
- O totem agora empilha até 64 unidades (antes era 1).
- Documentado que o totem é destruído ao ser usado (1 unidade por uso).

### 1.0.0 (2026-09-28)
- Versão inicial: item Totem do Retorno (comestível), receita na bancada e teleporte para o spawnpoint salvo ao comer.
- Textura provisória.
