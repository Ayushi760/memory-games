import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoremIpsumService } from '../../services/lorem-ipsum.service';
import { Subscription, interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { LucideAngularModule, RotateCcw } from 'lucide-angular';

interface LevelResult {
  level: number;
  accuracy: number;
  wpm: number;
  timeLeft: string;
  score: number;
}

@Component({
  selector: 'app-typing-test',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LucideAngularModule],
  providers: [LoremIpsumService],
  templateUrl: './typing-test.component.html',
  styleUrls: ['./typing-test.component.scss']
})
export class TypingTestComponent implements OnInit, OnDestroy {
  currentText: string = '';
  userInput: string = '';
  level: number = 1;
  readonly maxLevel: number = 3;
  readonly timePerLevel: number = 180; // 3 minutes in seconds
  timer: number = this.timePerLevel;
  isGameActive: boolean = false;
  accuracy: number = 100;
  timerSubscription?: Subscription;
  wordsPerMinute: number = 0;
  levelResults: LevelResult[] = [];
  gameCompleted: boolean = false;

  RotateCcwIcon = RotateCcw;

  constructor(private loremIpsumService: LoremIpsumService) { }

  ngOnInit(): void {
    this.loadNewParagraph();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  loadNewParagraph(): void {
    this.loremIpsumService.getParagraph(this.level).subscribe(
      (paragraphs: string[]) => {
        this.currentText = paragraphs[0];
        this.userInput = '';
        this.accuracy = 100;
        this.wordsPerMinute = 0;
        this.timer = this.timePerLevel;
        this.isGameActive = false; // Reset game state
      }
    );
  }

  startGame(): void {
    if (!this.isGameActive) {  // Only start if not already active
      this.isGameActive = true;
      this.timer = this.timePerLevel;  // Reset timer
      this.startTimer();
    }
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerSubscription = interval(1000)
      .pipe(takeWhile(() => this.isGameActive && this.timer > 0))
      .subscribe(() => {
        this.timer--;
        this.calculateWPM();
        if (this.timer === 0) {
          const completion = this.calculateCompletion();
          const requiredCompletion = this.getRequiredCompletion(this.level);
          this.finishLevel(completion >= requiredCompletion);
        }
      });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  onInputChange(input: string): void {
    if (!this.isGameActive && input.length > 0) {
      this.startGame();
    }

    this.userInput = input;
    this.calculateAccuracy();
    
    // Check if user has completed typing the entire paragraph
    if (this.userInput === this.currentText) {
      this.finishLevel(true);
    }
  }

  // Prevent copy-paste
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }

  // Prevent right-click context menu
  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  private calculateAccuracy(): void {
    let correctChars = 0;
    const inputLength = Math.min(this.userInput.length, this.currentText.length);
    
    for (let i = 0; i < inputLength; i++) {
      if (this.userInput[i] === this.currentText[i]) {
        correctChars++;
      }
    }

    this.accuracy = this.userInput.length === 0 ? 100 : 
      Math.round((correctChars / this.userInput.length) * 100);
  }

  private calculateWPM(): void {
    const words = this.userInput.trim().split(/\s+/).length;
    const minutes = (this.timePerLevel - this.timer) / 60;
    this.wordsPerMinute = minutes > 0 ? Math.round(words / minutes) : 0;
  }

  getRequiredCompletion(level: number): number {
    switch (level) {
      case 1:
        return 70;  // Level 1: 70% completion required
      case 2:
        return 80;  // Level 2: 80% completion required
      case 3:
        return 100; // Level 3: 100% completion required
      default:
        return 70;
    }
  }

  calculateCompletion(): number {
    if (this.currentText.length === 0) return 0;
    
    let correctChars = 0;
    const inputLength = Math.min(this.userInput.length, this.currentText.length);
    
    for (let i = 0; i < inputLength; i++) {
      if (this.userInput[i] === this.currentText[i]) {
        correctChars++;
      }
    }

    return Math.round((correctChars / this.currentText.length) * 100);
  }

  private checkCompletion(): void {
    // When timer runs out, check if minimum completion is achieved
    if (this.timer === 0) {
      const completion = this.calculateCompletion();
      const requiredCompletion = this.getRequiredCompletion(this.level);
      this.finishLevel(completion >= requiredCompletion);
    }
  }

  private finishLevel(passedLevel: boolean): void {
    this.isGameActive = false;
    this.stopTimer();

    const completion = this.calculateCompletion();

    // Save level results
    this.levelResults.push({
      level: this.level,
      accuracy: this.accuracy,
      wpm: this.wordsPerMinute,
      timeLeft: this.formatTime(this.timer),
      score: completion
    });

    if (passedLevel && this.level < this.maxLevel) {
      // Move to next level if achieved minimum required percentage
      this.level++;
      // Reset game state for next level
      this.userInput = '';
      this.accuracy = 100;
      this.wordsPerMinute = 0;
      this.timer = this.timePerLevel;
      this.isGameActive = false;
      setTimeout(() => {
        this.loadNewParagraph();
      }, 1500);
    } else {
      // Game is completed if:
      // 1. Passed the final level (level 3)
      // 2. Failed to achieve minimum required percentage
      this.gameCompleted = passedLevel ? this.level === this.maxLevel : true;
    }
  }

  playAgain(): void {
    this.level = 1;
    this.gameCompleted = false;
    this.levelResults = [];
    this.timer = this.timePerLevel;
    this.isGameActive = false;
    this.loadNewParagraph();
  }

  getLevelScore(level: number): LevelResult | null {
    const result = this.levelResults.find(r => r.level === level);
    console.log(result);
    if (result) {
      return result;
    }
    return null;
  }

  private calculateCompletionForResult(result: LevelResult): number {
    // Return the accuracy as the completion percentage
    return result.accuracy;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
