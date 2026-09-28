import { world, system } from "@minecraft/server";

const TOTEM_ID = "minemods:totem_do_retorno";
// getDefaultSpawnLocation() usa este Y quando a altura do spawn do mundo não é fixa.
const ALTURA_INDEFINIDA = 32767;
const ALTURA_ESPERA = 320;
const MAX_TICKS_ESPERA = 100;
// Vermelho das gemas do totem (RGB de 0 a 1).
const VERMELHO_TOTEM = { red: 0.75, green: 0.05, blue: 0.05 };

// Ao entrar no mundo: desbloqueia a receita para o jogador, senão ela só aparece
// pela busca do livro de receitas e não na aba Equipamentos.
world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
  if (!initialSpawn) return;
  try {
    player.runCommand(`recipe give @s ${TOTEM_ID}`);
  } catch {
    // Receita já desbloqueada.
  }
});

// Jogadores que estão comendo o totem agora (ids), para limpar o efeito ao parar.
const comendo = new Set();

// Ao começar a comer: distorção de tela e som de entrada no portal do Nether.
world.afterEvents.itemStartUse.subscribe(({ itemStack, source: player }) => {
  if (itemStack?.typeId !== TOTEM_ID) return;
  comendo.add(player.id);
  player.addEffect("nausea", 20 * 10, { showParticles: false });
  player.playSound("portal.trigger");
});

// Ao parar de comer (cancelado ou concluído): remove a distorção e corta o som.
world.afterEvents.itemStopUse.subscribe(({ source: player }) => {
  if (comendo.delete(player.id)) encerrarEfeitoPortal(player);
});

/** @param {import("@minecraft/server").Player} player */
function encerrarEfeitoPortal(player) {
  player.removeEffect("nausea");
  player.runCommand("stopsound @s portal.trigger");
}

// Disparado quando o jogador termina de "comer" o totem (o item já foi consumido).
world.afterEvents.itemCompleteUse.subscribe(({ itemStack, source: player }) => {
  if (itemStack?.typeId !== TOTEM_ID) return;

  comendo.delete(player.id);
  encerrarEfeitoPortal(player);
  // Punição por usar o totem: 1 minuto de náusea.
  player.addEffect("nausea", 20 * 60, { showParticles: false });
  // Tela vermelha rápida durante o teleporte, como ao atravessar o portal.
  player.camera.fade({
    fadeColor: VERMELHO_TOTEM,
    fadeTime: { fadeInTime: 0.1, holdTime: 0.15, fadeOutTime: 0.5 },
  });

  const spawn = player.getSpawnPoint();

  if (spawn) {
    // Centro do bloco e um bloco acima, para não ficar preso dentro da cama.
    player.teleport(
      { x: spawn.x + 0.5, y: spawn.y + 1, z: spawn.z + 0.5 },
      { dimension: spawn.dimension }
    );
  } else {
    irParaSpawnDoMundo(player);
  }
  player.playSound("mob.endermen.portal");
});

// Sem cama salva: vai para o spawn do mundo (Overworld).
/** @param {import("@minecraft/server").Player} player */
function irParaSpawnDoMundo(player) {
  const overworld = world.getDimension("overworld");
  const spawn = world.getDefaultSpawnLocation();
  const xz = { x: spawn.x + 0.5, z: spawn.z + 0.5 };

  if (spawn.y !== ALTURA_INDEFINIDA) {
    player.teleport({ ...xz, y: spawn.y }, { dimension: overworld });
    return;
  }

  // Altura indefinida: segura o jogador no alto até o chunk carregar e então desce para o chão.
  player.teleport({ ...xz, y: ALTURA_ESPERA }, { dimension: overworld });
  let ticks = 0;
  const runId = system.runInterval(() => {
    if (!player.isValid) return system.clearRun(runId);

    let chao;
    try {
      chao = overworld.getTopmostBlock(xz);
    } catch {
      // Chunk ainda não carregado.
    }

    if (chao) {
      player.teleport({ ...xz, y: chao.y + 1 }, { dimension: overworld });
      system.clearRun(runId);
    } else if (++ticks >= MAX_TICKS_ESPERA) {
      // Não achou o chão a tempo: solta o jogador com queda lenta para não morrer.
      player.addEffect("slow_falling", 20 * 60, { showParticles: false });
      system.clearRun(runId);
    } else {
      player.teleport({ ...xz, y: ALTURA_ESPERA }, { dimension: overworld });
    }
  }, 1);
}
