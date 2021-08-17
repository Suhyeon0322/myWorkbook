const express = require('express');
const router = express.Router();
const multer = require('multer');

const form_data = multer();
const auth = require('../middleware/auth-middleware');
const ctrl = require('./answer-ctrl');

router.use(form_data.array());

router.get('/:resultID', auth.authCheck, auth.checkPermissionResultID, ctrl.showAnswerDetails);  //테스트 상세 기록 조회하기 -> 문제, 사용자가 입력한 답.
router.get('/:resultID/question/:questionID', auth.authCheck, auth.checkPermissionResultID, ctrl.showAnswer);

module.exports = router;