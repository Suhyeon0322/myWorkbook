'use strict';

const QuestionStorage = require('./QuestionStorage');

class Question {
    constructor(questionInfo) {
        this.questionInfo = questionInfo;
    }

    //Insert new question
    async createQuestion() {
        try {
            if (this.questionInfo.imgPath.length===1) {
                this.questionInfo.questionIMG = this.questionInfo.imgPath.questionIMG;
            } else {
                this.questionInfo.questionIMG = this.questionInfo.imgPath.questionIMG;
                this.questionInfo.solutionIMG = this.questionInfo.imgPath.solutionIMG;
            }
            delete this.questionInfo.imgPath;

            let questionID = await QuestionStorage.createQuestion(this.questionInfo);
            questionID = questionID.lastNo;
            questionID = new Array(6-String(questionID).length+1).join('0')+questionID;

            return { status: 201, questionID: 'ques' + questionID };
        } catch(err) {
            console.log(err);
            return { status: 500 };
        }
    }

    //SELECT questions
    async getQuestions() {
        try {
            const questions = await QuestionStorage.getQuestions(this.questionInfo);
            if (questions.length>0) {
                return { status: 200, questions: questions };
            } else {
                return { status: 204, questions: questions };
            }
            
        } catch(err) {
            console.log(err);
            return { status: 500, examID: this.questionInfo };
        }
    }
    //SELECT question
    async getQuestion() {
        try {
            const questionID = this.questionInfo;
            const question = await QuestionStorage.getQuestion(questionID);
            return { status: 200, question: question };
        } catch(err) {
            console.log(err);
            return { status: 500, req: this.questionInfo.questionID };
        }
    }
    //SELECT questionIMG, solutionIMG using questionID
    async getIMGPaths() {
        try {
            const questionID = this.questionInfo;
            const imgPaths = await QuestionStorage.getIMGPaths(questionID);
            
            return imgPaths;
        } catch(err) {
            return 0;
        }
    }
    //SELECT questionIMG
    async getQuestionPath() {
        try {
            const questionID = this.questionInfo;
            const questionIMG = await QuestionStorage.getQuestionPath(questionID);
            
            return questionIMG;
        } catch(err) {
            return 0;
        }
    }
    //SELECT solutionIMG
    async getSolutionPath() {
        try {
            const questionID = this.questionInfo;
            const solutionIMG = await QuestionStorage.getSolutionPath(questionID);
            
            return solutionIMG;
        } catch(err) {
            return 0;
        }
    }
    //SELECT memberID by questionID
    async getMemberIDByQuestionID() {
        try {
            const memberID = await QuestionStorage.getMemberIDByQuestionID(this.questionInfo);
            return memberID[0].memberID;
        } catch(err) {
            return 0;
        }
    }
    //SELECT questionID by examID
    // async getQuestionID() {
    //     const examID = this.questionInfo;
    //     try {
    //         const questionID = await QuestionStorage.getQuestionID(examID);
    //         if (questionID===-1) 
    //             return { status: 204 };
    //         else 
    //             return { status: 200, questionID: questionID };
    //     } catch(err) {
    //         return { status: 500, err: err };
    //     }
    // }
    //SELECT examID using questionID
    async getExamIDByQuestionID() {
        const questionID = this.questionInfo;
        try {
            const examID = await QuestionStorage.getExamIDByQuestionID(questionID);
            if (examID===-1) 
                return { status: 400 };
            else 
                return { status: 200, examID: examID };
        } catch(err) {
            return { status: 500, err: err.stack };
        }
    }

    //UPDATE question
    async modifyQuestion() {
        try {
            const updatedData = this.questionInfo;
            const prevImgPaths = await QuestionStorage.modifyQuestion(updatedData);

            return { status: 201, prevImgPaths: prevImgPaths };
        } catch(err) {
            return { status: 500, err: err};
        }
    }

    //DELETE question
    async removeQeustion() {
        const questionID = this.questionInfo;
        try {
            const imgPaths = await QuestionStorage.getIMGPaths(questionID);
            await QuestionStorage.removeQuestion(questionID);

            return { status: 204, deletedImgs: imgPaths };
        } catch(err) {
            console.log(err);
            return { status: 500 };
        }
    }
}

module.exports = Question;