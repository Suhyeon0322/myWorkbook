/**  문제 폴더 수정 페이지 **/
import React, { useState } from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import './Exam.css';

const ModifyExamComponent = () => {
    const history = useHistory();
    const location = useLocation();
    const examID = useState(location.state.exam.examID)[0];
    const [examName, setExamName] = useState(location.state.exam.examName);
    const [timeLimit, setTimeLimit] = useState(location.state.exam.timeLimit);
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));

// 문제 폴더 제목을 입력한 값으로 설정해주는 함수
const onChangeExamName = (e) => {
    setExamName(e.target.value);
};

// 문제 폴더 제한 시간을 입력한 값으로 설정해주는 함수
const onChangeTimeLimit = (e) => {
    setTimeLimit(e.target.value);  
};

// 페이지 내 '저장' 버튼 클릭 시, 동작하는 함수
const modifyExam = (e) => {
    e.preventDefault();
    let info = {examName, timeLimit};
    let exam;

    fetch("http://localhost:5000/exam/modify", {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({examID, info}) 
    })
    .then(res => {
        if (res.status === 200) {
            alert("문제폴더 수정이 완료되었습니다.");
            return res.json();
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
        console.log(JSON.stringify(res));
        exam = {...exam,
            examID: examID, examName: examName, timeLimit: timeLimit
        };
        (() => {
            history.push({
                pathname : '/exam/list', 
                state : {exam: exam}
            });
        })(exam);
    })
    .catch(error => console.log(error));
};

const handleNotAuthenticated = () => {
    setLoginSuccess(false);
};

return (
    <>
    <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
    <div className="#exam_modify">
        <div style={{height: "590px"}}>
            <h3 className="exam_modifyTitle">문제 폴더 수정</h3>
            <div>
                <form className="exam_form" onSubmit={modifyExam}>
                    <b style={{fontSize: '20px'}}>* 표시는 필수 입력 항목입니다.</b> 
                    <div style={{marginTop: '15px'}}>
                        <label className="label_folderTitle"> * 문제 폴더 제목 : </label>
                        <input required placeholder="문제 폴더 제목" name="examName" className="exam_form_textInput" 
                        value={examName} onChange={onChangeExamName}/>
                    </div>
                    <div>
                        <label className="label_examTimeLimit"> 제한 시간 : </label>
                        <input placeholder="제한 시간 (HH:MM:SS 형태)" name="timeLimit" className="exam_form_textInput"  
                        value={timeLimit || ""} onChange={onChangeTimeLimit}/>
                    </div>
                    <div style={{textAlign: 'right'}}>
                        <button type="submit" className="exam_saveBtn">저장</button>
                        {/* 페이지 내 '취소' 버튼 클릭 시, 폴더 목록 페이지로 이동*/}
                        <Link to='/exam/list'>
                            <button className="exam_cancelBtn" style={{margin: "0 0 0 10px"}}>취소</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
)
}

export default ModifyExamComponent;