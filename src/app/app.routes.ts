import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { SimonSaysComponent } from './components/simon-says/simon-says.component';
import { WordMemoryComponent } from './components/word-memory/word-memory.component';
import { TypingTestComponent } from './components/typing-test/typing-test.component';
import { MemoryMazeComponent } from './components/memory-maze/memory-maze.component';

export const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent 
  },
  { 
    path: 'memory', 
    component: GameBoardComponent 
  },
  { 
    path: 'simon', 
    component: SimonSaysComponent 
  },
  { 
    path: 'word-memory', 
    component: WordMemoryComponent 
  },
  { 
    path: 'typing-test', 
    component: TypingTestComponent
  },
  { 
    path: 'memory-maze', 
    component: MemoryMazeComponent
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
