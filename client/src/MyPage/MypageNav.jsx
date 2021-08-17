import React from "react";
import '../App.css';

function MypageNav() {
    return (

        <div id="my_nav">
            <h2 className="nav_top">마이페이지</h2>
            <ul className="ul_top">
                <li><a className="li_a_deco" href="/mypage/info">회원정보</a></li>
                <li><a className="li_a_deco" href="/mypage/myLearning">나의 학습 관리</a></li>
            </ul>
        </div>
    );

}

export default MypageNav