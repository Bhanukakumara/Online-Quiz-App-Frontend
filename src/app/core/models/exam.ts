export class Exam {
    constructor(
        public title: string,
        public description: string,
        public questionCount: number,
        public maxAttempts: number,
        public totalTimeMinutes: number,
        public courseId: number,
        public teacherId: number
    ){}
}
