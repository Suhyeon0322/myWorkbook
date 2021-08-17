/**  문제 목록 페이지 **/
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import './QuesList.css';

const ListQuesComponent = () => {
    const examID = useParams().examID;
    const [cookies, setCookie] = useCookies(['examName']); // eslint-disable-line no-unused-vars
    const [quesList, setQuesList] = useState([]);
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));
    const [loading, setLoading] = useState(true);

// '문제 삭제' 버튼 클릭 시, 동작하는 함수
const deleteQues = (questionID) => {
    var alertValue = window.confirm("선택한 문제를 정말 삭제하시겠습니까?\n삭제 후에는 복구할 수 없습니다.");
    if (alertValue) {
        fetch(`http://localhost:5000/question/${questionID}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
            },
        })
        .then(res => {
            if (res.status === 204) {
                alert("문제 삭제가 완료되었습니다.")
                return res.json();
            } else if (res.status === 401) {
                alert("로그인 후 이용이 가능합니다.");
                window.open("http://localhost:3000/login", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .catch(error => console.log(error));

        setQuesList(quesList.filter(ques => ques.questionID !== questionID));
    }
};

// 문제 목록을 생성함.
useEffect(() => {
    fetch(`http://localhost:5000/exam/${examID}`, {
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
            const parent_div = document.getElementById('parent_div');
            parent_div.style.height = "600px";
        } else if (res.status === 401) {
            alert("로그인 후 이용이 가능합니다.");
            window.open("http://localhost:3000/login", "_self");
        } else {
            throw new Error("Error");
        }
    })
    .then(res => {
        setQuesList(res);
        if(res !== undefined && res.length <= 5) {
            const parent_div = document.getElementById('parent_div');
            parent_div.style.height = "100vh";
        }
    })
    .catch(error => console.log(error));
    setLoading(false);
}, [examID]);

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
    <div className="quesList" id="parent_div">
        <h1 className="quesList_title"> "{cookies.examName}" 폴더의 문제 목록 </h1>
        <div style={{width: '87.5%', textAlign: 'right'}}>
            <Link to={{ pathname: "/question/add", state: {examID: examID} }}>
                <button className="ques_createBtn">문제 추가</button>
            </Link>
        </div>
        <br></br>
        <div>
            <table className="quesList_table">
                <thead>
                    <tr>
                        <th>문제 번호</th>
                        <th>해설 유무</th>
                        <th>상세보기</th>
                        <th>수정 / 삭제</th>
                    </tr>
                </thead>
                <tbody>
                    {quesList && quesList.map((question, index) => 
                        <tr key = {question.questionID}>
                            <td>{index + 1}</td>
                            <td>{ question.solutionIMG ? "있음" : "없음"}</td>   
                            <td>
                                <Link to={{ pathname: `/question/${question.questionID}`, state: {examID: examID} }}>
                                    <button className="ques_infoBtn">상세보기</button>
                                </Link>
                            </td>
                            <td>
                                <Link to={{ pathname: `/question/modify/${question.questionID}`, state: {question: question} }}>
                                    <button className="ques_modifyBtn">수정</button>
                                </Link>
                                <button className="ques_deleteBtn" onClick={() => deleteQues(question.questionID)}>삭제</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="quesList_previousBtn">
                <Link to={`/exam/list`}>
                    <span>&lt;&lt;&nbsp;&nbsp;&nbsp;문제 폴더 목록 페이지로 이동</span>
                </Link>
            </div>
        </div>
    </div>
    </>
    );
}

export default ListQuesComponent;