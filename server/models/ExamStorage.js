'use strict';

const mysql = require('mysql2');

const dbConfig = require('../config/database');

const db = mysql.createConnection(dbConfig);
db.connect();

class ExamStorage {
    // 회원의 시험 목록을 받아오는 query문.
    static getAllExams(memberID) {
        return new Promise((resolve, reject)=>{
            db.query(`SELECT examID, examName, timeLimit FROM exam WHERE memberID=? ORDER BY examID;`, [memberID], (err, exams, fields)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(exams);
                }
            });
        });
    }

    //검색한 memberID와 examID에 존재하는 데이터가 있는지 확인하는 query.
    static examExists(memberID, examID) {
        return new Promise((resolve, reject)=>{
            const query = `SELECT EXISTS(SELECT * FROM exam WHERE memberID=? AND examID=?) AS hasExam;`;
            db.query(
                query, 
                [memberID, examID],
                (err, hasExam)=>{
                    if (err)
                        reject(err);
                    else
                        resolve(hasExam[0].hasExam);
                }
            )
        })
    }

    //questionID를 이용해 exam 테이블의 memberID를 조회하는 query
    static getMemberIDByquestionID(questionID) {
        return new Promise((resolve, reject)=>{
            const query = `SELECT memberID
            FROM exam 
            WHERE examID=(
                SELECT examID 
                FROM question 
                WHERE questionID=?);`;
            db.query(
                query, 
                questionID, 
                (err, memberID)=>{
                    if (err)
                        reject(err);
                    else if (memberID.length===0) {
                        resolve(-1);
                    } else {
                        resolve(memberID[0].memberID);
                    }
            });
        });
    }

    //가장 최근에 생성된 5개의 시험 폴더를 조회하는 쿼리문
    static getRecentCretedExams(memberID) {
        return new Promise((resolve, reject)=>{
            const query = `SELECT examID, examName 
                            FROM exam WHERE memberID=? 
                            ORDER BY createDate_exam DESC 
                            LIMIT 5;`;
            db.query(
                query, 
                memberID,
                (err, exams)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(exams);
                    }
                }
            )
        })
    } 
    
    //examID를 가지고 memberID 조회
    static getMemberIDByExamID(examID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `SELECT memberID FROM exam WHERE examID=?`,
                [examID],
                (err, memberID)=>{
                    if (err)
                        reject(err);
                    else
                        resolve(memberID);
                }
            )
        })
    }
    //examID를 이용해 examName 조회하기
    static getNamesByExamID(examIDs) {
        const query = `SELECT examName FROM exam WHERE examID=?;`;
        return new Promise((resolve, reject)=>{
            db.query(
                query, 
                examIDs, 
                (err, name)=>{
                    if (err)
                        reject(err);
                    else 
                        resolve(name[0].examName);
                }
            )
        })
    }
    //examID를 이용해 timeLimit 조회하기
    static getTimeLimitByExamID(examID) {
        const query = 'SELECT timeLimit FROM exam WHERE examID=?;';
        return new Promise((resolve, reject)=>{
            db.query(
                query, 
                examID,
                (err, timeLimit)=>{
                    if (err)
                        reject(err);
                    else
                        resolve(timeLimit[0].timeLimit);
                }
            )
        })
    }
    //가장 최근에 생성된 5개 exam 데이터(examID, examName)을 조회하는 쿼리문
    static getRecentCreateExams(memberID) {
        return new Promise((resolve, reject)=>{
            const query = `SELECT examID, examName FROM exam WHERE memberID=? ORDER BY createDate_exam DESC LIMIT 5;`;
            db.query(
                query, 
                memberID, 
                (err, exams)=>{
                    if (err)
                        reject(err);
                    else
                        resolve(exams);
                }
            )
        })
    }
    
    //시험 폴더를 생성하는 query문.
    static createExam(newExamInfo) {
        return new Promise((resolve, reject)=>{
            db.query(
                `INSERT INTO exam(examID, examName, timeLimit, memberID) VALUES (create_PK('exam'), ?, ?, ?);`, 
                [newExamInfo.examName, newExamInfo.timeLimit, newExamInfo.memberID], 
                (err)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
            });
        });
    }
    //시험 폴더를 삭제하는 쿼리문.
    static deleteExam(examID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `DELETE FROM exam WHERE examID=?;`, 
                examID, 
                (err)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
            });
        });
    }
    //시험 폴더를 수정하는 쿼리문.
    static updateExam(updatedInfo) {
        let setStr = '';
        let valueArr = [];

        if (updatedInfo.info.timeLimit==='') {
            updatedInfo.info.timeLimit = null
        }

        for (const [key, value] of Object.entries(updatedInfo.info)) {
            setStr += `${key}=?, `;
            valueArr.push(value);
        }
       
        const query = `UPDATE exam SET ${setStr}modifyDate_exam=Now() WHERE examID=?;`
        valueArr.push(updatedInfo.examID);

        return new Promise((resolve, reject)=>{
            db.query(
                query,
                valueArr,
                (err)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
            });
        });
    }
}

module.exports = ExamStorage;