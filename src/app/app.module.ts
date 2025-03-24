import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Volume2, VolumeX } from 'lucide-angular';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './components/game-board/game-board.component';
import { CardComponent } from './components/card/card.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [AppComponent, GameBoardComponent, CardComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    LucideAngularModule.pick({ Volume2, VolumeX })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
