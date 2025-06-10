import { AiRequestDto } from './ai-request-dto';

describe('AiRequestDto', () => {
  it('should create an instance', () => {
    expect(new AiRequestDto(
      'Test Student',
      ['Question 1'],
      ['Answer 1'],
      ['Given Answer 1'],
      5,
      10
    )).toBeTruthy();
  });
});
