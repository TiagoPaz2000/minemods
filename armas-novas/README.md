# Armas Novas

**Versão atual:** 1.3.5
**Criador:** tubbinho
**Plataforma:** Minecraft Bedrock Edition 1.26.50+ (celular, PC e consoles: o add-on é o mesmo em todos)

### [⬇️ Baixar a última versão (.mcaddon)](https://github.com/TiagoPaz2000/minemods/raw/main/armas-novas/download/armas-novas.mcaddon)

## Objetivo

Adiciona **armas novas** ao Minecraft. A primeira é a **Zarabatana de Bambu**, uma arma de longo alcance mais fraca que o arco, que atira **dardos**.

### Zarabatana de Bambu

- Funciona como o arco: segure o botão de usar para puxar e solte para atirar. Quanto mais tempo você puxa (até 1 segundo), mais longe e mais forte vai o dardo.
- **Mira:** enquanto você puxa, a zarabatana deixa de ficar inclinada na mão e fica **reta, apontando para onde você mira**, na mesma posição da flecha no arco. A tela também dá **zoom**, como no arco: o campo de visão fecha até 50 durante o segundo de puxada e volta ao normal quando você atira ou desiste.
- **Cruz de mira:** no celular/tablet (toque), uma cruz de mira aparece no centro da tela enquanto você puxa. No teclado e no controle ela não é adicionada, porque a mira do próprio jogo já aparece.
- **O dardo voa praticamente em linha reta:** ele cai bem menos que a flecha (cerca de 1 bloco a cada 30 de distância).
- Usa **dardos** como munição. Eles podem estar na outra mão ou em qualquer lugar do inventário. Se você tiver os dois tipos, ela gasta primeiro o dardo comum.
- **Mais fraca que o arco:** o dardo sai mais devagar que a flecha e tira até 3 de vida (1,5 coração) com a zarabatana totalmente puxada. Ela não dá disparo crítico.
- **Corpo a corpo:** batendo com ela, o dano é o mesmo da mão vazia e do bambu (1). Esse é o mínimo que o Minecraft permite para um item.
- **Não pode ser encantada**, nem na mesa de encantamento nem na bigorna.
- Não quebra com o uso.

### Dardo

- Munição da zarabatana. Cabem 64 em um espaço do inventário.
- Em voo, aparece como um dardo (osso na ponta e haste de graveto), não como flecha, sempre apontando para a direção em que voa.
- Se acertar um bicho ou jogador, o dardo some. Se acertar um bloco, ele cai no chão como item e pode ser recolhido, como a flecha. No modo criativo ele não cai, para não duplicar munição.

### Dardo Envenenado

- Igual ao dardo, e ainda dá **Veneno I por 5 segundos** no alvo atingido (cerca de 4 de vida, ou 2 corações).
- É bem mais fraco que a poção de veneno, que dura 45 segundos.
- Como o veneno comum, não afeta mortos-vivos (zumbis, esqueletos etc.).

### Receitas (bancada de trabalho)

**Zarabatana de Bambu:** 3 bambus na diagonal. Qualquer uma das duas diagonais funciona.

| | | |
|:-:|:-:|:-:|
| Bambu | | |
| | Bambu | |
| | | Bambu |

**Dardo (4 unidades):** um osso e, ao lado, um graveto. Funciona em qualquer linha da grade e também com o graveto à esquerda.

| | |
|:-:|:-:|
| Osso | Graveto |

**Dardo Envenenado (1 unidade):** um dardo e um olho de aranha, em qualquer posição (receita sem forma).

As receitas já vêm desbloqueadas para todos os jogadores. Os três itens ficam na aba **Equipamentos** do inventário criativo e do livro de receitas.

## Estrutura

```
armas-novas/
├── arte/                 # arte original dos ícones (fora do .mcaddon)
├── behavior_pack/        # itens, receitas, projéteis dos dardos e script (@minecraft/server 2.0.0)
├── download/             # armas-novas.mcaddon: última versão, alvo do link de download
├── resource_pack/        # ícones, zarabatana na mão, dardos em voo, cruz de mira, nomes (pt_BR / en_US)
└── build.ps1             # gera dist/armas-novas-<versao>.mcaddon e atualiza download/
```

