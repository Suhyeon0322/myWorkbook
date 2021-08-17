/**  문제 수정 페이지 **/
import React, { useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import './QuesList.css';

const ModifyQuesComponent = () => {
    const history = useHistory();
    const location = useLocation();
    const examID = useState(location.state.question.examID)[0];
    const questionID = useState(location.state.question.questionID)[0];
    const [answer, setAnswer] = useState(location.state.question.answer);
    const [quesImgFile, setQuesImgFile] = useState(location.state.question.questionIMG);
    const [quesImgUrl, setQuesImgUrl] = useState(location.state.question.questionIMG);
    const [soluImgFile, setSoluImgFile] = useState(location.state.question.solutionIMG);
    const [soluImgUrl, setSoluImgUrl] = useState(location.state.question.solutionIMG);
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));

// '문제 정답'을 입력한 값으로 설정해주는 함수
const onChangeAnswer = (e) => {
    setAnswer(e.target.value);    
};

// '문제 내용'을 선택한 사진으로 설정해주는 함수
const onChangeQuesIMG = (e) => {
    let reader = new FileReader();

    reader.onloadend = () => {
        setQuesImgUrl(reader.result);
    }
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
        setQuesImgFile(e.target.files[0]);
    }
}

// '문제 해설'을 선택한 사진으로 설정해주는 함수
const onChangeSoluIMG = (e) => {
    let reader = new FileReader();
    
    reader.onloadend = () => {
        setSoluImgUrl(reader.result);
    }
    if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
        setSoluImgFile(e.target.files[0]);
    }
}

/* 문제 사진 '파일 초기화' 버튼 클릭 시 동작하는 함수 */
const onQuesImgReset = (e) => {
    e.preventDefault();
    setQuesImgFile('');
    setQuesImgUrl('');
}

/* 해설 사진 '파일 초기화' 버튼 클릭 시 동작하는 함수 */
const onSoluImgReset = (e) => {
    e.preventDefault();
    setSoluImgFile('');
    setSoluImgUrl('');
}

// 페이지 내 '저장' 버튼 클릭 시, 동작하는 함수
const modifyQuestion = (e) => {
    e.preventDefault();
    let question;

    const formData = new FormData();

    formData.append('examID', examID);

    if (answer !== location.state.question.answer) {
        formData.append('answer', answer);
    }

    if (quesImgFile !== location.state.question.questionIMG) {
        formData.append('questionIMG', quesImgFile);
    }

    if (soluImgFile !== location.state.question.solutionIMG) {
        formData.append('solutionIMG', soluImgFile);
    }
    
    if (answer === '' || quesImgFile === '') {
        alert("필수 항목을 빠짐없이 입력하세요.")
        return;
    }

    fetch(`http://localhost:5000/question/${questionID}`, {
        method: "PATCH",
        credentials: "include",
        body: formData
    })
    .then(res => {
        if (res.status === 201) {
            alert("문제 수정이 완료되었습니다.");
            return res;
        } else if (res.status === 400) {
            alert("잘못된 입력 형태입니다.");
            throw new Error("Bad Request");
        } else if (res.status === 401) {
            alert("로그인 후 이용이 가능합니다.");
            window.open("http://localhost:3000/login", "_self");
        } else {
            throw new Error("Error");
        }
    })
    .then(res => {
        console.log(res);
        question = {...question,
            examID: examID, questionID: questionID, answer: answer, questionIMG: quesImgFile, solutionIMG: soluImgFile
        };
        (() => {
            history.push({
                pathname : `/exam/${examID}`, 
                state : {question: question}
            });
        })(question);
    })
    .catch(error => console.log(error));
};

const handleNotAuthenticated = () => {
    setLoginSuccess(false);
};

return (
    <>
    <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
    <div className="ques_modifyForm">
        <div>
            <h3 className="ques_modifyTitle">문제 수정</h3>
            <div>
                <form className="ques_form" onSubmit={modifyQuestion} encType="multipart/form-data">
                    <b style={{fontSize: '20px'}}>* 표시는 필수 입력 항목입니다.</b> 
                    <div style={{marginTop: '15px'}}>
                        <label className="label_quesAnswer"> * 문제 정답 : </label>
                        <input placeholder="문제 정답" name="answer" className="ques_form_textInput" 
                        value={answer} onChange={onChangeAnswer}/>
                    </div>
                    <div>
                        <label className="label_quesIMG"> * 문제 사진 : </label><br />
                        <input type="text" readOnly="readOnly" className="quesIMG_name" placeholder="파일을 첨부하세요."
                        value={quesImgFile || ''} />
                        <label className="quesIMG_btn" htmlFor="quesImgFile" onChange={onChangeQuesIMG}>파일 선택
                            <input type="file" id="quesImgFile" />
                        </label>
                        <button className="quesImgFile_resetBtn" onClick={onQuesImgReset}>파일 초기화</button>
                        { quesImgUrl &&
                        <div style={{marginBottom: '10px'}}>
                            <img style={{width: '400px', height: '300px'}} src={quesImgUrl} alt={quesImgFile.name} />
                        </div> }
                    </div>
                    <div>
                        <label className="label_soluIMG"> 해설 사진 : </label> <br />
                        <input type="text" readOnly="readOnly" className="soluIMG_name" placeholder="파일을 첨부하세요."
                        value={soluImgFile || ''} />
                        <label className="soluIMG_btn" htmlFor="soluImgFile" onChange={onChangeSoluIMG}>파일 선택
                            <input type="file" id="soluImgFile" />
                        </label>
                        <button className="soluImgFile_resetBtn" onClick={onSoluImgReset}>파일 초기화</button>
                        { soluImgUrl &&
                        <div>
                            <img style={{width: '400px', height: '300px'}} src={soluImgUrl} alt={soluImgFile.name} />
                        </div> }
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <button type="submit" className="ques_saveBtn">저장</button>
                        {/* 페이지 내 '취소' 버튼 클릭 시, 문제 목록 페이지로 이동*/}
                        <Link to={`/exam/${examID}`}>
                            <button className="ques_cancelBtn" style={{margin: "0 0 0 10px"}}>취소</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
)
}

export default ModifyQuesComponent;