import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import "./ExamResult.css";

function ExamRecordsDetails() {

    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));
    const handleNotAuthenticated = () => {
        setLoginSuccess(false);
    };

    const resultID = useParams().resultID;
    const [exam_result, setExamResults] = useState([]);
    const [details, setResultsDetails] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/results/${resultID}`, {
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
            } else if (res.status === 204) { // 전달할 데이터가 없음.
                alert("해당 데이터가 존재하지 않습니다.");
                window.open("http://localhost:3000/", "_self");
            } else if (res.status === 400) { //잘못된 resultID를 전달한 경우.
                alert("잘못된 요청입니다(Bad Request: Error 400)");
                window.open("http://localhost:3000/exam/result", "_self");
            } else if (res.status === 401) { //인증 오류(로그인상태X)
                alert("로그인 후 이용이 가능합니다.");
                window.open("http://localhost:3000/login", "_self");
            } else if (res.status === 403) { //다른 사용자의 resultID를 조회한 경우.
                alert("부적절한 접근입니다.");
                window.open("http://localhost:3000/exam/result", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .then(exam_result => {
            setExamResults(exam_result);
        })
        .catch(error => console.log(error));
        setLoading(false);
    }, [resultID])


    useEffect(() => {
        fetch(`http://localhost:5000/answers/${resultID}`, {
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
            } else if (res.status === 400) { //잘못된 resultID를 전달한 경우.
                alert("잘못된 요청입니다(Bad Request: Error 400)");
                window.open("http://localhost:3000/exam/result", "_self");
            } else if (res.status === 403) { //다른 사용자의 resultID를 조회한 경우.
                alert("부적절한 접근입니다.");
                window.open("http://localhost:3000/exam/result", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .then(details => {
            setResultsDetails(details);
        })
        .catch(error => console.log(error));
        setLoading(false);
    }, [resultID])


    if (loading) return <div>
                            <div className="loading"></div>
                            <div style={{textAlign: "center", color: "purple"}}>Loading º º º</div>
                        </div>


    //시험날짜 substr 처리
    var test_day = "" + exam_result.test_date;
    test_day = test_day.substr(0, 10);


    return (
        <div>
            <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
            <div id="parent_div">
                <div className="exam_result_box">
                
                    <div id="bx1"  style={{display: "inline-block"}}>
                        <div className="exam_result_detail1">📝 테스트 이름 &nbsp;: &nbsp; {exam_result.examName}</div>
                        <div className="exam_result_detail1">📆 응시 날짜 &nbsp;: &nbsp; {test_day}</div>
                    </div>
                    <div id="bx2" style={{display: "inline-block", marginLeft: "250px"}}>
                        <div className="exam_result_detail2">⏱ 걸린 시간 &nbsp;: &nbsp; {exam_result.elapsedTime}</div>
                        <div className="exam_result_detail2">⭕ 맞은 개수 &nbsp;: &nbsp; {exam_result.correctAnswerCnt}</div>
                        
                    </div>
                </div>
                
                
                <table className="exam_result_table" >
                    <thead>
                        <tr>
                            <th className="records_th" style={{width: "130px"}}>문제 번호</th>
                            <th className="records_th" style={{width: "430px"}}>문제 내용</th>
                            <th className="records_th" style={{width: "130px"}}>정답</th>
                            <th className="records_th" style={{width: "130px"}}>정/오</th>
                            <th className="records_th" >해설</th>
                        </tr>
                    </thead>

                    <tbody>
                    {details && details.map(detail =>
                                <tr id="records_tr" key={detail.questionNumber}>
                                    <td className="records_detail_td">{detail.questionNumber}</td>

                                    <td className="records_detail_td"><img style={{maxWidth: '430px'}} src={detail.questionIMG} alt={detail.questionNumber}/></td>
                                    <td className="records_detail_td">{detail.answer}</td>
                                    { detail.isCorrect ? (
                                        <td className="records_detail_td">O</td> //isCorrect=1, 맞은경우
                                    ) : (
                                        <td className="records_detail_td">X</td> //isCorrect=1, 틀린경우
                                    )}
                                    <td className="records_detail_td"><img style={{maxWidth: '370px'}} src={detail.solutionIMG} alt={detail.questionNumber} /></td>
                                </tr>
                            )}
                    </tbody>
                </table>
                <div style={{textAlign: "center"}}>
                    <Link to={{pathname: `/exam/result`}}>
                        <button className="check_btn">✔ 확인</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ExamRecordsDetails;