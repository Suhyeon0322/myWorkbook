'use strict';

const mysql = require('mysql2');

const dbConfig = require('../config/database');
const db = mysql.createConnection(dbConfig);
db.connect();

class AnswerStorage {
    //답안지 테이블에 데이터 저장하기.
    static addAnswer(newAnswers) {
        const query = `INSERT INTO answer(questionID, questionNumber, answerInPerson, isCorrect, resultID) VALUES ?`;

        return new Promise((resolve, reject)=>{
            db.query(query, [newAnswers], (err, result)=>{
                if (err)
                    reject(err);
                else 
                    resolve(result.affectedRows);
            });
        });
    }

    //전달 받은 resultID를 이용해 답안지 테이블의 questionNumber, answerInPerson, 문제테이블의 questionIMG, answer, solutionIMG 조회
    static getAnswerDetails(resultID) {
        const query = `SELECT a.questionNumber, q.questionIMG, a.answerInPerson, q.answer, a.isCorrect, q.solutionIMG
                    FROM answer AS a JOIN question AS q ON a.questionID=q.questionID
                    WHERE a.resultID=?
                    ORDER BY a.questionNumber;`
        
        return new Promise((resolve, reject)=>{
            db.query(query, resultID, (err, answerDetails)=>{
                if (err)
                    reject(err);
                else if (answerDetails.length===0)
                    resolve(answerDetails.length);
                else
                    resolve(answerDetails);
            });
        });
    }

    //답안지 테이블의 데이터 조회하기.
    static getAnswer(resultID, questionID) {
        const query = `SELECT answerInPerson FROM answer WHERE resultID=? AND questionID=?;`;

        return new Promise((resolve, reject)=>{
            db.query(
                query, 
                [resultID, questionID], 
                (err, answer)=>{
                    if (err) {
                        reject(err);
                    } else {
                        if (answer.length===0) {
                            resolve(-1);
                        } else {
                            resolve(answer[0]);
                        }
                    }
                }
            )
        })
    }
}

module.exports = AnswerStorage;