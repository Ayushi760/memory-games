import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private readonly wordsByLength: { [key: number]: string[] } = {
    3: [
      'CAT', 'DOG', 'RAT', 'BAT', 'HAT', 'MAT', 'SAT', 'FAT',
      'RUN', 'SUN', 'FUN', 'BUN', 'GUN', 'CUT', 'PUT', 'NUT',
      'PET', 'SET', 'WET', 'NET', 'JET', 'GET', 'LET', 'BET',
      'MAP', 'LAP', 'NAP', 'TAP', 'CAP', 'GAP', 'SAP', 'ZIP',
      'BOX', 'FOX', 'WAX', 'MIX', 'FIX', 'SIX', 'PIX', 'NIX',
      'BAG', 'LAG', 'RAG', 'WAG', 'TAG', 'SAG', 'JAG', 'NAG'
    ],
    4: [
      'PLAY', 'STAY', 'GRAY', 'PRAY', 'SLAY', 'CLAY', 'TRAY',
      'STAR', 'SCAR', 'SPAR', 'SPAT', 'SPAN', 'SPAM', 'SPAY',
      'BEAR', 'FEAR', 'TEAR', 'WEAR', 'YEAR', 'DEAR', 'NEAR',
      'JUMP', 'BUMP', 'DUMP', 'LUMP', 'PUMP', 'HUMP', 'LAMP',
      'FISH', 'DISH', 'WISH', 'RUSH', 'PUSH', 'BUSH', 'LUSH',
      'BOOK', 'LOOK', 'TOOK', 'HOOK', 'COOK', 'ROOK', 'NOOK',
      'HAND', 'BAND', 'LAND', 'SAND', 'WAND', 'POND', 'BOND',
      'MIND', 'KIND', 'FIND', 'BIND', 'WIND', 'RIND', 'HIND'
    ],
    5: [
      'BREAD', 'DREAM', 'CREAM', 'STEAM', 'HEART', 'SMART',
      'START', 'CHART', 'SPARE', 'STARE', 'SHARE', 'SHARK',
      'BRAIN', 'TRAIN', 'GRAIN', 'CHAIN', 'PAINT', 'FAINT',
      'HOUSE', 'MOUSE', 'BLOUSE', 'GROUSE', 'PAUSE', 'CAUSE',
      'LIGHT', 'NIGHT', 'SIGHT', 'FIGHT', 'RIGHT', 'MIGHT',
      'DANCE', 'LANCE', 'PRANCE', 'TRANCE', 'CHANCE', 'GLANCE',
      'SMILE', 'WHILE', 'STYLE', 'STILE', 'SLIDE', 'GLIDE',
      'BEACH', 'REACH', 'TEACH', 'PEACH', 'LEACH', 'BLEACH',
      'CLOUD', 'PROUD', 'CROWD', 'SOUND', 'ROUND', 'BOUND',
      'SWEET', 'FLEET', 'GREET', 'SHEET', 'SLEET', 'STREET'
    ]
  };

  constructor() {}

  getGridWords(maxLength: number = 5): string[] {
    const words: string[] = [];
    
    // Get some 5-letter words
    const fiveLetterWords = [...this.wordsByLength[5]];
    this.shuffle(fiveLetterWords);
    words.push(...fiveLetterWords.slice(0, 2));

    // Get some 4-letter words
    const fourLetterWords = [...this.wordsByLength[4]];
    this.shuffle(fourLetterWords);
    words.push(...fourLetterWords.slice(0, 2));

    // Get some 3-letter words
    const threeLetterWords = [...this.wordsByLength[3]];
    this.shuffle(threeLetterWords);
    words.push(...threeLetterWords.slice(0, 2));

    return words;
  }

  getAllWords(): string[] {
    return [
      ...this.wordsByLength[3],
      ...this.wordsByLength[4],
      ...this.wordsByLength[5]
    ];
  }

  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