- Os ícones dos itens ficam em `resource_pack/textures/items/`, com **fundo transparente**. A zarabatana tem **32x32** pixels, e os dois dardos têm **16x16**. Eles foram gerados a partir das artes em `arte/` (`*_original.png`, 1254x1254) assim:
  1. alfa binário: cada pixel fica totalmente opaco ou totalmente transparente, sem bordas translúcidas;
  2. detecção da grade de pixels do desenho: cerca de 41 px por "pixel" na zarabatana e 35 px nos dardos;
  3. cada célula da grade vira 1 pixel, com a cor predominante da célula. O resultado tem 28x28 pixels na zarabatana e 15x15 nos dardos;
  4. esse resultado é colocado no quadro final. A zarabatana fica centralizada em 32x32. Os dardos ficam em 16x16, com a coluna da direita livre para as gotinhas de veneno do Dardo Envenenado.
- Em voo, o dardo tem modelo, animação e render controller próprios, sem depender dos arquivos da flecha vanilla:
  - modelo: `models/entity/dardo.geo.json`, com o mesmo formato da flecha;
  - animação: `animations/dardo.animation.json`. Ela aponta o modelo pelas propriedades de entidade `minemods:direcao` e `minemods:inclinacao` (em graus, no padrão de rotação do jogo). O script grava essas propriedades no dardo ao criá-lo, calculadas a partir da velocidade do disparo. As consultas de rotação do jogo não servem num projétil de add-on:
    - a da flecha vanilla (`query.target_y_rotation`) deixava o dardo torto;
    - a do tutorial oficial (`-query.head_y_rotation(0) - query.body_y_rotation`) fazia o dardo sair de lado, girando;
    - `query.body_y_rotation` muda sozinha durante o voo e não gira o modelo inteiro, então subtraí-la também fazia o dardo girar (1.3.4). A direção usa só a propriedade;
  - render controller: `render_controllers/dardo.render_controllers.json`.

  As texturas são `resource_pack/textures/entity/dardo.png` e `dardo_envenenado.png`, no mesmo formato de `arrows.png` (32x32). A lateral (16x5, no canto superior esquerdo) é o ícone do dardo "desenrolado". Cada diagonal paralela ao dardo no ícone vira uma linha reta, com a ponta de osso à direita. O quadrado 5x5 logo abaixo é a traseira do graveto.
- A cruz de mira do toque é a imagem `resource_pack/textures/ui/minemods_mira.png` (15x15). Ela aparece pelo `resource_pack/ui/hud_screen.json`. Enquanto o jogador mira, o script manda o título `minemods:mira`, e a imagem fica visível só enquanto o título for esse. Ao parar, o script manda `minemods:sem_mira`. O mesmo arquivo esconde esses dois títulos, então eles nunca aparecem como texto.
- A zarabatana na mão é desenhada pelo *attachable* `resource_pack/attachables/zarabatana.json`, que segue o modelo do arco vanilla. Parada, ela usa o ícone normal (`zarabatana.png`). Durante a mira, usa `zarabatana_mirando.png`, que é o ícone espelhado na horizontal para ficar alinhado com a mira. As posições estão em `resource_pack/models/entity/zarabatana.geo.json`, e as animações de segurar e puxar são as do arco vanilla.
- **Dardo recriado pelo script:** sem o experimento "Custom Projectiles", todo dardo lançado pela função de disparo do jogo aparece com o visual da flecha vanilla, mesmo sendo o dardo por dentro (envenena e cai como item de dardo). Isso vale tanto para o `minecraft:shooter` da zarabatana quanto para o `shoot()` da Script API. Um dardo criado com `/summon` aparece certo. Por isso, assim que o dardo disparado nasce (evento `entitySpawn`), o script:
  1. remove o dardo;
  2. cria outro igual com `spawnEntity`, como o `/summon`, na mesma posição e com o mesmo dono;
  3. gira o dardo para a direção do voo (`setRotation`) e grava a direção e a inclinação nas propriedades que a animação usa (`setProperty`);
  4. empurra o dardo com a mesma velocidade (`applyImpulse`), sem usar o `shoot()`.

  Nessa troca a marca de disparo crítico se perde, então a zarabatana não dá crítico.
- O script (`behavior_pack/scripts/main.js`) faz o zoom da mira (comando `/camera ... fov_set`), mostra a cruz de mira no toque e faz o dardo que acerta um bloco cair como item.
- **Limitações conhecidas:**
  - O zoom define um campo de visão fixo (50). Para quem usa um campo de visão maior nas configurações, o zoom fica mais forte que o do arco.
  - Em terceira pessoa, o braço do personagem não levanta como no arco. Isso exigiria substituir o controlador de animações do jogador vanilla, o que pode quebrar em versões futuras do jogo.
  - Enquanto o jogador (no toque) mira, um título enviado por outro add-on ou comando substitui o sinal e esconde a cruz de mira até a próxima puxada.

## Como instalar

