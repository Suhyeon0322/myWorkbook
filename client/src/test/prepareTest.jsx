/**  시험 시작 전 페이지 **/
import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import './test.css'

const PrepareTest = () => {
    const location = useLocation();
    const examID = useParams().examID;
    const resultID = useState(location.state.resultID)[0];
    const [cookies, setCookie] = useCookies(['examName']); // eslint-disable-line no-unused-vars
    const [timeLimit, setTimeLimit] = useState('');
    const [quesList, setQuesList] = useState('');
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));

// 셔플한 문제 목록 생성
useEffect(() => {
    fetch(`http://localhost:5000/exam/${examID}/questions/shuffling`, {
        method: "GET",
        credentials: "include",
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true
        }
    })
    .then(res => {
        if (res.status === 200) {
            return res.json();
        } else if (res.status === 204) {
            alert("문제가 존재하지 않아 시험을 시작할 수 없습니다.\n문제폴더 목록으로 이동합니다.");
            window.open("http://localhost:3000/exam/list", "_self");
        } else if (res.status === 401) {
            alert("로그인 후 이용이 가능합니다.");
            window.open("http://localhost:3000/login", "_self");
        } else {
            throw new Error("Error");
        }
    })
    .then(res => {
        setTimeLimit(res.timeLimit);
        setQuesList(res.questions);
    })
    .catch(error => console.log(error));
}, [examID]);

const handleNotAuthenticated = () => {
    setLoginSuccess(false);
};

return (
    <>
    <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
    <div className="prepareTest">
        <h1 className="prepareTest_title">랜덤 문제풀이</h1>
        <div className="testInfo">
            <b>지정 문제폴더명 : {cookies.examName}</b><br /> 
            <b>제한시간 : {timeLimit}</b><br />
            <b>문항 수 : {Object.keys(quesList).length}</b>
        </div>
        <div className="test_preCautions">
            <strong style={{color: 'red'}}>* 주의사항 *</strong><br />
            <b>&nbsp;- 시험 종료 후 정오 여부 체크를 위해 답안을 문제풀이 시 기재하시기 바랍니다.</b><br />
            <b>&nbsp;- 시작 전 시험 정보를 다시 한번 확인하시기 바랍니다.</b>
        </div>
        <div style={{textAlign: 'center'}}> 
            <Link to={{ pathname: `/test/${examID}`, state: {resultID: resultID, quesList: quesList, timeLimit: timeLimit} }}>
                <button className="test_startBtn">START</button>
            </Link>
        </div>
    </div>
    </>
    );
}

export default PrepareTest;