import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Header from "../components/Header";
import MypageNav from "./MypageNav";
import "./MyPage.css";


function MyLearning() {

    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));
    const handleNotAuthenticated = () => {
        setLoginSuccess(false);
    };
    
    const memberID = window.sessionStorage.getItem("memberID");
    const [cookies, setCookie] = useCookies(['examName']); // eslint-disable-line no-unused-vars

    const [isFinished, setFinished] = useState([]);
    const [result, setResult] = useState([]);

    const [recent_exam, setRecentExam] = useState([]);
    const [recent_record, setRecentRecord] = useState([]);
    const [loading, setLoading] = useState(true);


    // 최근에 진행한 시험
    useEffect(() => {
        fetch(`http://localhost:5000/results?sort=date&order=desc`, {
            method: "GET",
            credentials: "include",
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
            }
        })
        .then(res => {
            if (res.status === 200 ) {
                return res.json();
            } else if (res.status === 204) { // 진행한 시험이 아예 없을 경우.
                console.log("최근 학습한 테스트가 없습니다.");
                const continue_btn = document.getElementById('continue_btn'); //버튼 hidden처리
                continue_btn.style.visibility = "hidden";
                return res.json();
            } else if (res.status === 401) { //인증 오류(로그인상태X)
                alert("로그인 후 이용이 가능합니다.");
                window.open("http://localhost:3000/login", "_self");
            } else if (res.status === 403) { //다른 사용자의 결과 데이터를 조회하는 경우.
                alert("부적절한 접근입니다.");
                window.open("http://localhost:3000/mypage/myLearning", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .then(res => {
            setFinished(res.isFinished);
            setResult(res.result);
            })
        .catch(error => console.log(error));
        setLoading(false);
    }, [memberID])



    //나만의 문제박스 5개
    useEffect(() => {
        fetch(`http://localhost:5000/exam/${memberID}/recent`, {
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
            } else if (res.status === 204) { //사용자가 진행한 시험이 아예 없을 경우
                console.log("생성된 문제가 없습니다.");
                return res.json();
            } else if (res.status === 403) { //다른 사용자의 결과 데이터를 조회하는 경우
                alert("부적절한 접근입니다.");
                window.open("http://localhost:3000/mypage/myLearning", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .then((recent_exam) => {
            setRecentExam(recent_exam);
        })
        .catch(error => console.log(error));
        setLoading(false);
    }, [memberID])



    //최근에 시험이 종료된 3가지 테스트 결과 가져오기
    useEffect(() => {
        fetch(`http://localhost:5000/results?finish=true&sort=date&order=desc&count=3`, {
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
            } else if (res.status === 204) { //사용자가 완료한 시험이 아예 없을 경우
                console.log("완료한 시험결과 데이터가 존재하지 않음.");
                return res.json();
            } else if (res.status === 403) { //다른 사용자의 데이터를 조회하는 경우
                alert("부적절한 접근입니다.");
                window.open("http://localhost:3000/mypage/myLearning", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .then((recent_record) => {
            setRecentRecord(recent_record);
        })
        .catch(error => console.log(error));
        setLoading(false);
    }, [memberID])

    
    // 시험 기록 리스트생성
    const record_list = [];
    const set_record_lists = () => {
        if(recent_record.results !== undefined) {
            for(var i=0; i<=2; i++) {
                if(recent_record.results[i] === undefined) {
                    record_list[i] = "-";
                }else {
                    record_list[i] = "- <"+recent_record.results[i].examName+"> "+recent_record.results[i].elapsedTime;
                }
            }
        } else {
            for(i=0; i<=2; i++) {
                record_list[i] = "-";
            }
        }
    }
    set_record_lists();
    

    //테스트기록 더보기 버튼
    const more_exam_record = () => {
        window.open("http://localhost:3000/exam/result", "_self");
    }

    //나만의문제박스 더보기 버튼
    const more_exam_list = () => {
        window.open("http://localhost:3000/exam/list", "_self");
    }


    if (loading) return <div>
                            <div className="loading"></div>
                            <div style={{textAlign: "center", color: "purple"}}>Loading º º º</div>
                        </div>


    return (
        <div style={{height: "100%"}}>
            <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
            <MypageNav />

            <div className="learning_boxes">
                <div className="set1">
                    <div className="most_recent_test">
                        <div className="box_header">📝 최근 학습한 테스트</div>
                        <div className="most_recent_test_name">- {result.examName}</div>
                        { isFinished ? (
                            <Link to={{pathname: `/test/${result.examID}/prepare`, state: {resultID: null} }}>
                                <button id="continue_btn" onClick={() => setCookie('examName', result.examName)}>다시 학습하기 👉</button>
                            </Link>
                        ) : (
                            <Link to={{pathname: `/test/${result.examID}/prepare`, state: {resultID: result.resultID}}}>
                                <button id="continue_btn" onClick={() => setCookie('examName', result.examName)}>다시 학습하기 👉</button>
                            </Link>
                        )}
                    </div>

                    <div className="test_records">
                        <div className="box_header">⏱ 테스트 기록</div>
                        <div className="view_more_btn">
                            <p onClick={more_exam_record}>더보기 &gt;&gt; </p>
                        </div>
                        <div style={{marginTop: "1.8rem", marginLeft: "2rem"}}>{record_list[0]}</div>
                        <div style={{marginTop: "1rem", marginLeft: "2rem"}}>{record_list[1]}</div>
                        <div style={{marginTop: "1rem", marginLeft: "2rem"}}>{record_list[2]}</div>
                    </div>
                </div>

                    <div className="set2">
                        <div className="five_recent_test">
                            <div className="box_header">📚 나만의 문제 BOX</div>

                            <div className="view_more_btn">
                                <a href="http://localhost:3000/exam/list" target="_self" onClick={more_exam_list}>더보기 &gt;&gt;</a>
                            </div>

                            <div className="guide_detail">문제를 클릭하면 문제 상세페이지로 이동합니다.</div>
                            
                            {recent_exam && recent_exam.map(exam => 
                                <div key = {exam.examID}>

                                <Link to={{pathname: `/exam/${exam.examID}`, state: {examName: exam.examName} }}>
                                    <p className="five_exam_list" onClick={() => setCookie('examName', exam.examName)}>- {exam.examName}</p>
                                </Link>
                                </div>
                            )}
                            {[...Array(5-Number(recent_exam.length))].map((n, index) => {
                                    return (
                                        <div key = {index}>
                                            <p className="five_exam_list">- </p>
                                        </div>
                                    )
                            })}
                            <div className="white_dot">.</div>
                        </div>
                    </div>
            </div>
        </div>
    );
}

export default MyLearning