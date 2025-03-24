import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private flipSound: HTMLAudioElement;
  private blastSound: HTMLAudioElement;
  private isMutedSubject = new BehaviorSubject<boolean>(false);
  isMuted$ = this.isMutedSubject.asObservable();

  constructor() {
    this.flipSound = new Audio('/sounds/card-flip.mp3');
    this.blastSound = new Audio('/sounds/blast-effect.mp3');
    this.flipSound.load();
    this.blastSound.load();
  }

  playFlipSound(): void {
    if (!this.isMutedSubject.value) {
      this.flipSound.currentTime = 0;
      this.flipSound.play().catch(error => console.error('Error playing flip sound:', error));
    }
  }

  playBlastSound(): void {
    if (!this.isMutedSubject.value) {
      this.blastSound.currentTime = 0;
      this.blastSound.play().catch(error => console.error('Error playing blast sound:', error));
    }
  }

  toggleMute(): void {
    this.isMutedSubject.next(!this.isMutedSubject.value);
  }

  setMuted(muted: boolean): void {
    this.isMutedSubject.next(muted);
  }
}
