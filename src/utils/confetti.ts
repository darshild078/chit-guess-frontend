import confetti from 'canvas-confetti';

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  } catch (e) {
    // fallback if canvas-confetti is not supported
  }
}

export const fireConfetti = triggerConfetti;
