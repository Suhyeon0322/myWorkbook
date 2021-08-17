const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

const app = express();
dotenv.config();

const index = require('./routes/index');
const auth = require('./routes/auth');
const api = require('./routes/api');
const exam = require('./routes/exam');
const question = require('./routes/question');
const result = require('./routes/result');
const answer = require('./routes/answer');

const authStrategy = require('./config/passport-strategy');

// for parsing application/json
app.use(express.json());
// for parsing application/xwww-form-urlencoded
//app.use(express.urlencoded({ extended: false }));
//session 설정
app.use(session({
  name: 'auth', 
  secret: process.env.COOKIE_AUTH_SECRET,
  resave: false,
  cookie: {
    maxAge: 3600000  //유효시간은 1시간
  }
}));
// initalize passport
app.use(passport.initialize());
app.use(passport.session());
// 클라이언트의 요청을 수락 할 수 있도록 cors 설정
app.use(
  cors({
    //origin: true,
    origin: "http://localhost:3000", // 서버가 다른 출처의 요청을 수락하도록 허용
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // 브라우저의 세션 쿠키가 통과하도록 허용
  })
);

app.use(morgan('dev'));

app.use('/', index);
app.use('/api', api);
app.use('/auth', auth);
app.use('/exam', exam);
app.use('/question', question);
app.use('/results', result);
app.use('/answers', answer);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');

});

module.exports = app;