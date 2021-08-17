const ExamStorage = require('../models/ExamStorage');
const ResultStorage = require('../models/ResultStorage');

const auth = {
    //인증 middleware 정의
    //해당 페이지에서 로그인이 돼 있는 상태인지 확인하는 middleware
    //로그인 돼 있으면 next();
    //로그인이 돼 있지 않으면 401 에러 메세지 전닳.
    authCheck: (req, res, next) => {
        if (!req.user) {    //로그인 된 상태가 아니면
          res.status(401).json({
            authenticated: false,
            message: "인증에 실패했습니다."
          });
        } else {
          next();
        }
    },

    //현재 사용자가 examID에 접근할 수 있는지 확인하는 middleware
    checkPermissionExamID: async (req, res, next)=>{
      const memberID = req.user[0].memberID;
      let examID;

      if (req.path==='/')
        examID = req.body.examID;
      else 
        examID = req.params.examID;

      try {
        const hasExam = await ExamStorage.examExists(memberID, examID);
        if (hasExam===0) {
          res.send(403);
        } else {
          next();
        }
      } catch(err) {
        next(err);
      }
    },

    //사용자가 접근할 수 있는 questionID인지 확인하는 middleware
    checkPermissionQuestionID: async (req, res, next)=>{
      const memberID = req.user[0].memberID;
      const questionID = req.params.questionID;
      
      try {
        const newMemberID = await ExamStorage.getMemberIDByquestionID(questionID);
        if (memberID===newMemberID)
          next();
        else
          return res.send(403);
      } catch(err) {
        next(err);
      }
    },

    //현재 로그인된 사용자의 memberID와 전송받은 memberID가 일치하는지 확인.
    checkPermissionMemberID: async (req, res, next)=>{
      let memberID;
      if (req.body.memberID===undefined) {
        memberID = req.params.memberID;
      } else {
        memberID = req.body.memberID;
      }

      if (req.user[0].memberID===memberID) 
        next();
      else 
        res.send(403);
    },

    //사용자가 접근할 수 있는 resultID인지 확인하는 미들웨어
    checkPermissionResultID: async(req, res, next)=>{
      let resultID='';

      if (req.body.resultID===undefined) {
        resultID = req.params.resultID;
        //reqData.questionID = req.params.questionID;
      } else {
        resultID = req.body.resultID;
      }

      try {
        const memberID = await ResultStorage.getMemberIDByResultID(resultID);
        
        if (memberID===-1) {  //존재하지 않는 resultID를 전송한 경우.
          let reqData = req.body;
          reqData.resultID = resultID;
          return res.status(400).json(reqData);
        } else if (memberID===req.user[0].memberID) { //정상적인 요청의 경우
          next();
        } else {  //다른 사용자의 resultID를 조회할 경우.
          return res.send(403);
        }
      } catch(err) {  //서버 내부에서 오류가 발생한 경우.
        next(err);
      }
    }
}

module.exports = auth;