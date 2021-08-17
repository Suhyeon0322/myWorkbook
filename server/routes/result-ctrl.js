const Result = require('../models/Result');
const Answer = require('../models/Answer');

getResult = async (req, res, next)=>{
    const resultID = req.params.resultID;
    const resultInst = new Result(resultID);
    const result = await resultInst.getResult();

    if (result.status===200)
        return res.send(result.result);
    else if (result.status===204)
        return res.status(result.status).json({resultID: resultID});
    else
        next(result.err);
}

getResults = async (req, res, next)=>{
    const memberID = req.user[0].memberID;
    const resultInst = new Result(memberID);
    let results;

    if (Object.keys(req.query).length===0) {    //memberID의 테스트 결과 모두 가져오기
        results = await resultInst.getResults();
        if (results.status===500)
            next(results.err);
        else if (results.status===204)
            return res.send(results.status);
        else {
            return res.status(results.status).json({results: results.results});
        }
    } else if (req.query.finish==='true') { //종료된 시험 결과 데이터 가져오기
        results = await resultInst.getFinishedResults();
        if (results.success===false) {
            next(results.err);
        } else if (results.status===204) {
            return res.send(results.status);
        } else {
            delete results.success;
            delete results.status;
            
            return res.json(results);
        }
    } else {    //시험 종료와 상관없이 최근에 진행한 결과 목록 가져오기
        results = await resultInst.getRecentResult();
        if (results.success===false) {  //500, 내부 서버 오류
            next(results.err);
        } else if (results.status===204) {  //진행된 시험이 없을 경우.
            return res.send(results.status);
        } else {    //200
            delete results.success;
            delete results.status;
            return res.json(results);
        }
    }
}

addResult = async (req, res, next)=>{
    let newResult = req.body; //전달 받은 결과 데이터
    newResult.isFinished = req.query.isFinished;    //시험 종료 여부

    let result = {};
    let dbResult = {};
    let resultInst;
    if (newResult.isFinished==='true') {    //시험이 종료된 경우
        //result 테이블에 저장될 객체 데이터 생성.
        result.examID = newResult.examID;
        result.memberID = req.user[0].memberID;
        result.correctAnswerCnt = newResult.correctAnswerCnt;
        result.elapsedTime = newResult.elapsedTime;
        result.isFinished = 1;

        //결과 데이터를 생성하는 쿼리문 실행.
        resultInst = new Result(result);
        dbResult = await resultInst.addResult();
        if (dbResult.status===500) //내부 서버 오류
            next(dbResult.err);
        else if (dbResult.status===400)    //클라이언트 측에서 잘못된 데이터 전달.
            return res.status(dbResult.status).json(newResult);
        else   {//전달받은 resultID를 이용해 answer 테이블에 데이터 생성.
            let newAnswers = {};
            newAnswers.resultID = dbResult.resultID;
            newAnswers.questions = newResult.questions;

            const answerInst = new Answer(newAnswers);
            dbResult = await answerInst.addAnswers();

            if (dbResult.status===500) 
                next(dbResult.err);
            else if (dbResult.status===400)
                return res.status(dbResult.status).json(newResult);
            else {
                return res.status(dbResult.status).json({"resultID": newAnswers.resultID});
            }
        }
    } else {    //시험이 종료되지 않은 경우
        //result 테이블에 저장될 객체 데이터 생성.
        result.examID = newResult.examID;
        result.memberID = req.user[0].memberID;
        result.isFinished = 0;

        //결과 데이터를 생성하는 쿼리문 실행.
        resultInst = new Result(result);
        dbResult = await resultInst.addResult();

        if (dbResult.status===500) //내부 서버 오류
            next(dbResult.err);
        else if (dbResult.status===400)    //클라이언트 측에서 잘못된 데이터 전달.
            return res.status(dbResult.status).json(result);
        else    //결과데이터 추가 성공.
            return res.send(dbResult.status);
    }
}

modifyResult = async (req, res, next)=>{
    const modifyReqD = req.body;
    const resultID = req.params.resultID;

    let resultObj = {};
    if (req.query.isFinished==='true') {   //종료된 시험
        //시험테이블에서 수정할 데이터 객체 가공.
        resultObj.correctAnswerCnt = modifyReqD.correctAnswerCnt;
        resultObj.elapsedTime = modifyReqD.elapsedTime;
        resultObj.isFinished = 1;
        resultObj.resultID = resultID;
    } else {    //중단된 시험
        //시험테이블에서 수정할 데이터 객체 가공.
        resultObj.isFinished = 0;
        resultObj.resultID = resultID;
    }
    
    //DB 실행.
    const resultInst = new Result(resultObj);
    const revisedResult = await resultInst.modifyResult();
    
    if (revisedResult.status===500)
        next(revisedResult.err);
    else if (revisedResult.status===400) {
        modifyReqD['resultID'] = resultID;
        res.status(revisedResult.status).json(modifyReqD);
    } else {
        if (resultObj.isFinished===0)
            res.send(revisedResult.status);
        else {  //답안지 테이블에 데이터 추가.
            let newAnswers = {};
            newAnswers.resultID = resultID;
            newAnswers.questions = modifyReqD.questions;

            const answerInst = new Answer(newAnswers);
            dbResult = await answerInst.addAnswers();

            if (dbResult.status===500) 
                next(dbResult.err);
            else if (dbResult.status===400)
                return res.status(dbResult.status).json(modifyReqD);
            else {
                return res.status(dbResult.status).json({"resultID": newAnswers.resultID});
            }
        }
    }
}

removeResult = async (req, res, next)=>{
    const resultID = req.params.resultID;
    const resultInst = new Result(resultID);
    const result = await resultInst.removeResult();

    if (result.status===204)
        return res.send(result.status);
    else if (result.status===400)
        return res.status(result.status).json({ "resultID" : resultID });
    else
        next(result.err);
}

module.exports = {
    getResult,
    getResults, 
    addResult,
    modifyResult,
    removeResult
};