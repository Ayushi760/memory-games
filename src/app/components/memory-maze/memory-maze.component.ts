import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, RotateCcw } from 'lucide-angular';

@Component({
    selector: 'app-memory-maze',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './memory-maze.component.html',
    styleUrls: ['./memory-maze.component.scss']
})
export class MemoryMazeComponent implements OnInit {
    readonly RotateCcwIcon = RotateCcw;
    gridSize = 5; // Initial Grid Size for Level 1
    grid: boolean[][] = [];
    path: { row: number, col: number }[] = [];
    userPath: { row: number, col: number }[] = [];
    showPath = false; // Initially false, waits for "Start" button click
    timer = 20;
    gameStarted = false;
    gameEnded = false;
    win = false;
    level = 1;
    showResult = false;
    intervalId: any;
    milliseconds: number = 0;
    showPopup = true

    ngOnInit() {
        this.resetGame(); // Initialize the game but wait for start button
    }

    closePopup(){
        this.showPopup = false
    }

    formatTime(): string {
        const hours = Math.floor(this.timer / 3600);
        const minutes = Math.floor((this.timer % 3600) / 60);
        const seconds = this.timer % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    formatMilliseconds(): string {
        return Math.floor(this.milliseconds / 10).toString().padStart(2, '0');
    }

    resetGame() {
        this.gridSize = this.level === 1 ? 5 : this.level === 2 ? 6 : 7;
        this.timer = this.level === 1 ? 20 : 30;
        this.showResult = false;
        this.gameStarted = false;
        this.gameEnded = false;
        this.win = false;
        this.userPath = [];
        this.path = [];
        this.showPath = false; // Wait for the Start button
        this.generateMaze(); // Prepare a new maze
    }

    startPathPhase() {
        this.showPath = true; // Show the path to the user

        setTimeout(() => {
            this.showPath = false; // Hide the path after 5 seconds
            this.startUserPhase(); // Start the game after path recognition
        }, 5000);
    }

    generateMaze() {
        this.grid = Array.from({ length: this.gridSize }, () =>
            Array(this.gridSize).fill(false)
        );

        this.path = [];
        let row = 0, col = 0;
        this.path.push({ row, col });
        this.grid[row][col] = true;

        while (row < this.gridSize - 1 || col < this.gridSize - 1) {
            const moves = [];
            if (row < this.gridSize - 1) moves.push({ row: row + 1, col }); // Down
            if (col < this.gridSize - 1) moves.push({ row, col: col + 1 }); // Right

            const nextMove = moves[Math.floor(Math.random() * moves.length)];
            row = nextMove.row;
            col = nextMove.col;
            this.path.push({ row, col });
            this.grid[row][col] = true;
        }
    }

    startUserPhase() {
        this.userPath = [];
        this.gameStarted = true;
        this.gameEnded = false;
        this.showResult = false;
    
        this.timer = this.level === 1 ? 20 : 30; // Set level-based timer
        this.milliseconds = 0;
    
        clearInterval(this.intervalId);
        this.intervalId = setInterval(() => {
            if (this.milliseconds > 0) {
                this.milliseconds -= 10;
            } else if (this.timer > 0) {
                this.milliseconds = 990;
                this.timer--;
            } else {
                clearInterval(this.intervalId);
                this.validatePath();
            }
        }, 10); // Update every 10ms for smooth countdown
    }
    

    selectCell(row: number, col: number) {
        if (!this.gameStarted || this.gameEnded) return;

        const index = this.userPath.findIndex(cell => cell.row === row && cell.col === col);

        if (index !== -1) {
            // If the cell is already selected, remove it (deselect on double click)
            this.userPath.splice(index, 1);
        } else {
            // If the cell is not selected, add it
            this.userPath.push({ row, col });
        }
    }


    validatePath() {
        this.gameEnded = true;
        this.showResult = true;
    
        this.win = this.userPath.length === this.path.length &&
            this.userPath.every((cell, index) =>
                cell.row === this.path[index].row && cell.col === this.path[index].col
            );
    
        if (this.win) {
            if (this.level < 3) {
                this.level++;
                setTimeout(() => this.resetGame(), 2000);
            }
        } else {
            console.log("Player lost. Restarting from Level 1...");
            
            // Pause for 5 seconds before restarting
            setTimeout(() => {
                this.playAgain();
            }, 5000);
        }
    }
    

    playAgain() {
        clearInterval(this.intervalId); // Stop any running timers

        this.level = 1;
        this.gridSize = 5;
        this.timer = 20;
        this.showResult = false;
        this.showPath = false;
        this.gameStarted = false;
        this.gameEnded = false;
        this.win = false;
        this.userPath = [];
        this.path = [];

        this.resetGame();
    }

    isSelected(row: number, col: number): boolean {
        return this.userPath.some(c => c.row === row && c.col === col);
    }

    isCorrect(row: number, col: number): boolean {
        return this.path.some(c => c.row === row && c.col === col);
    }

    isIncorrect(row: number, col: number): boolean {
        return this.isSelected(row, col) && !this.isCorrect(row, col);
    }
}
