const Exam = require('../models/Exam');
const Question = require('../models/Question');

//사용자가 생성한 시험 목록을 가져오는 controller
showExams = async (req, res)=>{
    const examInst = new Exam(req.body);
    const exams = await examInst.showExamLists();

    if (exams.success) {
        return res.json(exams);
    } else {
        return res.status(exams.status).json(exams);
    }
};

//시험 폴더별 문제 목록 데이터를 요청하는 API
getQuestions = async (req, res)=>{
    const questionInst = new Question(req.params.examID);
    const result = await questionInst.getQuestions();

    if (result.status===200) {
        res.status(result.status).json(result.questions);
    } else if (result.status===204) {
        res.send(result.status);
    } else {
        res.send(result.status);
    }
};

//사용자가 가장 최근에 생성한 5개의 시험 폴더를 전달하기 위한 함수
getRecentCretedExams = async (req, res, next)=>{
    const examInst = new Exam(req.params.memberID);
    const exams = await examInst.getRecentCreatedExams();

    if (exams.status===200) {
        res.json(exams.exams);
    } else if (exams.status===204) {
        res.send(exams.status);
    } else {
        next(exams);
    }
}

//examID를 사용해 questionID를 얻어내고 questionID 순서를 shuffle해 전달.
getShuffledQuestions = async (req, res, next)=>{
    const examInst = new Exam(req.params.examID);
    const questionInst = new Question(req.params.examID);

    const timeLimit = await examInst.getTimeLimitByExamID();
    if (timeLimit===-1)
        timeLimit = 'error';
    
    const obj = await questionInst.getQuestions();

    if (obj.status===500) {
        next(obj.err);
    } else if (obj.status===204) {
        return res.send(obj.status);
    } else {
        const questions = obj.questions;
        const length = Object.values(questions).length;
        for (let i=0; i<length-1; i++) {
            const index = Math.floor(Math.random() * (length-1));
            const temp = questions[index];
            questions[index] = questions[i];
            questions[i] = temp;
        }
        return res.json({ timeLimit: timeLimit, questions: questions });
    }
}

//사용자가 시험 폴더를 생성하는 controller
createExam = async (req, res)=>{
    const exam = new Exam(req.body);
    const createResult = await exam.createExam();
    
    if (createResult.success) {
        return res.json(createResult);
    } else {
        return res.status(createResult.status).json(createResult);
    }
};

//시험 폴더 삭제 controller
deleteExam = async (req, res)=>{
    const exam = new Exam(req.body);
    const deleteResult = await exam.deleteExam();

    if (deleteResult.success)
        return res.json(deleteResult);
    else
        return res.status(deleteResult.status).json(deleteResult);
};

//시험 폴더 수정 controller
modifyExam = async (req, res)=>{
    const exam = new Exam(req.body);
    const patchResult = await exam.updateExam();

    if (patchResult.success)
        return res.json(patchResult);
    else
        return res.status(patchResult.status).json(patchResult);
};

module.exports = {
    showExams, 
    getQuestions,
    getRecentCretedExams,
    getShuffledQuestions,
    createExam, 
    deleteExam, 
    modifyExam
};