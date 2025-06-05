export class Paper {
    constructor(
        public startTime: Date,
        public endTime: Date,
        public obtainedMarks: number,
        public studentId: number,
        public examId: number,
        public enrollmentId: number
    ){}
}
