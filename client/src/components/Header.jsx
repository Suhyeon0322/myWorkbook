// import { withRouter } from 'react-router-dom';
import PropTypes from "prop-types";
import React, { Component } from "react";
import '../App.css';

export default class Header extends Component {
    static propTypes = {
        success: PropTypes.bool.isRequired
    };

    render() {
        const { success } = this.props;
        const memberName = window.sessionStorage.getItem("memberName");
        
        return (
            <div>
                <nav>
                    {success ? (
                        <ul>  
                            <li className="home" onClick={this._LoadMainPage}><p>나만의 문제집</p></li>
                            <li className="dropdown">
                                <div className="dropdown_menu">마이페이지</div>
                                <div className="dropdown_content">
                                    <a href="/mypage/info">회원 정보</a>
                                    <a href="/mypage/myLearning">나의 학습 관리</a>
                                </div>
                            </li>
                            <li className="header_menu" onClick={this._handleLogoutClick}><p>로그아웃</p></li>
                            <li className="header_menu_name" style={{marginTop: "22px"}}>{memberName}님</li>
                        </ul>
                        
                    ) : (
                        <ul>
                            <li className="home" onClick={this._LoadMainPage}><p>나만의 문제집</p></li>
                            <li className="header_menu" style={{paddingRight: "150px"}} onClick={this._handleSignInClick}><p>Login</p></li>
                        </ul>
                        
                    )}
                </nav>
            </div>
        );
    }

    _handleSignInClick = () => {
        // 로그인페이지 연결
        window.open("http://localhost:3000/login", "_self");
    };

    _handleLogoutClick = () => {
        // 로그아웃 페이지 연결
        window.open("http://localhost:5000/auth/logout", "_self");
        sessionStorage.clear();
        this.props._handleNotAuthenticated(); //success를 false로 설정
    };

    _LoadMyPage = () => {
        //마이페이지 연결
        window.open("http://localhost:3000/mypage/info", "_self");
    }

    _LoadMainPage = () => {
        // 메인페이지 연결
        window.open("http://localhost:3000/", "_self");
    }
}