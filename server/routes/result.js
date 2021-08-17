const express = require('express');

const auth = require('../middleware/auth-middleware');
const ctrl = require('./result-ctrl');

const router = express.Router();

//각 시험에 대한 결과 조회
router.get('/:resultID', auth.authCheck, auth.checkPermissionResultID, ctrl.getResult);

//모든 시험 결과 조회
router.get('/', auth.authCheck, ctrl.getResults);

//시험 결과 생성하기
router.post('/', auth.authCheck, auth.checkPermissionExamID, ctrl.addResult);

//시험 결과 수정하기
router.patch('/:resultID', auth.authCheck, auth.checkPermissionResultID, ctrl.modifyResult);

//시험 결과 삭제하기
router.delete('/:resultID', auth.authCheck, auth.checkPermissionResultID, ctrl.removeResult);

module.exports = router;