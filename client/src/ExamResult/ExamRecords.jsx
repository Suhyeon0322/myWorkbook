import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from "../components/Header";
import "./ExamResult.css";

function ExamRecords() {

    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));
    const handleNotAuthenticated = () => {
        setLoginSuccess(false);
    };

    const memberID = window.sessionStorage.getItem("memberID");
    const [results, setExamResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/results`, {
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
            } else if (res.status === 204) { // 전달할 데이터가 없음.
                alert("테스트 기록이 없습니다.");
                window.open("http://localhost:3000/mypage/myLearning", "_self");
            } else if (res.status === 401) { //인증 오류(로그인상태X)
                alert("로그인 후 이용이 가능합니다.");
                window.open("http://localhost:3000/login", "_self");
            } else if (res.status === 403) { //다른 사용자의 데이터를 조회하는 경우.
                alert("부적절한 접근입니다.");
                window.open("http://localhost:3000/mypage/myLearning", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .then(res => {
            setExamResults(res.results);
            if(res.results !== undefined && res.results.length <= 6) {
                const parent_div = document.getElementById('parent_div');
                parent_div.style.height = "100vh";
            }
        })
        .catch(error => console.log(error));
        setLoading(false);
    }, [memberID])


    const delete_result = (resultID) => {
        var selectResult = window.confirm("해당 시험 결과를 정말 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.");
        if (selectResult) {
            fetch(`http://localhost:5000/results/${resultID}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Credentials": true,
                }
            })
            .then(res => {
                if (res.status === 204) {
                    alert("문제 삭제가 완료되었습니다.");
                } else if (res.status === 400) { //존재하지 않거나 잘못된 resultID를 전달 받은 경우.
                    alert("잘못된 요청입니다(Bad Request: Error 400)");
                    window.open("http://localhost:3000/exam/result", "_self");
                } else if (res.status === 403) { //다른 사용자의 resultID에 대한 삭제 요청이 온 경우.
                    alert("부적절한 접근입니다(Forbidden: Error 403)");
                    window.open("http://localhost:3000/exam/result", "_self");
                } else {
                    throw new Error("Error");
                }
            })
            .then(response => console.log(JSON.stringify(response)))
            .catch(error => console.log(error));
    
            setExamResults(results.filter(result => result.resultID !== resultID));
        }
    };


    if (loading) return <div>
                            <div className="loading"></div>
                            <div style={{textAlign: "center", color: "purple"}}>Loading º º º</div>
                        </div>


    return (
        <>
        <div id="parent_div">
            <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
                <div id="parent_div">
                    <div className="exam_result_title">⏱ 테스트 기록
                        <div className="exam_result_explain">테스트 이름을 클릭하면 해당 시험 결과 상세페이지로 이동됩니다.</div>
                    </div>
                    
                
                    <table className="exam_result_table">
                        <thead>
                            <tr>
                                <th className="records_th">테스트 이름</th>
                                <th className="records_th">응시 날짜</th>
                                <th className="records_th">걸린 시간</th>
                                <th className="records_th">맞은 개수</th>
                                <th className="records_th">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results && results.map(result => 
                                <tr id="records_tr" key={result.resultID}>
                                    <td className="records_td">
                                        <Link to={{ pathname: `/exam/result/${result.resultID}`}}>
                                            <p>{result.examName}</p>
                                        </Link>
                                    </td>
                                    <td className="records_td">{result.test_date.substr(0,10)}</td>
                                    
                                    <td className="records_td">{result.elapsedTime}</td>
                                    <td className="records_td">{result.correctAnswerCnt}</td>
                                    <td><button className="records_delete_btn" onClick={() => delete_result(result.resultID)}>삭제</button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </div>
        </>
    );
}

export default ExamRecords;
