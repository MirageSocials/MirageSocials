// Web Audio API sound effects for trade notifications
let audioCtx: AudioContext | null = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.15) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Audio not available
  }
}

export function playWinSound() {
  playTone(880, 0.12, "sine", 0.12);
  setTimeout(() => playTone(1100, 0.15, "sine", 0.1), 100);
  setTimeout(() => playTone(1320, 0.2, "sine", 0.08), 200);
}

export function playLossSound() {
  playTone(440, 0.15, "square", 0.08);
  setTimeout(() => playTone(330, 0.25, "square", 0.06), 120);
}

export function playOpenSound() {
  playTone(660, 0.08, "sine", 0.06);
}

export function playDepositSound() {
  playTone(523, 0.1, "sine", 0.1);
  setTimeout(() => playTone(659, 0.1, "sine", 0.08), 80);
  setTimeout(() => playTone(784, 0.15, "sine", 0.06), 160);
}

export function playWithdrawSound() {
  playTone(784, 0.1, "sine", 0.08);
  setTimeout(() => playTone(523, 0.2, "sine", 0.06), 100);
}
