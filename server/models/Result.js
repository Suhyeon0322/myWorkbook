'use strict';

const ResultStorage = require('./ResultStorage');

class Result {
    constructor(resultInfo) {
        this.resultInfo = resultInfo;
    }

    //한 개의 시험 결과 데이터 조회하기
    async getResult() {
        const resultID = this.resultInfo;

        try {
            const result = await ResultStorage.getResult(resultID);
            if (result===0)
                return { status: 204 };
            else 
                return { status: 200, result: result };
        } catch (err) {
            return { status: 500, err: err };
        }
    }

    //사용자의 모든 시험 결과 데이터 조회하기
    async getResults() {
        const memberID = this.resultInfo;

        try {
            const results = await ResultStorage.getResults(memberID);
            if (results===0)
                return { status: 204 };
            else 
                return { status: 200, results: results };
        } catch(err) {
            return { status: 500, err: err };
        }
    }
    
    //가장 최근에 진행한 시험 결과 데이터 조회하기
    async getRecentResult() {
        const memberID = this.resultInfo;
        
        try {
            const result = await ResultStorage.getRecentResult(memberID);
            if (result===-1) {
                return {
                    success: true,
                    status: 204
                }
            } else if (result.isFinished===1) {
                return { 
                    success: true, 
                    status: 200, 
                    isFinished: result.isFinished,
                    result: {
                        resultID: result.resultID, 
                        examID: result.examID,
                        examName: result.examName,
                        elapsedTime: result.elapsedTime                       
                    }
                };
            } else {
                return { 
                    success: true, 
                    status: 200,
                    isFinished: result.isFinished, 
                    result: {
                        resultID: result.resultID, 
                        examID: result.examID,
                        examName: result.examName,
                        elapsedTime: result.elapsedTime,
                        lastSolvedQ: result.lastSolvedQ
                    }
                };
            }
        } catch(err) {
            return { success: false, err: err };
        }
    }

    //최근에 시험을 종료한 결과 데이터(3가지) 조회하기
    async getFinishedResults() {
        const memberID = this.resultInfo;

        try {
            const results = await ResultStorage.getFinishedResults(memberID);
            if (results===-1) {
                return { success: true, status: 204 };
            } else {
                return { success: true, status: 200, results: results };
            }
        } catch(err) {
            return { success: false, err: err };
        }
    }

    //시험 결과 데이터 생성하기
    async addResult() {
        const newResultObj = this.resultInfo;

        try {
            const examID = await ResultStorage.addResult(newResultObj);
            if (examID===-1)
                return { status: 400 };
            else {
                const resultID = await ResultStorage.getLastCreatedResultID(examID);
                return { status: 201, resultID: resultID };
            }
        } catch(err) {
            return { status: 500, err: err };
        }
    }
  
    //resultID를 가지고 examID 조회하기
    async getExamIDByResultID() {
        const resultID = this.resultInfo;
        try {
            const examID = await ResultStorage.getExamIDByResultID(resultID);
            if (examID===-1) {
                return { status: 400 };
            } else {
                return { status: 200, examID: examID };
            }
        } catch(err) {
            return { status: 500, err: err };
        }
    }

    //시험 결과 데이터를 수정
    async modifyResult() {
        const modifiedData = this.resultInfo;

        try {
            const result = await ResultStorage.modifyResult(modifiedData);
            if (result===0)
                return { status: 400 };
            else
                return { status: 201 };
        } catch(err) {
            return { status: 500, err: err };
        }
    }

    async removeResult() {
        const resultID = this.resultInfo;

        try {
            const result = await ResultStorage.removeResult(resultID);
            if (result===0) 
                return { status: 400 };
            else
                return { status: 204 };
        } catch(err) {
            return { status: 500, err: err };
        }
    }
}

module.exports = Result;