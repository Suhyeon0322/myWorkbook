const Answer = require('../models/Answer');
const Result = require('../models/Result');
const Question = require('../models/Question');

//답안 상세 정보 데이터 조회(문제번호, 문제 이미지, 입력답, 정답, 해설 이미지)
showAnswerDetails = async (req, res, next)=>{
    const resultID = req.params.resultID;
    const answerInst = new Answer(resultID);
    const answerDetails = await answerInst.getAnswerDetails();

    if (answerDetails.status===500)
        next(answerDetails.err);
    else if (answerDetails.status===204)
        return res.send(answerDetails.status);
    else
        return res.status(answerDetails.status).json(answerDetails.details);
}

showAnswer = async (req, res, next)=>{
    let reqData = {};
    reqData.resultID = req.params.resultID;
    reqData.questionID = req.params.questionID;

    //전달받은 resultID와 questionID가 동일한 examID를 가지는지 확인하는 함수 호출.
    const status = await isSameExamID(reqData, next);
    if (status===400) { //examID가 같이 않으면 400 ERROR
        return res.status(status).json(reqData);
    }

    //답안지 테이블에서 데이터 조회
    const answerInst = new Answer(reqData);
    const obj = await answerInst.getAnswer();

    if (obj.status===500) {
        next(obj.err);
    } else if (obj.status===204) {  //맨 처음 푸는 문제일 경우.
        return res.send(obj.status);
    } else {    //이전에 풀었던 문제일 때.
        return res.json(obj.answer);
    }
}

//전달받은 resultID와 questionID가 동일한 examID를 가지는지 확인하는 함수.
isSameExamID = async (obj, next)=>{
    const resultInst = new Result(obj.resultID);
    const questionInst = new Question(obj.questionID);
    const obj1 = await resultInst.getExamIDByResultID();
    const obj2 = await questionInst.getExamIDByQuestionID();

    if (obj1.status===500) {
        next(obj1.err);
    } else if (obj2.status===500) {
        next(obj2.err);
    } else if (obj1.status===400 || obj2.status===400 || obj1.examID!==obj2.examID) {
        return 400;
    } else {
        return 200;
    }
}

module.exports = {
    showAnswerDetails,
    showAnswer
}