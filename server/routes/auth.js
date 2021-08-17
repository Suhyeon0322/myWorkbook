const express = require('express');
const router = express.Router();
const passport = require('passport');

const auth = require('../middleware/auth-middleware');
const auth_ctrl = require('./auth-ctrl');

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

//로그인에 성공하면 클라이언트에 성공 메세지와 사용자 정보를 담은 response를 전달한다.
router.get("/login/success", (req, res) => {
    if (req.user) {
      return res.status(200).json({
        success: true,
        message: "인증에 성공했습니다.",
        user: req.user, 
        //cookies: req.cookies
      });
    } else {
      return res.status(401).json({  //401 error : 401 Unauthorized(인증 실패)
        success: false,
        message: "인증에 실패했습니다."
      });
    }
  }
);


// 로그인에 실패하면 클라이언트에게 실패 메세지를 전달한다.
router.get("/login/failed", (req, res) => {
    if (!req.user) {
      return res.status(401).json({  //401 error : 401 Unauthorized(인증 실패)
        success: false,
        message: "인증에 실패했습니다."
      });
    }
  }
);

//로그아웃 - 로그아웃 후 메인페이지로 리다이렉트
router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect(CLIENT_HOME_PAGE_URL);
      }
    });
});

//naver authenticate - 네이버 아이디로 로그인 페이지로 이동 & passport.authenticate() 미들웨어 실행.
router.get('/naver', passport.authenticate('naver'));

//google authenticate - google 로그인 페이지로 이동. 
//scope는 로그인 성공 후 받아오는 정보들 중에 profile 정보만을 받아오겠다는 것을 뜻함.
router.get('/google', passport.authenticate('google', {scope: ['profile']}));

//naver login callback - 로그인에 성공하면 메인 페이지로, 실패하면 /auth/login/failed 페이지로 리다이렉트
router.get('/naver/callback', 
    passport.authenticate('naver', {
        successRedirect: CLIENT_HOME_PAGE_URL,
        failureRedirect: '/auth/login/failed'
    })
);

//google login callback - 인증 완료 후 작업.
//인증 완료되면 루트 페이지로, 실패하면 인증 실패 메세지 페이지로 이동.
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: '/auth/login/failed'
  }));

router.delete('/remove/:memberID', auth.authCheck, auth_ctrl.deleteMember); //회원 탈퇴

module.exports = router;