import Header from "./Header";
import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class MainPage extends Component {
    state = {
      user: {},
      error: null,
      success: false
    };

    componentDidMount() {
        fetch("http://localhost:5000/auth/login/success", {
            method: "GET",
            credentials: "include",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Access-Control-Allow-Credentials": true
            }
        })
        .then(response => {
          if (response.status === 200) return response.json();
            throw new Error("failed to authenticate user");
        })
        .then(responseJson => {
          if(responseJson) {
            sessionStorage.setItem('success', responseJson.success);
            sessionStorage.setItem('memberID', responseJson.user[0].memberID);
            sessionStorage.setItem('memberName', responseJson.user[0].memberName);
            sessionStorage.setItem('createDate_member', responseJson.user[0].createDate_member.substr(0,10));
            sessionStorage.setItem('socialType', responseJson.user[0].socialType);
          }
          this.setState({
            success: true,
            user: responseJson.user
          });
        })
        .catch(error => {
          this.setState({
            success: false,
            error: "Failed to authenticate user"
          });
        });
    }

    render() {
        const { success } = this.state;
        return (
          <div>
            <Header
                success={ success }
                handleNotAuthenticated={this._handleNotAuthenticated}
            />
            <div className="main_img">
              <div className="main_content">
                <div>
                  { success ? (
                    <div>
                      <h1>자주 틀리는 문제만 골라서<br />나만의 문제집으로</h1> 
                      <h3>{this.state.user[0].memberName}님 환영합니다.</h3>
                      <Link to="/exam/list">
                        <button className="mainButton"></button>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <div style={{fontSize:'12mm', fontWeight:'bold', marginLeft: '20px'}}>자주 틀리는 문제만 골라서<br/>나만의 문제집으로</div>
                      <div className="main_deco1"></div>
                      <div className="main_text1" style={{marginTop: "20px"}}>➰ 문제를 반복해서 풀다가 문제 순서를 외웠을 땐</div>
                      <div className="main_text1" style={{marginTop: "10px"}}>➰ 틀린 문제만 모아서 공부하고 싶을 땐</div>
                      <div className="main_text2">〰 나만의 문제집 〰</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  
    _handleNotAuthenticated = () => {
      this.setState({ success: false });
    };
  }