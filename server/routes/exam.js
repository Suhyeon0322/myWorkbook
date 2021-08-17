const express = require('express');

const auth = require('../middleware/auth-middleware');
const ctrl = require('./exam-ctrl');

const router = express.Router();

router.get('/:examID', auth.authCheck, auth.checkPermissionExamID, ctrl.getQuestions);  //문제 목록 전달.
router.get('/:examID/questions/shuffling', auth.authCheck, auth.checkPermissionExamID, ctrl.getShuffledQuestions);  //셔플한 문제 목록 전달.
router.get('/:memberID/recent', auth.authCheck, auth.checkPermissionMemberID, ctrl.getRecentCretedExams);  //최근 생성한 5개의 시험 폴더 조회

router.post('/list', auth.authCheck, ctrl.showExams);   //시험 목록 읽기

router.post('/add', auth.authCheck, ctrl.createExam);    //시험 폴더 생성

router.delete('/remove', auth.authCheck, ctrl.deleteExam);  //시험 폴더 삭제

router.patch('/modify', auth.authCheck, ctrl.modifyExam);   //시험 폴더 수정

module.exports = router;