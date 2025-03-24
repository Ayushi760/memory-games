import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { LucideAngularModule, Volume2, VolumeX, Music, RotateCcw } from 'lucide-angular';
import { AudioService } from '../../services/audio.service';

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
  standalone: true,
  imports: [CommonModule, CardComponent, LucideAngularModule]
})
export class GameBoardComponent implements OnInit, OnDestroy {
  readonly Volume2Icon = Volume2;
  readonly VolumeXIcon = VolumeX;
  readonly Music = Music;
  readonly RotateCcwIcon = RotateCcw;
  cards: Card[] = [];
  flippedCards: Card[] = [];
  values = ['🍎', '🍌', '🍇', '🍉', '🍒', '🍍'];
  timer: number = 0;
  milliseconds: number = 0;
  timerInterval: any;
  isGameComplete: boolean = false;
  isTimerStarted: boolean = false;
  isMuted: boolean = false;

  constructor(private audioService: AudioService) {
    this.audioService.isMuted$.subscribe(
      muted => this.isMuted = muted
    );
  }

  formatTime(): string {
    const hours = Math.floor(this.timer / 3600);
    const minutes = Math.floor((this.timer % 3600) / 60);
    const seconds = this.timer % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  formatMilliseconds(): string {
    return this.milliseconds.toString().padStart(2, '0');
  }

  ngOnInit() {
    this.startGame();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  startGame() {
    this.stopTimer();
    this.timer = 0;
    this.milliseconds = 0;
    this.isGameComplete = false;
    this.isTimerStarted = false;
    this.cards = this.shuffle([...this.values, ...this.values].map((value, id) => ({
      id,
      value,
      flipped: false,
      matched: false
    })));
  }

  shuffle(array: Card[]): Card[] {
    return array.sort(() => 0.5 - Math.random());
  }

  flipCard(card: Card) {
    if (card.flipped || card.matched || this.flippedCards.length === 2) return;
    
    if (!this.isTimerStarted) {
      this.isTimerStarted = true;
      this.startTimer();
    }
    
    card.flipped = true;
    this.flippedCards.push(card);
    this.audioService.playFlipSound();
    
    if (this.flippedCards.length === 2) {
      setTimeout(() => this.checkMatch(), 1000);
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.milliseconds += 10;
      if (this.milliseconds >= 100) {
        this.milliseconds = 0;
        this.timer++;
      }
    }, 100);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  checkMatch() {
    if (this.flippedCards[0].value === this.flippedCards[1].value) {
      this.flippedCards.forEach(card => card.matched = true);
      this.audioService.playBlastSound();
      if (this.cards.every(card => card.matched)) {
        this.isGameComplete = true;
        this.stopTimer();
      }
    } else {
      this.flippedCards.forEach(card => card.flipped = false);
    }
    this.flippedCards = [];
  }

  toggleSound() {
    this.audioService.toggleMute();
  }
}
