import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router';
import {BrowserRouter as Router} from "react-router-dom";

import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';

import Info from './MyPage/Info';
import MyLearning from './MyPage/MyLearning';

import Error404 from './components/Error404';

import ExamRecords from './ExamResult/ExamRecords';
import ExamRecordsDetails from './ExamResult/ExamRecordsDetails';

import ListExamComponent from './exam/ListExamComponent';
import CreateExamComponent from './exam/CreateExamComponent';
import ModifyExamComponent from './exam/ModifyExamComponent';

import ListQuesComponent from './question/ListQuesComponent';
import CreateQuesComponent from './question/CreateQuesComponent';
import ModifyQuesComponent from './question/ModifyQuesComponent';
import InfoQuesComponent from './question/InfoQuesComponent';

import PrepareTest from './test/prepareTest';
import Test from './test/test';
import TestEnd from './test/testEnd';

import Footer from './components/Footer';

function App() {
  return (
    <>
    <Router>
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/login" component={LoginPage} />
          
          <Route exact path="/mypage/info" component={Info} />
          <Route exact path="/mypage/myLearning" component={MyLearning} />

          <Route exact path="/exam/result" component={ExamRecords} />
          <Route exact path="/exam/result/:resultID" component={ExamRecordsDetails} />

          <Route exact path="/exam/list" component={ListExamComponent} />
          <Route exact path="/exam/add" component={CreateExamComponent} />
          <Route exact path="/exam/modify" component={ModifyExamComponent} />

          <Route exact path="/exam/:examID" component={ListQuesComponent} />
          <Route exact path="/question/add" component={CreateQuesComponent} />
          <Route exact path="/question/modify/:questionID" component={ModifyQuesComponent} />
          <Route exact path="/question/:questionID" component={InfoQuesComponent} />

          <Route exact path="/test/:examID/prepare" component={PrepareTest} />
          <Route exact path="/test/:examID" component={Test} />
          <Route exact path="/test/:examID/end" component={TestEnd} />
          
          <Route component={Error404} />
        </Switch>
        <Footer />
    </Router>
    </>
  );
}

export default App;
