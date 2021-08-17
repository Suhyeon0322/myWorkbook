const Member = require('../models/Member');

const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

//회원 탈퇴
deleteMember = async (req, res)=>{
    const memberInst = new Member(req.params.memberID);
    const deletedResult = await memberInst.deleteMember();
    
    if (deletedResult.success) {
        req.logout();
        req.session.destroy();
        res.json(deletedResult);
    } else {
        if (deletedResult.msg==='member 존재하지 않음.') {
            return res.status(400).json({success: false, msg: deletedResult.msg+' 요청 데이터 확인 필요.'});
        }
        return res.status(500).json({success: false, msg: deletedResult.msg});
    }
};

module.exports = {
    deleteMember
};