1. Baixe o `.mcaddon` pelo link **Baixar a última versão** no topo deste README. No iPhone, dá para abrir o link direto no Safari. Outra opção é gerar o arquivo no PC com `powershell -ExecutionPolicy Bypass -File build.ps1`.
2. Abra o `.mcaddon` com o Minecraft. Ele importa os dois packs sozinho.
3. Nas configurações do mundo, ative o **Behavior Pack** "Armas Novas (BP)". O Resource Pack é ativado junto. Não precisa ligar nenhum experimento.

## Como atualizar para uma versão nova

O Minecraft não substitui a versão anterior ao importar: cada versão fica instalada separadamente, com o mesmo nome. Para não se confundir, a descrição de cada pack começa com a versão (ex.: `v1.0.0 - ...`).

1. Importe o novo `.mcaddon`.
2. Em **Configurações → Armazenamento**, abra **Pacotes de comportamento** e **Pacotes de recursos**, selecione as versões antigas do Armas Novas (confira pela descrição) e exclua.
3. Nas configurações do mundo, confira se o pack ativo mostra a versão nova na descrição. Se não mostrar, desative e ative de novo.

## Como versionar

A cada mudança, incremente a versão nestes lugares (sempre com o mesmo número):
- `behavior_pack/manifest.json`: `header.version` e `version` de cada módulo;
- `resource_pack/manifest.json`: `header.version` e `version` do módulo;
- `behavior_pack/manifest.json`: `version` da dependência do resource pack;
- o início do `header.description` dos dois manifests (`vX.Y.Z - ...`);
- a linha **Versão atual** deste README e uma nova entrada no changelog.

O `build.ps1` confere tudo isso, exceto o changelog, e cancela o build se alguma versão estiver diferente.

Depois de mudar a versão, rode o `build.ps1` e **inclua `download/armas-novas.mcaddon` no commit**. Senão o link de download continua entregando a versão anterior.

## Changelog

### 1.3.5 (2026-09-29)
- Correção: o dardo ainda saía de lado, girando. A animação subtraía `query.body_y_rotation`, que o jogo muda sozinho durante o voo. Agora a direção vem só da propriedade gravada pelo script.

### 1.3.4 (2026-09-29)
- Correção: o dardo saía de lado, girando. Agora o script grava a direção e a inclinação do disparo no dardo (propriedades `minemods:direcao` e `minemods:inclinacao`), e a animação aponta o modelo por elas.

### 1.3.3 (2026-09-29)
- Correção: o dardo em voo ainda aparecia como flecha vanilla, torta. A troca da 1.3.2 lançava o dardo novo com o `shoot()` da Script API, que tem o mesmo problema do disparo do arco. Agora o dardo novo é criado como no `/summon`, girado para a direção do voo e empurrado com a velocidade do disparo.

### 1.3.2 (2026-09-29)
- Correção: o dardo em voo continuava com o visual da flecha vanilla. Sem o experimento "Custom Projectiles", o projétil do componente `minecraft:shooter` é mostrado como flecha. Agora o script troca o dardo disparado por um igual criado pelo script, que usa o visual do dardo.
- A zarabatana deixa de dar disparo crítico, que se perde na troca. O dano máximo é 3.

### 1.3.1 (2026-09-28)
- Correção: o dardo voava torto, sem apontar para a direção do voo. Ele agora tem animação própria, com a rotação usada no tutorial oficial de projéteis.
- O dardo em voo agora tem modelo e render controller próprios (antes usava os da flecha vanilla).

### 1.3.0 (2026-09-28)
- Cruz de mira no centro da tela ao puxar a zarabatana no toque (celular/tablet). O jogo não mostra a mira vanilla para itens de add-on no toque.
- Dardos em voo com aparência própria, feita a partir dos ícones: antes apareciam como flecha.

### 1.2.0 (2026-09-28)
- Mira como a do arco: ao puxar, a zarabatana fica reta, apontando para a mira (textura espelhada `zarabatana_mirando.png` e *attachable* baseado no arco vanilla), e a tela dá zoom.
- O dardo agora voa praticamente em linha reta: gravidade 10 vezes menor (0,005 em vez de 0,05).

### 1.1.0 (2026-09-28)
- Ícones definitivos da Zarabatana de Bambu (32x32), do Dardo e do Dardo Envenenado (16x16), no lugar dos provisórios.
- Artes originais guardadas em `arte/`.

### 1.0.0 (2026-09-28)
- Versão inicial: Zarabatana de Bambu (atira como o arco, mais fraca, não encantável), Dardo e Dardo Envenenado (Veneno I por 5 s), com receitas na bancada.
- Dardo que acerta um bloco cai como item para ser recolhido.
- Ícones provisórios. Em voo, o dardo usa a aparência da flecha vanilla.
