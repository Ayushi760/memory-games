import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { SimonSaysComponent } from './components/simon-says/simon-says.component';
import { WordMemoryComponent } from './components/word-memory/word-memory.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'memory', component: GameBoardComponent },
  { path: 'simon', component: SimonSaysComponent },
  { path: 'word-memory', component: WordMemoryComponent },
  { path: '**', redirectTo: '' }
];
