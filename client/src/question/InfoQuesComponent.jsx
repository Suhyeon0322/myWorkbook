/**  문제 조회 페이지 **/
import React, {  useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Header from '../components/Header';
import './QuesList.css';

const InfoQuesComponent = () => {
    const location = useLocation();
    const examID = useState(location.state.examID)[0];
    const questionID = useParams().questionID;
    const [answer, setAnswer] = useState('');
    const [quesImgFile, setQuesImgFile] = useState('');
    const [soluImgFile, setSoluImgFile] = useState('');
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));
    const [loading, setLoading] = useState(true);

// 문제 정보를 생성하는 함수
useEffect(() => {
    fetch(`http://localhost:5000/question/${questionID}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials": true,
        },
    })
    .then(res => {
        if (res.status === 200) {
            return res.json();
        } else if (res.status === 401) {
            alert("로그인 후 이용이 가능합니다.");
            window.open("http://localhost:3000/login", "_self");
        } else {
            throw new Error("Error");
        }
    })
    .then(res => {
        console.log(JSON.stringify(res));
        setAnswer(res.answer);
        setQuesImgFile(res.questionIMG);
        setSoluImgFile(res.solutionIMG);
    })
    .catch(error => console.log(error));
    setLoading(false);
}, [questionID]);

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
    <div className="ques_info">
        <div>
            <h3 className="ques_infoTitle">문제 조회</h3>
            <div>
                <form className="ques_form" encType="multipart/form-data">
                    <div style={{marginTop: '15px'}}>
                        <label className="label_quesAnswer"> * 문제 정답 : </label>
                        <h4>{answer}</h4>
                    </div>
                    <div>
                        <label className="label_quesIMG"> * 문제 사진 : </label>
                        { quesImgFile &&
                        <div style={{margin: '10px 0 20px'}}>
                            <img style={{width: '400px', height: '300px'}} src={quesImgFile} alt={quesImgFile} />
                        </div> }
                    </div>
                    <div>
                        <label className="label_soluIMG"> 해설 사진 : </label>
                        { soluImgFile &&
                        <div style={{marginTop: '10px'}}>
                            <img style={{width: '400px', height: '300px'}} src={soluImgFile} alt={soluImgFile} />
                        </div> }
                    </div>
                    <div style={{textAlign: 'right'}}>
                        {/* 페이지 내 '취소' 버튼 클릭 시, 문제 목록 페이지로 이동*/}
                        <Link to={`/exam/${examID}`}>
                            <button className="ques_previousBtn">이전</button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    </div>
    </>
)
};

export default InfoQuesComponent;