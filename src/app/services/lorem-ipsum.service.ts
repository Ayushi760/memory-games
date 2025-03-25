import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoremIpsumService {
  private baseUrl = 'https://baconipsum.com/api/';

  constructor(private http: HttpClient) { }

  getParagraph(level: number): Observable<string[]> {
    // Adjust paragraph length based on level
    let sentences: number;
    switch (level) {
      case 1:
        sentences = 5;  // Level 1: shorter paragraph
        break;
      case 2:
        sentences = 8;  // Level 2: medium paragraph
        break;
      case 3:
        sentences = 12; // Level 3: longer paragraph
        break;
      default:
        sentences = 5;  // Default to level 1
    }
    return this.http.get<string[]>(`${this.baseUrl}?type=all-meat&sentences=${sentences}&format=json`);
  }
}
