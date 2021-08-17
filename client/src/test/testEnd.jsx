import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Header from "../components/Header";

const TestEnd = () => {
    const history = useHistory();
    const location = useLocation();
    const examID = useParams().examID;
    const resultID = useState(location.state.resultID)[0];
    const [cookies, setCookie] = useCookies(['examName']); // eslint-disable-line no-unused-vars
    const timer = useState(location.state.timer)[0];
    const overTimer = useState(location.state.overTimer)[0];
    const quesList = useState(location.state.quesList)[0];
    const userAnsArr = useState(location.state.userAnsArr)[0];
    const [isCorrectArr, setIsCorrectArr] = useState(new Array(quesList.length).fill(''));
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));

// 시간을 '초 , 분, 시' 단위로 반환하는 함수
const formatTime = (count) => {
    const getSeconds = `0${(count % 60)}`.slice(-2);
    const minutes = `${Math.floor(count / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(count / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
}

// 정오를 체크하는 <input type="radio" /> 버튼 클릭 시, 동작하는 함수
const handleRadio = (e, index) => {
    setIsCorrectArr(prevArray => prevArray.map((value, i) => i === index ? e.target.value : value));
}
    
const endTest = (e) => {
    e.preventDefault();
    if (resultID) {
        var url = `http://localhost:5000/results/${resultID}?isFinished=true`;
        var method = "PATCH";
    } else {
        url = `http://localhost:5000/results?isFinished=true`;
        method = "POST";
    }

    var correctAnswerCnt = 0;
    correctAnswerCnt = isCorrectArr.filter((isCorrect) => isCorrect === "true").length;

    var elapsedTime = formatTime(timer + overTimer);

    var questions = quesList.map((question, index) => 
        ({questionID : question.questionID, questionNumber : index + 1, answerInPerson : userAnsArr[index], isCorrect : isCorrectArr[index]})
        );

    if (isCorrectArr.filter((isCorrect) => isCorrect === "").length !== 0) {
        alert('정/오 여부를 빠짐없이 체크하세요.')
        return;
    }

    fetch(url, {
        method: method,
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({examID: examID, correctAnswerCnt: correctAnswerCnt, elapsedTime: elapsedTime, questions: questions}) 
    })
    .then(res => {
        if (res.status === 201) {
            return res.json();
        } else if (res.status === 401) {
            alert("로그인 후 이용이 가능합니다.");
            window.open("http://localhost:3000/login", "_self");
        } else {
            throw new Error("Error");
        }
    })
    .then(res => {
        history.push(`/exam/result/${res.resultID}`);
    })
    .catch(error => console.log(error));
}

const handleNotAuthenticated = () => {
    setLoginSuccess(false);
};

return (
    <>
        <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
        <div className="test_End">
            <div style={{width: '80%', margin: '20px auto'}}>
                <div style={{display: 'inline-block', width: '70%'}}>
                    <div style={{fontSize: '25px', fontWeight: 'bold'}}>📝 진행한 시험명 : {cookies.examName}</div>
                    <div style={{fontSize: '20px', marginTop: '10px'}}>
                        수고하셨습니다. <br/>정/오 여부를 빠짐없이 체크하신 후, 종료 버튼을 클릭하시면 시험이 정상적으로 종료됩니다.
                    </div>
                </div>
                <div style={{float: 'right', fontSize: '20px', verticalAlign: 'center'}}>
                    <div>진행 시간 : {formatTime(timer)}</div>
                    {overTimer !== 0 && <div style={{color: 'red'}}>초과 시간 : {formatTime(overTimer)}</div>}
                </div>
            </div>
            <table className="testEnd_Table">
                <thead>
                    <tr>
                        <th style={{width: '120px'}}>문제 번호</th>
                        <th style={{width: '600px'}}>문제 내용</th>
                        <th style={{width: '120px'}}>정답</th>
                        <th style={{width: '160px'}}>입력 답</th>
                        <th style={{width: '160px'}}>정/오</th>
                    </tr>
                </thead>
                <tbody>
                    {quesList && quesList.map((question, index) =>
                        <tr key = {question.questionID}>
                            <td>{index + 1}</td>
                            <td><img className="testEnd_quesImg" src={question.questionIMG} alt=""/></td>
                            <td>{question.answer}</td>
                            <td>{userAnsArr[index]}</td>
                            <td>
                                <input type="radio" name={"checkAns" + index} className="testEnd_radio" id={"ansTrue" + index} 
                                value="true" onChange={(e) => handleRadio(e, index)} />
                                <label className="label_ansTrue" htmlFor={"ansTrue" + index}>O</label>
                                <input type="radio" name={"checkAns" + index} className="testEnd_radio" id={"ansFalse" + index} 
                                value="false" onChange={(e) => handleRadio(e, index)} />
                                <label className="label_ansFalse" htmlFor={"ansFalse" + index}>X</label>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div style={{textAlign: 'right'}}>
                <button className="testEnd_endBtn" onClick={endTest}>종&nbsp;&nbsp;료</button>
            </div>
        </div>
    </>
    );
}

export default TestEnd;