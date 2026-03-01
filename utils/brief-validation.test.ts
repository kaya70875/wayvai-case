import { describe, it, expect } from 'vitest';
import { validateAIResponse } from './brief-validation';

describe('AI Brief Validation Logic', () => {
  it('should successfully validate a perfect AI JSON response', () => {
    const validJson = JSON.stringify({
      outreachMessage: "Hey! Let's work together on this cool campaign.",
      contentIdeas: ["Idea 1", "Idea 2", "Idea 3", "Idea 4", "Idea 5"],
      hooks: ["Hook 1", "Hook 2", "Hook 3"]
    });

    const result = validateAIResponse(validJson);
    expect(result.contentIdeas).toHaveLength(5);
    expect(result.hooks).toHaveLength(3);
  });

  it('should throw an error if contentIdeas has less than 5 items', () => {
    const invalidJson = JSON.stringify({
      outreachMessage: "Too short message",
      contentIdeas: ["Only 1 idea"],
      hooks: ["Hook 1", "Hook 2", "Hook 3"]
    });

    expect(() => validateAIResponse(invalidJson)).toThrow();
  });

  it('should throw an error if the string is not a valid JSON', () => {
    const brokenJson = "This is not JSON at all!";
    expect(() => validateAIResponse(brokenJson)).toThrow();
  });
});