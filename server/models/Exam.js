'use strict';

const ExamStorage = require('./ExamStorage');

class Exam {
    constructor(reqBody) {
        this.reqBody = reqBody;
    }
    //회원의 시험 목록을 받아오는 model.
    async showExamLists() {
        try {
            if (this.reqBody.memberID.indexOf('memb')===-1)
                return { success: false, status: 400, 
                    value: this.reqBody.memberID, msg: 'memberID의 형태는 memb+6자리 숫자 형태입니다.'};

            const exams = await ExamStorage.getAllExams(this.reqBody.memberID);
            return { success: true, examList: exams };
        } catch(err) {
            return { success: false, status: 500, msg: err };
        }
    }

    //examID를 통해 memberID를 조회하는 model.
    async showMemberIDByExamID() {
        try {
            const memberID = await ExamStorage.getMemberIDByExamID(this.reqBody);
            return memberID[0].memberID;
        } catch(err) {
            return 0;
        }
    }

    //examID를 통해 timeLimit을 조회.
    async getTimeLimitByExamID() {
        try {
            const examID = this.reqBody;
            const timeLimit = await ExamStorage.getTimeLimitByExamID(examID);

            return timeLimit;
        } catch(err) {
            console.log(err);
            return -1
        }
    }

    //가장 최근에 생성된 5개의 시험 폴더를 조회.
    async getRecentCreatedExams() {
        try {
            const memberID = this.reqBody;
            const exams = await ExamStorage.getRecentCretedExams(memberID);

            if(exams.length===0) {
                return { status: 204 };
            } else {
                return { status: 200, exams: exams };
            }
        } catch(err) {
            return err;
        }
    }

    //시험 폴더를 생성하는 model.
    async createExam() {
        try {
            if (this.reqBody.memberID.indexOf('memb')===-1)
                return { success: false, status: 400, 
                    value: this.reqBody.memberID, msg: 'memberID의 형태는 memb+6자리 숫자 형태입니다.'};

            //timeLimit 시간 유효성 검사
            if ('timeLimit' in this.reqBody) {
                let pattern = /^([0-9][0-9]):([0-9][0-9]):([0-9][0-9])$/;
                if (!pattern.test(this.reqBody.timeLimit)) {
                    return { success: false, status: 400, 
                        value: this.reqBody.timeLimit, msg: 'timeLimit의 형태는 HH:MM:SS입니다.'};
                }
            }

            const createResult = await ExamStorage.createExam(this.reqBody);
            return { success: createResult };
        } catch(err) {
            console.log(err)
            if (err.errno===1406) //시험명이 너무 길어서 발생한 에러(50자로 제한).
                return { success: false, status: 400, value: this.reqBody, msg: err };
            //나머지 에러는 DB 데이터 생성 중 발생한 서버 에러.
            return { success: false, status: 500, msg: err };
        }
    }
    //시험 폴더를 삭제하는 model.
    async deleteExam() {
        if (this.reqBody.examID.indexOf('exam')===-1)   //examID 유효성 검사
            return { success: false, status: 400, 
                value: this.reqBody, msg: 'examID의 형태는 exam+6자리 숫자 형태입니다.'};

        try {
            const deleteResult = await ExamStorage.deleteExam(this.reqBody.examID);
            return { success: deleteResult };
        } catch(err) {  //서버 에러
            return { success: false, status: 500, value: this.reqBody, msg: err };
        }
    }
    //시험 폴더를 수정하는 model.
    async updateExam() {
        try {
            const updateResult = await ExamStorage.updateExam(this.reqBody);
            return { success: updateResult };
        } catch(err) {
            console.log(err);
            //나머지 에러는 DB 데이터 생성 중 발생한 서버 에러.
            return { success: false, status: 500, msg: err };
        }
    }
}

module.exports = Exam;