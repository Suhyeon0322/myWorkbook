'use strict';

const mysql = require('mysql2');

const dbConfig = require('../config/database');

const db = mysql.createConnection(dbConfig);
db.connect();

class ResultStorage {
    //하나의 시험 결과 데이터 조회하기
    static getResult(resultID) {
        const query = `SELECT r.resultID, e.examName, r.elapsedTime, r.test_date, r.correctAnswerCnt
                    FROM result AS r JOIN exam As e ON r.examID=e.examID
                    WHERE r.resultID=?;`;

        return new Promise((resolve, reject)=>{
            db.query(query, resultID, (err, result)=>{
                if (err)
                    reject(err);
                else if (result.length===0)
                    resolve(result.length);
                else
                    resolve(result[0]);
            });
        });
    }

    //사용자의 모든 시험 결과 데이터 조회하기
    static getResults(memberID) {
        const query = `SELECT r.resultID, e.examName, r.test_date, r.elapsedTime, r.correctAnswerCnt
                    FROM result AS r JOIN exam As e ON r.examID=e.examID
                    WHERE r.memberID=? AND r.isFinished=1
                    ORDER BY r.test_date DESC;`

        return new Promise((resolve, reject)=>{
            db.query(query, memberID, (err, results)=>{
                if (err) 
                    reject(err);
                else if (results.length===0)
                    resolve(results.length);
                else
                    resolve(results);
            })
        })
    }

    //가장 최근에 진행한 결과 데이터 조회하기
    static getRecentResult(memberID) {
        const query = `SELECT r.resultID, e.examID, e.examName, r.elapsedTime, r.isFinished 
                        FROM result AS r
                        JOIN exam AS e
                        ON e.examID = r.examID
                        WHERE r.memberID=? 
                        ORDER BY r.test_date DESC 
                        LIMIT 1;`;

        return new Promise((resolve, reject)=>{
            db.query(
            query, 
            memberID, 
            (err, result)=>{
                if (err) {
                    reject(err);
                } else if (result.length===0) {
                    resolve(-1);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }

    //가장 최근에 종료된 3개의 시험 데이터 가져오기
    static getFinishedResults(memberID) {
        const query = `SELECT r.resultID, e.examName, r.elapsedTime
                        FROM result AS r
                        JOIN exam AS e
                        ON e.examID = r.examID
                        WHERE r.memberID=? AND r.isFinished=true
                        ORDER BY r.test_date DESC 
                        LIMIT 3;`;

        return new Promise((resolve, reject)=>{
            db.query(
                query, 
                memberID,
                (err, results)=>{
                    if (err)
                        reject(err);
                    else if(results.length===0)
                        resolve(-1);
                    else
                        resolve(results);
                }
            );
        });
    }

    //방금 생성된 시험 결과 데이터의 resultID 조회하기
    static getLastCreatedResultID(examID) {
        const query = `SELECT resultID
                        FROM result
                        WHERE examID=?
                        ORDER BY test_date DESC
                        LIMIT 1;`;
        return new Promise((resolve, reject)=>{
            db.query(query, 
                examID, 
                (err, resultID)=>{
                    if (err)
                        reject(err);
                    else
                        resolve(resultID[0].resultID);
                })
        })
    }

    //resultID를 이용해 memberID 조회하기
    static getMemberIDByResultID(resultID) {
        const query = `SELECT memberID FROM result WHERE resultID=?`;
        return new Promise((resolve, reject)=>{
            db.query(
                query, 
                resultID, 
                (err, memberID)=>{
                    if (err)
                        reject(err);
                    else {
                        if (memberID.length===0) {
                            resolve(-1);
                        } else {
                            resolve(memberID[0].memberID);
                        }
                    }
                }
            )
        })
    }

    //resultID를 이용해 examID 조회하기
    static getExamIDByResultID(resultID) {
        const query = `SELECT examID FROM result WHERE resultID=?;`;
        
        return new Promise((resolve, reject)=>{
            db.query(
                query, 
                resultID, 
                (err, examID)=>{
                    if (err) {
                        reject(err);
                    } else {
                        if (examID.length===0) {
                            resolve(-1);
                        } else {
                            resolve(examID[0].examID);
                        }
                    }
                }
            )
        })
    }

    //시험 결과 테이블 생성하기
    static addResult(newResult) {
        let query = '';
        if (newResult.isFinished===1) {
            query = `INSERT INTO result(resultID, examID, memberID, correctAnswerCnt, elapsedTime, isFinished) VALUES 
            (create_PK('resu'), ?, ?, ?, ?, ?);`;
        } else {
            query = `INSERT INTO result(resultID, examID, memberID, isFinished) VALUES (create_PK('resu'), ?, ?, ?);`;
        }
        const params = Object.values(newResult);

        return new Promise((resolve, reject)=>{
            db.query(query, params, (err, result)=>{
                if (err)
                    reject(err);
                else if (result.affectedRows===0)
                    resolve(-1);
                else
                    resolve(newResult.examID); 
            });
        });
    }

    //시험 결과 수정하기
    static modifyResult(modifiedData) {
        //쿼리문 작성.
        let query = '';
        let params;
        if (modifiedData.isFinished===1) {  //맞은개수, 소요시간, 종료여부, 시험날짜  수정.
            query = `UPDATE result SET 
                    correctAnswerCnt=?, elapsedTime=?, isFinished=?, test_date=NOW()
                    WHERE resultID=?;`;
            params = Object.values(modifiedData);
        } else {     //시험날짜 수정.
            query = `UPDATE result SET test_date=NOW() WHERE resultID=?;`;
            params = modifiedData.resultID;
        }

        //DB에서 update 실행.
        return new Promise((resolve, reject)=>{
            db.query(query, params, (err, result)=>{
                if (err) 
                    reject(err);
                else
                    resolve(result.affectedRows);
            });
        });
    }

    static removeResult(resultID) {
        const query = `DELETE FROM result WHERE resultID=?;`;

        return new Promise((resolve, reject)=>{
            db.query(query, resultID, (err, result)=>{
                if (err)
                    reject(err);
                else
                    resolve(result.affectedRows);
            });
        });
    }
}

module.exports = ResultStorage;