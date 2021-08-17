const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth-middleware');

//메인페이지에서 인증과정 거치도록 하기
//인증이 됐으면(즉, 로그인이 돼 있는 사용자면) 사용자 정보 전달.
router.get("/", auth.authCheck, (req, res) => {
    res.status(200).json({
      authenticated: true,
      message: "인증이 성공적으로 완료되었습니다.",
      user: req.user, 
      //cookies: req.cookies
    });
});

module.exports = router;