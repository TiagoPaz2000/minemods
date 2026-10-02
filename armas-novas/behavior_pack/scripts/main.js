import { world, ItemStack, Player, GameMode, InputMode } from "@minecraft/server";

const ZARABATANA_ID = "minemods:zarabatana";
// Projéteis que viram item de novo ao cair num bloco, como a flecha. O id do item é o mesmo do projétil.
const DARDOS = new Set(["minemods:dardo", "minemods:dardo_envenenado"]);
// Títulos de sinal lidos pelo resource_pack/ui/hud_screen.json: o primeiro mostra a mira no
// centro da tela, o segundo a esconde. Nenhum dos dois aparece como texto.
const TITULO_MIRA = "minemods:mira";
const TITULO_SEM_MIRA = "minemods:sem_mira";
const UMA_HORA = 20 * 60 * 60;

// Jogadores mirando com a zarabatana agora (ids), para desfazer o zoom e a mira ao parar.
const mirando = new Set();
// Dardos criados pelo script (ids), para não serem trocados de novo.
const dardosDoScript = new Set();

// Todo dardo lançado pela função de disparo do jogo (o minecraft:shooter da zarabatana, ou o shoot()
// da Script API) aparece com o visual da flecha vanilla quando o experimento "Custom Projectiles" está
// desligado. Criado como no /summon, ele usa o visual do resource pack. Por isso o dardo disparado é
// trocado por um criado pelo script e empurrado com a mesma velocidade, na mesma posição e com o mesmo dono.
world.afterEvents.entitySpawn.subscribe(({ entity }) => {
  if (dardosDoScript.delete(entity.id)) return;
  if (!entity.isValid || !DARDOS.has(entity.typeId)) return;

  const dono = entity.getComponent("minecraft:projectile")?.owner;
  const id = entity.typeId;
  const local = entity.location;
  const velocidade = entity.getVelocity();
  const dimensao = entity.dimension;
  entity.remove();

  const dardo = dimensao.spawnEntity(id, local);
  dardosDoScript.add(dardo.id);
  const projetil = dardo.getComponent("minecraft:projectile");
  if (projetil && dono?.isValid) projetil.owner = dono;
  // A animação do dardo (resource_pack/animations/dardo.animation.json) aponta o modelo por estas
  // propriedades: as consultas de rotação do jogo não seguem a direção de um projétil de add-on.
  const rotacao = rotacaoDe(velocidade);
  dardo.setRotation(rotacao);
  dardo.setProperty("minemods:direcao", rotacao.y);
  dardo.setProperty("minemods:inclinacao", rotacao.x);
  dardo.applyImpulse(velocidade);
});

/**
 * Rotação (em graus) de quem olha na direção do vetor, no padrão do jogo: x = inclinação
 * (positivo para baixo), y = direção (0 = sul).
 * @param {import("@minecraft/server").Vector3} v
 */
function rotacaoDe({ x, y, z }) {
  return {
    x: (-Math.atan2(y, Math.hypot(x, z)) * 180) / Math.PI,
    y: (Math.atan2(-x, z) * 180) / Math.PI,
  };
}

// Zoom da mira, como o do arco: o campo de visão fecha durante 1 s, o tempo de puxar a zarabatana.
world.afterEvents.itemStartUse.subscribe(({ itemStack, source: player }) => {
  if (itemStack?.typeId !== ZARABATANA_ID) return;
  mirando.add(player.id);
  player.runCommand("camera @s fov_set 50 1 out_quad");
  // No toque o jogo não mostra cruz de mira para itens de add-on. Teclado e controle já têm a vanilla.
  if (player.inputInfo.lastInputModeUsed === InputMode.Touch) {
    player.onScreenDisplay.setTitle(TITULO_MIRA, { fadeInDuration: 0, stayDuration: UMA_HORA, fadeOutDuration: 0 });
  }
});

// Ao atirar ou desistir da mira: volta ao campo de visão normal e tira a mira da tela.
world.afterEvents.itemStopUse.subscribe(({ source: player }) => {
  if (!mirando.delete(player.id)) return;
  player.runCommand("camera @s fov_clear 0.2");
  player.onScreenDisplay.setTitle(TITULO_SEM_MIRA, { fadeInDuration: 0, stayDuration: 0, fadeOutDuration: 0 });
});

// Dardo que acerta um bloco cai no chão como item, para o jogador recolher.
world.afterEvents.projectileHitBlock.subscribe(({ projectile, source, dimension }) => {
  if (!projectile.isValid || !DARDOS.has(projectile.typeId)) return;

  const id = projectile.typeId;
  const local = projectile.location;
  projectile.remove();
  // No criativo a zarabatana não gasta dardos: devolver o item duplicaria munição.
  if (source instanceof Player && source.getGameMode() === GameMode.Creative) return;
  dimension.spawnItem(new ItemStack(id, 1), local);
});
