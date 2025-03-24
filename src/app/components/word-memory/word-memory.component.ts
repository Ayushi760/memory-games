import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DictionaryService } from '../../services/dictionary.service';

@Component({
  selector: 'app-word-memory',
  templateUrl: './word-memory.component.html',
  styleUrls: ['./word-memory.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class WordMemoryComponent implements OnInit {
  constructor(private dictionaryService: DictionaryService) {}

  // Game states
  gamePhase: 'setup' | 'memorize' | 'select' | 'complete' = 'setup';
  level: number = 1;
  score: number = 0;
  timer: number = 0;
  milliseconds: number = 0;
  interval: any;
  startTime: number = 0;
  memorizeTime: number = 10; // 10 seconds for memorization

  // Word lists
  wordsToMemorize: string[] = [];
  displayWords: string[] = [];
  selectedWords: string[] = [];
  correctWords: string[] = [];

  // Game settings
  minWords: number = 3;
  maxWords: number = 8;
  selectedWordCount: number = this.minWords;
  displayWordCount: number = 20; // Total words to show in selection phase

  ngOnInit() {}

  startGame() {
    this.level = 1;
    this.score = 0;
    this.selectedWordCount = this.minWords;
    this.startLevel();
  }

  startLevel() {
    // Reset game state
    this.wordsToMemorize = [];
    this.displayWords = [];
    this.selectedWords = [];
    this.correctWords = [];

    // Get random words for memorization
    const allWords = this.dictionaryService.getGridWords(5);
    this.shuffle(allWords);

    // Select words to memorize
    this.wordsToMemorize = allWords.slice(0, this.selectedWordCount);

    // Create display set with memorization words and additional random words
    const allPossibleWords = this.dictionaryService.getAllWords();
    this.shuffle(allPossibleWords);
    
    // Add memorization words first
    this.displayWords = [...this.wordsToMemorize];
    
    // Add random words from the full dictionary until we reach displayWordCount
    const additionalWords = allPossibleWords
      .filter(word => !this.wordsToMemorize.includes(word))
      .slice(0, this.displayWordCount - this.wordsToMemorize.length);
    this.displayWords.push(...additionalWords);
    
    // Shuffle the final display set
    this.shuffle(this.displayWords);

    // Start memorization phase
    this.gamePhase = 'memorize';
    this.timer = 0;
    this.milliseconds = 0;
    this.startTime = Date.now();
    this.startTimer();
  }

  private startTimer() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {
      const elapsed = Date.now() - this.startTime;
      this.timer = Math.floor(elapsed / 1000);
      this.milliseconds = Math.floor((elapsed % 1000) / 10);

      if (this.gamePhase === 'memorize' && this.timer >= this.memorizeTime) {
        clearInterval(this.interval);
        this.startSelectionPhase();
      }
    }, 100);
  }

  private startSelectionPhase() {
    this.gamePhase = 'select';
    this.selectedWords = [];
    // Reset timer for selection phase
    this.timer = 0;
    this.milliseconds = 0;
    this.startTime = Date.now();
    this.startTimer();
  }

  toggleWordSelection(word: string) {
    if (this.gamePhase !== 'select') return;

    const index = this.selectedWords.indexOf(word);
    if (index === -1) {
      if (this.selectedWords.length < this.selectedWordCount) {
        this.selectedWords.push(word);
      }
    } else {
      this.selectedWords.splice(index, 1);
    }
  }

  submitSelections() {
    // Check if all selected words were in the memorization set
    this.correctWords = this.selectedWords.filter(word => 
      this.wordsToMemorize.includes(word)
    );

    const allCorrect = this.correctWords.length === this.selectedWordCount &&
                      this.selectedWords.length === this.selectedWordCount;

    if (allCorrect) {
      // Level completed successfully
      this.score += this.selectedWordCount * 10;
      this.level++;
      this.selectedWordCount = Math.min(this.maxWords, this.selectedWordCount + 1);
      setTimeout(() => this.startLevel(), 2000);
    } else {
      // Game over
      this.gamePhase = 'complete';
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  }

  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
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

  resetGame() {
    this.gamePhase = 'setup';
    this.level = 1;
    this.score = 0;
    this.selectedWordCount = this.minWords;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
