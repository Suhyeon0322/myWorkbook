import React, { useState, useEffect } from 'react';
import Header from "../components/Header";
import MypageNav from "./MypageNav";
import "./MyPage.css";


function Info() {
    const memberName = window.sessionStorage.getItem("memberName");
    const createDate_member = window.sessionStorage.getItem("createDate_member");
    const socialType = window.sessionStorage.getItem("socialType");
    const [LoginSuccess, setLoginSuccess] = useState(JSON.parse(sessionStorage.getItem('success')));
    const [loading, setLoading] = useState(true);

    const handleNotAuthenticated = () => {
        setLoginSuccess(false);
    };

    useEffect(() => {
        fetch("http://localhost:5000/auth/login/success", {
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
            } else if (res.status === 401) {
                alert("로그인 후 이용이 가능합니다.");
                window.open("http://localhost:3000/login", "_self");
            } else {
                throw new Error("Error");
            }
        })
        .catch(error => console.log(error));
        setLoading(false);   
    }, [])


    if (loading) return <div>
                            <div className="loading"></div>
                            <div style={{textAlign: "center", color: "purple"}}>Loading º º º</div>
                        </div>


    return (
        <div>
            <Header success={ LoginSuccess } handleNotAuthenticated={handleNotAuthenticated} />
            <MypageNav />

            <div className="info_box">
                <h1 style={{textAlign: "center", fontSize: "10mm"}}>회원정보</h1>
                <div className="user_box">
                    <i className='user_icon'></i>
                    <div style={{marginTop: "80px"}}>
                        {memberName}님의 회원정보 입니다.<br />
                        개인정보 취급 방침에 따라 회원님의 정보는 안전하게 보호되며,<br />
                        {memberName}님의 동의 없이 공개 또는 제3자에게 제공되지 않습니다.
                    </div>
                </div>
                <h2 style={{paddingLeft: '30px', fontSize: "6mm"}}>기본정보</h2>
                <h3 className="info_text">이름 : {memberName}</h3>
                <h3 className="info_text">가입일 : {createDate_member}</h3>
                <h3 className="info_text">계정타입 : {socialType}</h3>

                <button onClick={QuitMember} className="quit_btn"></button>
                
            </div>
        </div>
    );
}


const QuitMember = () => {
    var selectResult = window.confirm("정말 탈퇴하시겠습니까?");
    console.log(selectResult);
    if(selectResult) {
        const memberID = window.sessionStorage.getItem("memberID");
        // 탈퇴시 정보 삭제
        fetch(`http://localhost:5000/auth/remove/${memberID}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": true,
                }
        })
        .then(res => {
            if (res.status === 200) {
                alert("안전하게 탈퇴되었습니다.");
                window.open("http://localhost:5000/auth/logout", "_self");
                return res.json();
            } else if (res.status === 401) {
                alert("로그인 후 이용이 가능합니다.");
                window.open("http://localhost:3000/login", "_self");
                return res.json();
            }
        })
        .catch(error => console.log(error));
    }
}



export default Info;