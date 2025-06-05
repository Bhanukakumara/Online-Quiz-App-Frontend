export class Question {
    constructor(
        public text:string,
        public option1:string,
        public option2:string,
        public option3:string,
        public option4:string,
        public correctOption:number,
        public timeToAnswer:number,
        public marks:number,
        public examId:number,
        public teacherId:number
    ){}
}
