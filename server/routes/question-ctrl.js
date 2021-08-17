const Question = require('../models/Question');
const {s3} = require('../util/upload');

//문제를 추가하는 controller
createQuestion = async (req, res)=>{
    if (req.files===undefined || !Object.keys(req.files).includes('questionIMG')) { //전달받은 이미지가 존재하지 않거나 해설 이미지만 존재하는 경우.
        for (let file in req.files) {
            file = req.files[file][0];
            req.body[file.fieldname] = file.originalname;
        }

        res.status(400).json(req.body);
    } else {
        let filepaths = {};
        for (let file in req.files) {
            file = req.files[file][0];
            filepaths[file.fieldname] = file.location;
        }
        req.body['imgPath'] = filepaths;
    
        const questionInst = new Question(req.body);
        const result = await questionInst.createQuestion();

        if (result.status===201) {
            res.header('Content-Location', `/exam/${req.body.examID}`);
            res.send(result.status);
        } else {
            res.send(result.status);
        }
    }
}

//문제 조회 controller(examID)
getQuestions = async (req, res)=>{
    const questionInst = new Question(req.query.examID);
    const result = await questionInst.getQuestions();

    if (!result.success) {
        res.status(result.status).json(result);
    } else {
        res.json(result);
    }
}
//문제 조회 controller(questionID)
getQuestion = async (req, res)=>{
    const questionInst = new Question(req.params.questionID);
    const result = await questionInst.getQuestion();
    
    if (result.status===200) {
        res.json(result.question);
    } else {
        res.send(result.status);
    }
}

//문제 수정 controller
modifyQuestion = async (req, res, next)=>{
    let questionInst;
    let updateData = req.body;
    let updateFile = req.files;
    updateData.questionID = req.params.questionID;

    //수정 데이터에 이미지가 존재할 경우 updateData에 이미지 경로 저장하기
    if (updateFile!==null) {    //req.files에 이미지 데이터가 존재할 경우
        for (const [key, file] of Object.entries(updateFile)) {
            updateData[key] = file[0].location;
        }
    }

    //수정되는 이미지들의 수정 전 경로 가져오기
    questionInst = new Question(updateData.questionID);
    let paths = []
    if(Object.keys(updateFile).length===2 || (updateData.questionIMG==='' && updateData.solutionIMG==='')) {    //questionIMG, solutionIMG가 모두 수정될 경우.
        const imgPaths = await questionInst.getIMGPaths();
        for (const path of Object.values(imgPaths))
            paths.push(path);
    } else if (Object.keys(updateFile).includes('questionIMG') || updateData.questionIMG==='') {
        paths.push(await questionInst.getQuestionPath());
    } else if (Object.keys(updateFile).includes('solutionIMG') || updateData.solutionIMG==='') {
        paths.push(await questionInst.getSolutionPath());
    }

    //데이터를 수정하는 DB 실행
    questionInst = new Question(updateData);
    const modifyResult = await questionInst.modifyQuestion();

    if (modifyResult.status===201) {    //DB 수정 처리가 성공했으면
        //수정 전 이미지들을 s3 버킷에서 삭제하는 함수 호출.
        deleteFile(paths);
        //수정된 문제의 url 경로를 request header에 저장.
        res.header('Content-Location', `/question/${updateData.questionID}`);
        return res.send(modifyResult.status);
    } else {    //DB 수정 처리가 실패했으면
        next(modifyResult.err);
    }
}

//문제 삭제 controller
removeQuestion = async (req, res)=>{
    const questionInst = new Question(req.params.questionID);
    const removeResult = await questionInst.removeQeustion();
    
    let paths = [];
    if (removeResult.status===204) {
        for (const path of Object.values(removeResult.deletedImgs)) {
            if (path!==null) {
                paths.push(path);
            }
        }
        console.log(paths);
        deleteFile(paths);
    } 
    
    res.send(removeResult.status);
}

//s3 버킷의 이미지를 삭제하는 함수
function deleteFile(paths) {
    for (const path of paths) {
        const splitedPath = path.split('/');
        const length = splitedPath.length;
        const params = {
            Bucket: `${process.env.BUCKET}`, /* required */
            Key: `${splitedPath[length-3]}/${splitedPath[length-2]}/${splitedPath[length-1]}`, /* required */
        }
        
        s3.deleteObject(params, function(err, data) {
            if (err) {
                console.log(err.stack);
                next(err);
            }
        });
    }
}

module.exports = {
    createQuestion,
    getQuestions,
    getQuestion, 
    removeQuestion, 
    modifyQuestion
};  