/**  문제 폴더 목록 페이지 **/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import './Exam.css';
import folderIMG from '../images/folder_icon.png';

const ListExamComponent = () => {
    const memberID = window.sessionStorage.getItem('memberID');
    const [cookies, setCookie] = useCookies(['examName']); // eslint-disable-line no-unused-vars
    const [examList, setExamList] = useState([]);
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));
    const [loading, setLoading] = useState(true);

// '문제 폴더 삭제' 버튼 클릭 시, 동작하는 함수
const deleteExam = (examID) => {
    var alertValue = window.confirm("해당 폴더 삭제 시 폴더 내 내용도 모두 삭제됩니다.\n삭제하시겠습니까?");
    if (alertValue) {
        fetch("http://localhost:5000/exam/remove", {
            method: "DELETE",
            credentials: "include",
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({examID})
        })
        .then(res => {
            if (res.status === 200) {
                alert("문제폴더 삭제가 완료되었습니다.");
                return res.json();
            } else if (res.status === 401) {
                alert("로그인 후 이용이 가능합니다.");
                window.open("http://localhost:3000/login", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .catch(error => console.log(error));
    
        setExamList(examList.filter(exam => exam.examID !== examID));
    }
};

// 문제 폴더 목록을 생성함.
useEffect(() => {
    fetch("http://localhost:5000/exam/list", {
        method: "POST",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({memberID})
    })
    .then(res => {
        if (res.status === 200 || res.status === 204) {
            return res.json();
        } else if (res.status === 401) {
            alert("로그인 후 이용이 가능합니다.");
            window.open("http://localhost:3000/login", "_self");
        } else {
            throw new Error("Error");
        }
    })
    .then(res => {
        setExamList(res.examList);
        if(res.examList.length <= 3) {
            const parent_div = document.getElementById('parent_div');
            parent_div.style.height = "100vh";
        }
    })
    .catch (error => console.log(error));
    setLoading(false);
}, [memberID]);

const handleNotAuthenticated = () => {
    setLoginSuccess(false);
};

if (loading) 
    return <div>
                <div className="loading"></div>
                <div style={{textAlign: "center", color: "purple"}}>Loading º º º</div>
            </div>

return (
    <>
    <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
    <div className="examList" id="parent_div">
        <h1>문제 폴더 목록</h1>
        <div style={{height: '50px'}}>
            <div style={{float: 'left', display: 'inline', fontSize: '18px', fontWeight: 'bold'}}>
                * 문제 폴더 제목 클릭 시 해당 폴더 내 문제 목록으로 이동합니다.
            </div>
            <Link to="/exam/add">
                <button className="exam_createBtn">문제폴더 추가</button>
            </Link>
        </div>
        <div className="examFolder">
            <ul>
                {examList && examList.map(exam => 
                    <li key = {exam.examID}>
                        <div className="exam_folderIMG">
                            <img src={folderIMG} alt="" />
                            <div className="exam_folderHover">
                                <Link to={{ pathname: "/exam/modify",  state: {exam: exam} }}>
                                    <button className="exam_modifyBtn" />
                                </Link>
                                <button className="exam_deleteBtn" onClick={() => deleteExam(exam.examID)} />
                            </div>
                        </div>
                        <Link to={`/exam/${exam.examID}`}>
                            <strong onClick={() => setCookie('examName', exam.examName)}>{exam.examName}</strong>
                        </Link>
                        <span>제한시간 : {exam.timeLimit}</span><br />
                        <Link to={{ pathname: `/test/${exam.examID}/prepare` , state: {exam: exam, resultID: null} }}>
                            <button className="exam_startBtn" onClick={() => setCookie('examName', exam.examName)}>시험 시작</button>
                        </Link>    
                    </li>
                )}
            </ul>
        </div>
    </div>
    </>
);
}

export default ListExamComponent;