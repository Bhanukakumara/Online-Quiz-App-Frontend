export class AiRequestDto {
    constructor(
        public studentName: string,
        public questions: string[],
        public correctAnswers: string[],
        public givenAnswers: string[],
        public obtainedMarks: number,
        public totalMarks: number,
    ){}
}
