export class AiRequestDto {
    constructor(
        public studentName: string,
        public questions: string[],
        public correctAnswer: string[],
        public givenAnswer: string[],
        public obtainedMarks: number,
        public totalMarks: number,
    ){}
}
