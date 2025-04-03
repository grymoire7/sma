import { describe, it, expect } from 'vitest'

// Extract the seeded random function from SubjectPage.vue for testing
const seededRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const shuffleArray = (array, seed) => {
  if (!array || !Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(seed + i) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

describe('Seeded Random Functions', () => {
  it('generates consistent random numbers for the same seed', () => {
    const seed = 123;
    const random1 = seededRandom(seed);
    const random2 = seededRandom(seed);
    
    expect(random1).toBe(random2);
  })
  
  it('generates different random numbers for different seeds', () => {
    const seed1 = 123;
    const seed2 = 456;
    const random1 = seededRandom(seed1);
    const random2 = seededRandom(seed2);
    
    expect(random1).not.toBe(random2);
  })
  
  it('shuffles an array consistently with the same seed', () => {
    const array = [1, 2, 3, 4, 5];
    const seed = 123;
    
    const shuffled1 = shuffleArray(array, seed);
    const shuffled2 = shuffleArray(array, seed);
    
    expect(shuffled1).toEqual(shuffled2);
  })
  
  it('shuffles an array differently with different seeds', () => {
    const array = [1, 2, 3, 4, 5];
    const seed1 = 123;
    const seed2 = 456;
    
    const shuffled1 = shuffleArray(array, seed1);
    const shuffled2 = shuffleArray(array, seed2);
    
    // There's a small chance this could fail randomly if the shuffles happen to be the same
    // but it's very unlikely with different seeds
    expect(shuffled1).not.toEqual(shuffled2);
  })
  
  it('handles empty arrays', () => {
    const array = [];
    const seed = 123;
    
    const shuffled = shuffleArray(array, seed);
    
    expect(shuffled).toEqual([]);
  })
  
  it('handles null or undefined arrays', () => {
    const seed = 123;
    
    const shuffled1 = shuffleArray(null, seed);
    const shuffled2 = shuffleArray(undefined, seed);
    
    expect(shuffled1).toEqual([]);
    expect(shuffled2).toEqual([]);
  })
})
