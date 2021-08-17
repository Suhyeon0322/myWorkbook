import React, { Component } from "react";
import "../App.css";

export class Error404 extends Component {
    state = {
        user: {},
        error: null,
        authenticated: false
      };

    connectMainPage() {
        window.open("http://localhost:3000/", "_self");
    }

    render() {
        return(
            <div style={{textAlign: "center", height: "650px"}}>
                <div className="error_img"></div>
                <h1 className="error_text">
                요청하신 페이지가 없습니다.<br /></h1>
                <button onClick={this.connectMainPage} className="error_btn">메인 페이지로 이동</button>
            </div>
        );
    }
}

export default Error404;