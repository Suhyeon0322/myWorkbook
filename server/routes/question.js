const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth-middleware');
const ctrl = require('./question-ctrl');
const {upload} = require('../util/upload');

//문제 추가
router.post('/', auth.authCheck, upload.fields([ {name: 'questionIMG'}, {name: 'solutionIMG'} ]), auth.checkPermissionExamID, ctrl.createQuestion);

//문제 조회(questionID)
router.get('/:questionID', auth.authCheck, auth.checkPermissionQuestionID, ctrl.getQuestion);

//문제 수정
router.patch('/:questionID', auth.authCheck, auth.checkPermissionQuestionID, upload.fields([ {name: 'questionIMG'}, {name: 'solutionIMG'} ]), ctrl.modifyQuestion);

//문제 삭제
router.delete('/:questionID', auth.authCheck, auth.checkPermissionQuestionID, ctrl.removeQuestion);

module.exports = router;