# Totem do Retorno

**Versão atual:** 1.6.2
**Criador:** tubbinho
**Plataforma:** Minecraft Bedrock Edition 1.21.90+ (celular, PC e consoles: o add-on é o mesmo em todos)

## Objetivo

Adiciona o **Totem do Retorno**, um item que se usa como comida. Quando você termina de comê-lo, é teleportado para o seu **spawnpoint salvo** (a última cama em que dormiu) **sem morrer**, mantendo todos os itens e o XP.

- O totem é **destruído ao ser usado**: cada uso gasta 1 unidade.
- Cabem **até 64 totens** em um mesmo espaço do inventário.
- Dá para comer mesmo com a barra de fome cheia.
- Usar o totem **não altera a fome nem a vida** do personagem (nutrição e saturação são zero, e não há cura nem dano).
- Se você não tiver cama salva, o totem também é gasto e você vai para o **spawn do mundo**, o mesmo lugar onde nasceria ao morrer.
- Funciona entre dimensões: comer no Nether leva você de volta à cama no Overworld.
- **Efeito de portal do Nether:** ao começar a comer, a tela distorce (efeito de náusea) e toca o som de entrada no portal. Se você parar de comer antes de terminar, o efeito e o som param. Ao terminar, a tela fica vermelha por um instante (menos de 1 segundo) durante o teleporte.
- **Punição:** depois de comer, o jogador fica com **náusea por 1 minuto**, o preço por usar um item tão forte.

### Receita (bancada de trabalho)

| | | |
|:-:|:-:|:-:|
| Osso | Osso | Osso |
| Redstone | Couro | Redstone |
| | Barra de ouro | |

A receita já vem desbloqueada para todos os jogadores (`"unlock": { "context": "AlwaysUnlocked" }`, o mesmo formato da bancada de trabalho vanilla). O item é registrado na aba **Equipamentos** (inventário criativo e livro de receitas) pelo `behavior_pack/item_catalog/crafting_item_catalog.json`, no final da aba. Ele também aparece pela busca.

## Estrutura

```
totem-do-retorno/
├── arte/                 # arte original do totem e capa (fora do .mcaddon)
├── behavior_pack/        # item, receita e script (@minecraft/server 2.0.0)
├── resource_pack/        # textura, nomes (pt_BR / en_US)
└── build.ps1             # gera dist/totem-do-retorno-<versao>.mcaddon
```

A capa do mod é o `pack_icon.png` (256x256), que fica na raiz dos dois packs. A mesma imagem também está guardada em `arte/capa.png`.

O ícone do item (`resource_pack/textures/items/totem_do_retorno.png`) tem **32x32 pixels com fundo transparente**. Ele foi gerado a partir de `arte/totem_do_retorno_original.png` assim:
1. alfa binário: cada pixel fica totalmente opaco ou totalmente transparente, sem bordas translúcidas;
2. detecção da grade de pixels do desenho (cerca de 42 px por "pixel" na imagem de 1254x1254);
3. cada célula da grade vira 1 pixel, com a cor predominante da célula. O resultado tem 23x26 pixels;
4. esse resultado é centralizado num quadro de 32x32.

## Como instalar

1. No PC, rode `powershell -ExecutionPolicy Bypass -File build.ps1`. O arquivo sai em `dist/`.
2. Passe o `.mcaddon` para o celular e abra com o Minecraft. Ele importa os dois packs sozinho.
3. Nas configurações do mundo, ative o **Behavior Pack** "Totem do Retorno (BP)". O Resource Pack é ativado junto. Não precisa ligar nenhum experimento.

## Como atualizar para uma versão nova

O Minecraft não substitui a versão anterior ao importar: cada versão fica instalada separadamente, com o mesmo nome. Para não se confundir, a descrição de cada pack começa com a versão (ex.: `v1.3.2 - ...`).

1. Importe o novo `.mcaddon`.
2. Em **Configurações → Armazenamento**, abra **Pacotes de comportamento** e **Pacotes de recursos**, selecione as versões antigas do Totem do Retorno (confira pela descrição) e exclua.
3. Nas configurações do mundo, confira se o pack ativo mostra a versão nova na descrição. Se não mostrar, desative e ative de novo.

## Como versionar

A cada mudança, incremente a versão nestes lugares (sempre com o mesmo número):
- `behavior_pack/manifest.json`: `header.version` e `version` de cada módulo;
- `resource_pack/manifest.json`: `header.version` e `version` do módulo;
- `behavior_pack/manifest.json`: `version` da dependência do resource pack;
- o início do `header.description` dos dois manifests (`vX.Y.Z - ...`);
- a linha **Versão atual** deste README e uma nova entrada no changelog.

O `build.ps1` confere tudo isso, exceto o changelog, e cancela o build se alguma versão estiver diferente.

## Changelog

### 1.6.2 (2026-09-28)
- Correção da receita: o `unlock` estava como lista (`[{ "context": ... }]`), e o jogo acusava "invalid unlock ingredient" e "recipe ingredient is invalid". Com isso a receita ficava bloqueada e só aparecia pela busca. Agora `unlock` é um objeto, como nas receitas vanilla.
- Removido o `/recipe give` automático ao entrar no mundo (1.5.1). Ele era um remendo para esse mesmo erro e ficou desnecessário.

### 1.6.1 (2026-09-28)
- Item registrado no catálogo de itens (`item_catalog/crafting_item_catalog.json`), na aba Equipamentos. Antes o totem só aparecia pela busca do livro de receitas, em nenhuma aba.

### 1.6.0 (2026-09-28)
- Punição por usar o totem: náusea por 1 minuto depois de comer (antes a náusea sumia ao terminar de comer).

### 1.5.2 (2026-09-28)
- A tela no teleporte agora é vermelha (antes roxa) e mais curta: 0,75 s no total, antes 1,35 s.

### 1.5.1 (2026-09-28)
- A receita agora é desbloqueada automaticamente para cada jogador ao entrar no mundo (`/recipe give` via script). Antes ela só aparecia pela busca do livro de receitas, não na aba Equipamentos.

### 1.5.0 (2026-09-28)
- Efeito de portal do Nether ao comer o totem:
  - ao começar: náusea (distorção da tela) e som `portal.trigger`;
  - se parar antes de terminar: o efeito e o som são cancelados;
  - ao terminar: tela roxa rápida no teleporte.

### 1.4.1 (2026-09-28)
- Capa do mod (`pack_icon.png`, 256x256) nos dois packs.
- Criador (tubbinho) na descrição dos packs, no campo `metadata.authors` dos manifests e neste README.

### 1.4.0 (2026-09-28)
- Novo ícone do totem: 32x32, fundo transparente, sem suavização, reconstruído na grade de pixels original do desenho.
- A arte original em `arte/` foi substituída pela nova.

### 1.3.2 (2026-09-28)
- A versão agora aparece no início da descrição dos dois packs, para diferenciar as versões instaladas no jogo.
- O `build.ps1` cancela o build se as versões dos manifests, das descrições e do README não baterem.
- Documentado como remover versões antigas depois de atualizar.

### 1.3.1 (2026-09-28)
- Correção: a receita não aparecia no modo sobrevivência. Faltava o campo `unlock`, exigido pelo sistema de desbloqueio de receitas do Bedrock. Agora a receita fica sempre desbloqueada.

### 1.3.0 (2026-09-28)
- Ícone definitivo do totem (64x64, fundo transparente) no lugar da textura provisória.
- Arte original guardada em `arte/`.

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
