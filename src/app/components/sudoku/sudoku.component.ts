import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-sudoku',
  imports: [CommonModule],
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
  board: number[][] = [];
  userBoard: (number | null)[][] = [];
  solution: number[][] = [];
  gameWon: boolean = false;
  gameEnded: boolean = false;
  timer: number = 0; // Stores time in seconds
  milliseconds: number = 0; // Stores milliseconds
  timerInterval: any = null; // Stores the interval reference
  timerRunning: boolean = false; // To track if the timer is active

  ngOnInit(): void {
    this.generateBoard();
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

  startTimer(): void {
    if (!this.timerRunning) {
      this.timerRunning = true;
      this.timerInterval = setInterval(() => {
        this.milliseconds++;
        if (this.milliseconds === 100) {
          this.milliseconds = 0;
          this.timer++;
        }
      }, 10); // Update every 10 milliseconds
    }
  }

  stopTimer(): void {
    clearInterval(this.timerInterval);
    this.timerRunning = false;
  }

  resetTimer(): void {
    clearInterval(this.timerInterval);
    this.timer = 0;
    this.milliseconds = 0;
    this.timerRunning = false;
  }

  generateBoard(): void {
    this.solution = this.generateSolvedBoard();
    this.board = this.removeNumbers(this.solution);
    this.userBoard = this.board.map(row => row.map(cell => (cell !== 0 ? cell : null)));
    this.gameWon = false;
    this.gameEnded = false;
    this.resetTimer(); // Reset timer when a new game starts
  }

  generateSolvedBoard(): number[][] {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    this.solveSudoku(board);
    return board;
  }

  solveSudoku(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (this.isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              if (this.solveSudoku(board)) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isValidPlacement(board: number[][], row: number, col: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num || board[i][col] === num) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  removeNumbers(board: number[][]): number[][] {
    let puzzle = board.map(row => [...row]);
    let attempts = 30;
    while (attempts > 0) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== 0) {
        puzzle[row][col] = 0;
        attempts--;
      }
    }
    return puzzle;
  }

  isEditable(row: number, col: number): boolean {
    return this.board[row][col] === 0;
  }

  updateBoard(event: any, row: number, col: number): void {
    if (!this.timerRunning) {
      this.startTimer(); // Start timer on first user input
    }

    const value = Number(event.target.value);
    if (value >= 1 && value <= 9) {
      this.userBoard[row][col] = value;
    } else if (event.target.value === '') {
      this.userBoard[row][col] = null;
    } else {
      event.target.value = '';
    }
  }

  showSolution(): void {
    this.userBoard = this.solution.map(row => [...row]);
    this.stopTimer(); // Stop timer when showing the solution
  }

  checkCompletion(): void {
    this.stopTimer(); // Stop the timer when checking completion
    this.gameEnded = true;

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (this.userBoard[row][col] !== this.solution[row][col]) {
          return;
        }
      }
    }
    this.gameWon = true;
    this.launchConfetti();
  }

  launchConfetti(): void {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      confetti({
        particleCount: 150,
        spread: 120,
        origin: { y: 0.6 }
      });
    }, 500);

    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 150,
        origin: { y: 0.6 }
      });
    }, 1000);
  }
}
