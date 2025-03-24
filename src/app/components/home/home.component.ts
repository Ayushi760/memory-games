import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <h1>Memory Games</h1>
      <div class="game-options">
        <a routerLink="/memory" class="game-button">Memory Card Game</a>
        <a routerLink="/simon" class="game-button">Simon Says Game</a>
        <a routerLink="/word-memory" class="game-button">Word Memory Game</a>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #f0f2f5;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
      font-size: 2.5rem;
    }

    .game-options {
      display: flex;
      gap: 2rem;
    }

    .game-button {
      padding: 1rem 2rem;
      font-size: 1.2rem;
      color: white;
      background: #4a90e2;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: transform 0.2s, background 0.2s;

      &:hover {
        background: #357abd;
        transform: translateY(-2px);
      }
    }
  `]
})
export class HomeComponent {}
