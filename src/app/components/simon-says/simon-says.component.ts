import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioService } from '../../services/audio.service';
import { LucideAngularModule, RotateCcw } from 'lucide-angular';

interface SimonButton {
  color: string;
  sound: number;
  isActive: boolean;
}

@Component({
  selector: 'app-simon-says',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './simon-says.component.html',
  styleUrls: ['./simon-says.component.scss']
})
export class SimonSaysComponent implements OnInit, OnDestroy {
  readonly RotateCcwIcon = RotateCcw;
  buttons: SimonButton[] = [
    { color: '#FF0000', sound: 261.6, isActive: false }, // Red - C4
    { color: '#00FF00', sound: 329.6, isActive: false }, // Green - E4
    { color: '#0000FF', sound: 392.0, isActive: false }, // Blue - G4
    { color: '#FFFF00', sound: 523.2, isActive: false }  // Yellow - C5
  ];

  sequence: number[] = [];
  playerSequence: number[] = [];
  currentLevel: number = 1;
  isPlaying: boolean = false;
  gameStatus: string = 'Press Start to begin!';
  successColor: string = '#2ecc71';  // Green color from matching game
  private audioContext: AudioContext | null = null;
  private timeouts: ReturnType<typeof setTimeout>[] = [];

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.audioContext = new AudioContext();
  }

  ngOnDestroy() {
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    if (this.audioContext) {
      this.audioContext.close();
    }
  }

  startGame() {
    this.sequence = [];
    this.currentLevel = 1;
    this.isPlaying = true;
    this.gameStatus = 'Watch the sequence...';
    this.generateNextSequence();
  }

  generateNextSequence() {
    const newButton = Math.floor(Math.random() * 4);
    this.sequence.push(newButton);
    this.playerSequence = [];
    
    // Play the sequence
    this.timeouts = [];
    this.sequence.forEach((buttonIndex, i) => {
      const timeout = setTimeout(() => {
        this.activateButton(buttonIndex);
        if (i === this.sequence.length - 1) {
          setTimeout(() => {
            this.gameStatus = 'Your turn!';
          }, 1000);
        }
      }, (i + 1) * 1000);
      this.timeouts.push(timeout);
    });
  }

  handlePlayerInput(buttonIndex: number) {
    if (!this.isPlaying || this.gameStatus !== 'Your turn!') return;

    this.activateButton(buttonIndex);
    this.playerSequence.push(buttonIndex);

    const currentIndex = this.playerSequence.length - 1;
    if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
      this.gameOver();
      return;
    }

    if (this.playerSequence.length === this.sequence.length) {
      this.gameStatus = 'Correct! Watch the next sequence...';
      if (this.currentLevel === 7) {
        setTimeout(() => this.winGame(), 1000);
      } else {
        this.currentLevel++;
        setTimeout(() => this.generateNextSequence(), 1500);
      }
    }
  }

  private activateButton(index: number) {
    if (!this.audioContext) return;
    
    this.buttons[index].isActive = true;
    
    // Create and play sound
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = this.buttons[index].sound;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    
    // Keep the button lit for longer during sequence playback
    const duration = this.gameStatus.includes('Watch') ? 600 : 300;
    
    setTimeout(() => {
      this.buttons[index].isActive = false;
      oscillator.stop();
    }, duration);
  }

  private gameOver() {
    this.isPlaying = false;
    this.gameStatus = `Game Over! You reached level ${this.currentLevel}${this.currentLevel >= 5 ? ' - You still won!' : ''}`;
  }

  private winGame() {
    this.isPlaying = false;
    this.gameStatus = 'Congratulations! You\'ve completed all levels!';
  }
}
