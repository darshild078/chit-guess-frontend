import { useSoundStore } from '../stores/sound.store';

class SoundService {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1) {
    if (useSoundStore.getState().muted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playerJoined() {
    this.playTone(523.25, 'sine', 0.1, 0.05); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.2, 0.05), 100); // E5
  }

  chitSubmitted() {
    this.playTone(800, 'triangle', 0.05, 0.02);
  }

  allSubmitted() {
    this.playTone(523.25, 'sine', 0.1, 0.05);
    setTimeout(() => this.playTone(659.25, 'sine', 0.1, 0.05), 100);
    setTimeout(() => this.playTone(783.99, 'sine', 0.3, 0.05), 200);
  }

  identityRevealed() {
    this.playTone(440, 'triangle', 0.1, 0.05);
    setTimeout(() => this.playTone(349.23, 'sawtooth', 0.4, 0.03), 100);
  }

  error() {
    this.playTone(150, 'sawtooth', 0.3, 0.05);
  }

  buttonPress() {
    this.playTone(1000, 'sine', 0.03, 0.01);
  }
}

export const soundService = new SoundService();
