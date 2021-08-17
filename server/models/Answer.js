'use strict';

const AnswerStorage = require('./AnswerStorage');

class Answer {
    constructor(reqData) {
        this.reqData = reqData;
    }

    async addAnswers() {
        const resultID = this.reqData.resultID;
        let questions = this.reqData.questions;
        let questionsArr = [];

        //sql문에 parameter로 전달할 수 있도록 데이터 가공.
        for (let question of questions) {
            if (question.isCorrect==='true')
                question.isCorrect = 1;
            else 
                question.isCorrect = 0;
            question.resultID = resultID;
            questionsArr.push(Object.values(question));
        }

        try {
            const result = await AnswerStorage.addAnswer(questionsArr);
            if (result===0) {
                return { status: 400 };
            } else {
                return { status: 201 };
            }
        } catch(err) {
            return { status: 500, err: err };
        }
    }

    //답안 상세 정보 데이터 조회(문제번호, 문제 이미지, 입력답, 정답, 해설 이미지)
    async getAnswerDetails() {
        const resultID = this.reqData;
        
        try {
            const answerDetails = await AnswerStorage.getAnswerDetails(resultID);

            if (answerDetails===0)
                return { status: 204 };
            else
                return { status: 200, details: answerDetails }; 
        } catch(err) {
            return { status: 500, err: err };
        }
    }

    async getAnswer() {
        const resultID = this.reqData.resultID;
        const questionID = this.reqData.questionID;

        try {
            const answer = await AnswerStorage.getAnswer(resultID, questionID);
            if (answer===-1) {
                return { status: 204 };
            } else {
                return { status: 200, answer: answer };
            }
        } catch(err) {
            return { status: 500, err: err };
        }
    }
}

module.exports = Answer;