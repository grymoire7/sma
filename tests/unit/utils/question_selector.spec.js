import { describe, it, expect } from 'vitest';
import { QuestionSelector, getDayOfYear, getCategoriesForDay, getQuestionIndicesForDayOfYear } from '../../../src/utils/question_selector.js';

describe('QuestionSelector Utils', () => {
  describe('getDayOfYear', () => {
    it('should return correct day of year for Jan 1, 2023', () => {
      expect(getDayOfYear(new Date(2023, 0, 1))).toBe(1);
    });

    it('should return correct day of year for Dec 31, 2023', () => {
      expect(getDayOfYear(new Date(2023, 11, 31))).toBe(365);
    });

    it('should return correct day of year for Jun 15, 2023', () => {
      expect(getDayOfYear(new Date(2023, 5, 15))).toBe(165);
    });

    it('should return correct day of year for Oct 1, 2023', () => {
      expect(getDayOfYear(new Date(2023, 9, 1))).toBe(273);
    });
  });

  describe('getCategoriesForDay', () => {
    it('should return correct categories for day 1 with 3 categories', () => {
      expect(getCategoriesForDay(1, 3)).toEqual([0, 1, 2, 0]);
    });

    it('should return correct categories for day 2 with 3 categories', () => {
      expect(getCategoriesForDay(2, 3)).toEqual([1, 2, 0, 1]);
    });

    it('should return correct categories for day 3 with 3 categories', () => {
      expect(getCategoriesForDay(3, 3)).toEqual([2, 0, 1, 2]);
    });

    it('should return correct categories for day 4 with 3 categories', () => {
      expect(getCategoriesForDay(4, 3)).toEqual([0, 1, 2, 0]);
    });

    it('should return correct categories for day 365 with 3 categories', () => {
      expect(getCategoriesForDay(365, 3)).toEqual([1, 2, 0, 1]);
    });

    it('should return correct categories for day 1 with 5 categories', () => {
      expect(getCategoriesForDay(1, 5)).toEqual([0, 1, 2, 3]);
    });

    it('should return correct categories for day 2 with 5 categories', () => {
      expect(getCategoriesForDay(2, 5)).toEqual([4, 0, 1, 2]);
    });

    it('should return correct categories for day 3 with 5 categories', () => {
      expect(getCategoriesForDay(3, 5)).toEqual([3, 4, 0, 1]);
    });

    it('should return correct categories for day 4 with 5 categories', () => {
      expect(getCategoriesForDay(4, 5)).toEqual([2, 3, 4, 0]);
    });

    it('should return correct categories for day 5 with 5 categories', () => {
      expect(getCategoriesForDay(5, 5)).toEqual([1, 2, 3, 4]);
    });

    it('should return correct categories for day 365 with 5 categories', () => {
      expect(getCategoriesForDay(365, 5)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('getQuestionIndicesForDayOfYear', () => {
    const categories = [0, 1, 2, 3];
    const categoryCount = 5;
    const questionCounts = [10, 15, 20, 25, 8];

    it('should return correct question indices for day 1', () => {
      expect(getQuestionIndicesForDayOfYear(1, categories, categoryCount, questionCounts)).toEqual([0, 0, 0, 0]);
    });

    it('should return correct question indices for day 2', () => {
      expect(getQuestionIndicesForDayOfYear(2, categories, categoryCount, questionCounts)).toEqual([0, 1, 1, 1]);
    });

    it('should return correct question indices for day 3', () => {
      expect(getQuestionIndicesForDayOfYear(3, categories, categoryCount, questionCounts)).toEqual([1, 1, 2, 2]);
    });

    it('should return correct question indices for day 4', () => {
      expect(getQuestionIndicesForDayOfYear(4, categories, categoryCount, questionCounts)).toEqual([2, 2, 2, 3]);
    });

    it('should return correct question indices for day 5', () => {
      expect(getQuestionIndicesForDayOfYear(5, categories, categoryCount, questionCounts)).toEqual([3, 3, 3, 3]);
    });

    it('should return correct question indices for day 10', () => {
      expect(getQuestionIndicesForDayOfYear(10, categories, categoryCount, questionCounts)).toEqual([7, 7, 7, 7]);
    });

    it('should return correct question indices for day 15', () => {
      expect(getQuestionIndicesForDayOfYear(15, categories, categoryCount, questionCounts)).toEqual([1, 11, 11, 11]);
    });

    it('should return correct question indices for day 20', () => {
      expect(getQuestionIndicesForDayOfYear(20, categories, categoryCount, questionCounts)).toEqual([5, 0, 15, 15]);
    });

    it('should return correct question indices for day 25', () => {
      expect(getQuestionIndicesForDayOfYear(25, categories, categoryCount, questionCounts)).toEqual([9, 4, 19, 19]);
    });

    it('should return correct question indices for day 365', () => {
      expect(getQuestionIndicesForDayOfYear(365, categories, categoryCount, questionCounts)).toEqual([1, 6, 11, 16]);
    });
  });

  describe('QuestionSelector class', () => {
    describe('getQuestionDataForDate', () => {
      const categoryCount = 5;
      const questionCounts = [10, 15, 20, 25, 8];
      const selector = new QuestionSelector(categoryCount, questionCounts);

      it('should return correct question data for Jan 1, 2023', () => {
        const date = new Date(2023, 0, 1);
        const result = selector.getQuestionDataForDate(date);
        expect(result).toEqual({
          dayOfYear: 1,
          categoryIndices: [0, 1, 2, 3],
          questionIndices: [0, 0, 0, 0]
        });
      });

      it('should return correct question data for Jan 2, 2023', () => {
        const date = new Date(2023, 0, 2);
        const result = selector.getQuestionDataForDate(date);
        expect(result).toEqual({
          dayOfYear: 2,
          categoryIndices: [4, 0, 1, 2],
          questionIndices: [0, 1, 1, 1]
        });
      });

      it('should return correct question data for Jan 3, 2023', () => {
        const date = new Date(2023, 0, 3);
        const result = selector.getQuestionDataForDate(date);
        expect(result).toEqual({
          dayOfYear: 3,
          categoryIndices: [3, 4, 0, 1],
          questionIndices: [1, 1, 2, 2]
        });
      });

      it('should return correct question data for Jan 15, 2023', () => {
        const date = new Date(2023, 0, 15);
        const result = selector.getQuestionDataForDate(date);
        expect(result).toEqual({
          dayOfYear: 15,
          categoryIndices: [1, 2, 3, 4],
          questionIndices: [11, 11, 11, 3]
        });
      });

      it('should return correct question data for Dec 31, 2023', () => {
        const date = new Date(2023, 11, 31);
        const result = selector.getQuestionDataForDate(date);
        expect(result).toEqual({
          dayOfYear: 365,
          categoryIndices: [1, 2, 3, 4],
          questionIndices: [6, 11, 16, 3]
        });
      });
    });
  });

});

