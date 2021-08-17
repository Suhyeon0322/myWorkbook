/**  시험 페이지 **/
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Header from '../components/Header';
import './test.css';

const Test = () => {
    const location = useLocation();
    const examID = useParams().examID;
    const resultID = useState(location.state.resultID)[0];
    const [cookies, setCookie] = useCookies(['examName']); // eslint-disable-line no-unused-vars
    const timeLimit = useState(location.state.timeLimit)[0];
    const quesList = useState(location.state.quesList)[0];
    const [quesNo, setQuesNo] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [userAnsArr, setUserAnsArr] = useState(new Array(quesList.length).fill(''));
    const [prevDisabled, setPrevDisabled] = useState(true);
    const [nextDisabled, setNextDisabled] = useState(false);
    const [quesImgFile, setQuesImgFile] = useState(quesList[0].questionIMG);
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));

    const [timer, setTimer] = useState(0);
    const [overTimer, setOverTimer] = useState(0);
    const [isOverTime, setIsOverTime] = useState(false);
    const [isActive, setIsActive] = useState(false); // eslint-disable-line no-unused-vars
    const [isPaused, setIsPaused] = useState(false);
    const countRef = useRef(null);
    const overCountRef = useRef(null);

// 스톱워치 '초, 분, 시' 단위 반환 함수
const formatTime = (count) => {
    const getSeconds = `0${(count % 60)}`.slice(-2);
    const minutes = `${Math.floor(count / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(count / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
}

// 스톱워치 '시작'을 제어함.
useEffect(() => {
    setIsActive(true);
    setIsPaused(true);
    if (!isOverTime) {
        countRef.current = setInterval(() => {
            setTimer((timer) => timer + 1);
        }, 1000);
    } else {
        overCountRef.current = setInterval(() => {
            setOverTimer((overTimer) => overTimer + 1);
        }, 1000);
    }
}, [isOverTime])

// 스톱워치 '일시 정지' 기능 함수
const handlePause = () => {
    if (!isOverTime) {
        clearInterval(countRef.current);
        setIsPaused(false);
    } else {
        clearInterval(overCountRef.current);
        setIsPaused(false);
    }
}

// 스톱워치 '이력서' 기능 함수
const handleResume = () => {
    if (!isOverTime) {
        setIsPaused(true);
        countRef.current = setInterval(() => {
          setTimer((timer) => timer + 1);
        }, 1000);
    } else {
        setIsPaused(true);
        overCountRef.current = setInterval(() => {
            setOverTimer((overTimer) => overTimer + 1);
        }, 1000);
    }
}

// '종료' 버튼 클릭 시 페이지 이동과 동시에 스톱워치를 중단하는 함수
const handleStop = () => {
    if (!isOverTime) {
        clearInterval(countRef.current);
        setIsActive(false);
    } else {
        clearInterval(overCountRef.current);
        setIsActive(false);
    }
}

// 스톱워치의 시작을 제어하고, '문제 사진'을 변경하는 버튼의 동작 여부를 초기에 제어함.
useEffect(() => {
    if (quesNo === 0) {
        setPrevDisabled(true);
    }
    if (quesNo === quesList.length - 1) {
        setNextDisabled(true);
    }
}, [isOverTime, quesNo, quesList.length])

// 스톱워치의 '제한 시간' 초과 여부를 확인함.
useEffect(() => {
    if (timeLimit === formatTime(timer)) {
        clearInterval(countRef.current);
        setIsActive(false);
        setIsOverTime(true);
    }
}, [timeLimit, timer]) 

// '사용자 답안'을 입력한 값으로 설정해주는 함수
const onChangeUserAnswer = (e) => {
    setUserAnswer(e.target.value);
}

// '답안 입력' input에 입력된 값을 사용자 답안 배열에 저장함.
useEffect(() => {
    setUserAnsArr(prevArray => prevArray.map((value, i) => i === quesNo ? userAnswer : value));
}, [userAnswer, quesNo]);

// '문제 사진'을 처음으로 변경하고, 입력 답안을 저장하는 함수를 실행하는 함수
const onChangeFirst = () => {
    setPrevDisabled(false);

    setQuesNo(0);
    setPrevDisabled(true);

    setNextDisabled(false);
    setQuesImgFile(quesList[0].questionIMG);
    setUserAnswer(userAnsArr[0]);
}

// '문제 사진'을 마지막으로 변경하고, 입력 답안을 저장하는 함수를 실행하는 함수
const onChangeLast = () => {
    setNextDisabled(false);

    setQuesNo(quesList.length - 1);
    setNextDisabled(true);

    setPrevDisabled(false);
    setQuesImgFile(quesList[quesList.length - 1].questionIMG);
    setUserAnswer(userAnsArr[quesList.length - 1]);
}

// '문제 사진'을 이전으로 변경하고, 입력 답안을 저장하는 함수를 실행하는 함수
const onChangePrev = () => {
    setPrevDisabled(false);
    setNextDisabled(false);
    setQuesNo(quesNo - 1);

    if (quesNo <= 1) {
        setQuesNo(0);
        setQuesImgFile(quesList[0].questionIMG);
        setUserAnswer(userAnsArr[0]);
        setPrevDisabled(true);
        return;
    }

    setQuesImgFile(quesList[quesNo - 1].questionIMG);
    setUserAnswer(userAnsArr[quesNo - 1]);
}

// '문제 사진'을 다음으로 변경하고, 입력 답안을 저장하는 함수를 실행하는 함수
const onChangeNext = () => {
    setPrevDisabled(false);
    setNextDisabled(false);
    setQuesNo(quesNo + 1);

    if (quesNo >= quesList.length - 2) {
        setQuesNo(quesList.length - 1);
        setQuesImgFile(quesList[quesList.length - 1].questionIMG);
        setUserAnswer(userAnsArr[quesList.length - 1]);
        setNextDisabled(true);
        return;
    }

    setQuesImgFile(quesList[quesNo + 1].questionIMG);
    setUserAnswer(userAnsArr[quesNo + 1]);
}

// '나가기' 버튼 클릭 시 시험 결과를 생성 또는 수정한 후 문제 목록으로 이동하도록 동작하는 함수
const exitTest = () => {
    var alertValue = window.confirm("시험을 정말 중단하시겠습니까?\n중단 시 시험 결과는 저장되지 않습니다.");
    if (alertValue) {
        if (resultID) {
            var url = `http://localhost:5000/results/${resultID}?isFinished=false`;
            var method = "PATCH";
        } else {
            url = `http://localhost:5000/results?isFinished=false`;
            method = "POST";
        }

        fetch(url, {
            method: method,
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify({examID: examID}) 
        })
        .then(res => {
            if (res.status === 201) {
                return res.text();
            } else if (res.status === 401) {
                alert("로그인 후 이용이 가능합니다.");
                window.open("http://localhost:3000/login", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .then(res => {
            console.log(JSON.stringify(res));
            window.open(`/exam/${examID}`, "_self");
        })
        .catch(error => console.log(error));
    }
}

const handleNotAuthenticated = () => {
    setLoginSuccess(false);
};

return (
    <>
    <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
    <div className="test">
        <div className="test_top">
            <h1 className="test_title">"{cookies.examName}" 문제풀이</h1>
            <div className="test_info"> 제한 시간: {timeLimit} <br /> 
            진행: {`0${quesNo + 1}`.slice(-2)}&nbsp;/&nbsp;{`0${quesList.length}`.slice(-2)} </div>
        </div>
        <div style={{height: '100px'}}>
            <div className="test_upperLeft">
                <strong className="test_quesNo">Q&nbsp;{`0${quesNo + 1}`.slice(-2)}</strong>
                <p className="test_timer">진행 {formatTime(timer)}</p>
                {isOverTime && <p className="test_overTimer">+ 초과 {formatTime(overTimer)}</p> }
            </div>
            <div className="test_upperRight">
                    <button className="test_exitBtn" onClick={() => exitTest()}></button>
            </div>
        </div>
        <div className="test_middle">
            <img style={{maxWidth: '70%', maxHeight: '750px'}} src={quesImgFile} alt={quesImgFile} />
            <div style={{textAlign: 'right'}}>
                <label className="label_userAnswer"> 답안 입력 : </label>
                <input type="text" className="input_userAnswer" name="userAnswer" value={userAnswer || ''} onChange={onChangeUserAnswer}/>
            </div>
        </div>
        <div className="test_bottomRight">
            <button className="test_firstBtn" onClick={onChangeFirst} disabled={prevDisabled}>&#124;◁</button>
            <button className="test_prevBtn" onClick={onChangePrev} disabled={prevDisabled}>◁</button>
            <button className="test_nextBtn" onClick={onChangeNext} disabled={nextDisabled}>▷</button>
            <button className="test_lastBtn" onClick={onChangeLast} disabled={nextDisabled}>&#124;▷</button>
            { isPaused ? <button className="test_stopBtn" onClick={handlePause}>일시 중지</button> 
                : <button className="test_restartBtn" onClick={handleResume}>이어서 풀기</button> } <br />
            { quesList.length - 1 === quesNo &&
            <div style={{display: 'inline-block', marginTop: '10px'}}>
                <b style={{fontSize: '20px', color: 'red'}}>*마지막 문제입니다.</b>
                <Link to={{ pathname: `/test/${examID}/end`, 
                state: {resultID: resultID, timer: timer, overTimer: overTimer, quesList: quesList, userAnsArr: userAnsArr} }}> 
                    <button className="test_endBtn" style={{marginBottom: '15px'}} onClick={handleStop}>종&nbsp;&nbsp;료</button>
                </Link>
            </div> }
        </div>
        
    </div>
    </>
    );
}

export default Test;