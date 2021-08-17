import React, { Component } from "react";
import "../App.css";

export default class LoginPage extends Component {
    state = {
      user: {},
      error: null,
      success: false
    };

    NaverLogin () {
        window.location.href = 'http://localhost:5000/auth/naver'
    }

    GoogleLogin () {
        window.location.href = 'http://localhost:5000/auth/google'
    }

    render() {
        
        return(
            <>
            <div style={{height: "100%"}}>
                <div className='center'>
                    <div className="log_box" style={{padding: '30px'}}>
                        <h2>나만의 문제집 로그인</h2>
                        <h4 style={{marginBottom: '50px'}}>기존에 사용하시는 계정으로 간단하게 로그인 하세요</h4>
        
                        
                        <button onClick={this.NaverLogin} className="Nbutton"></button>
                        <button onClick={this.GoogleLogin} className="Gbutton"></button>

                    </div>
                </div>
            </div>
            </>
        );
    }
}