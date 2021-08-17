'use strict';

const mysql = require('mysql2');

const dbConfig = require('../config/database');

const db = mysql.createConnection(dbConfig);
db.connect();

class QuestionStorage {
    //INSERT question data
    static createQuestion(newQuestion) {
        //쿼리문 생성
        let keyStr='', questionMark='';
        let valueArr = [];
        for (const [key, value] of Object.entries(newQuestion)) {
            keyStr += `${key}, `;
            valueArr.push(value);
            questionMark += '?, ';
        }
        const query = `INSERT INTO question(${keyStr}questionID) VALUES (${questionMark}create_PK('ques'));`;        // if (newQuestion.solutionIMG===undefined) {

        return new Promise((resolve, reject)=>{
            db.query(
                query,
                valueArr, 
                (err)=>{
                    if (err) {
                        reject(err);
                    } else {
                        db.query('SELECT lastNo FROM PkInfo WHERE pkName="ques";',
                            (err, result)=>{
                                if (err) {
                                    reject(err);
                                } else {
                                    resolve(result[0]); //TextRow { lastNo: 11 }
                                }
                            });
                    }
                }
            )
        });
    }

    //SELECT questions data
    static getQuestions(examID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `SELECT * FROM question WHERE examID=?;`,
                [examID],
                (err, questions)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(questions);
                    }
                }
            )
        });
    }
    //SELECT question data
    static getQuestion(questionID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `SELECT * FROM question WHERE questionID=?;`, [questionID],
                (err, question)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(question[0]);
                    }
                }
            )
        })
    }
    //SELECT memberID by questionID
    // static getMemberIDByQuestionID(questionID) {
    //     return new Promise((resolve, reject)=>{
    //         db.query(
    //             `SELECT memberID FROM exam WHERE examID=(
    //                 SELECT examID
    //                 FROM question
    //                 WHERE questionID=?);`, 
    //             [questionID], 
    //             (err, memberID)=>{
    //                 if (err) {
    //                     console.log(err);
    //                     reject(err);
    //                 } else {
    //                     resolve(memberID[0].memberID);
    //                 }
    //             });
    //     });
    // }
    //SELECT questionPath, solutionPath
    static getIMGPaths(questionID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `SELECT questionIMG, solutionIMG FROM question WHERE questionID=?`,
                [questionID],
                (err, imgPaths)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(imgPaths[0]);
                    }
                }
            )
        })
    }
    //SELECT questionPath
    static getQuestionPath(questionID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `SELECT questionIMG FROM question WHERE questionID=?`,
                [questionID],
                (err, questionIMG)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(questionIMG[0].questionIMG);
                    }
                }
            )
        })
    }
    //SELECT solutionPath
    static getSolutionPath(questionID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `SELECT solutionIMG FROM question WHERE questionID=?`,
                [questionID],
                (err, solutionIMG)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(solutionIMG[0].solutionIMG);
                    }
                }
            )
        })
    }
    //questionID를 사용해 examID 조회하기
    static async getExamIDByQuestionID(questionID) {
        const query = `SELECT examID FROM question WHERE questionID=?;`;

        return new Promise((resolve, reject)=>{
            db.query(
                query, 
                questionID, 
                (err, examID)=>{
                    if(err) {
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
    //SELECT questionID using examID
    // static async getQuestionID(examID) {
    //     return new Promise((resolve, reject)=>{
    //         const query = `SELECT questionID FROM question WHERE examID=?`;
    //         db.query(
    //             query, 
    //             examID, 
    //             (err, questionID)=>{
    //                 if (err)
    //                     reject(err);
    //                 else {
    //                     if (questionID.length===0)
    //                         resolve(-1);
    //                     else
    //                         resolve(questionID);
    //                 }
    //             }
    //         );
    //     });
    // }

    //UPDATE question data
    static async modifyQuestion(data) {
        //수정 전 img path 저장.
        let imgPaths = {};
        if ('questionIMG' in data&&'solutionIMG' in data) {
            const paths = await this.getIMGPaths(data.questionID);
            imgPaths['questionIMG'] = paths.questionIMG;
            imgPaths['solutionIMG'] = paths.solutionIMG;
        } else if ('questionIMG' in data) {
            imgPaths['questionIMG'] = await this.getQuestionPath(data.questionID);
        } else if ('solutionIMG' in data) {
            imgPaths['solutionIMG'] = await this.getSolutionPath(data.questionID);
        }

        //쿼리문 생성
        let updateQuery = '';
        for (const [key, value] of Object.entries(data)) {
            if (key!=='examID' && key!=='questionID') {
                updateQuery += `${key}='${value}', `;
            }
        }
        updateQuery = updateQuery.substring(0, updateQuery.length-2);
        const query = `UPDATE question SET ${updateQuery} WHERE questionID=?;`;

        //db 실행
        return new Promise((resolve, reject)=>{
            db.query(
                query,  
                data.questionID,
                async (err)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(imgPaths);
                    }
                }
            )
        });
    }

    //DELETE question data
    static removeQuestion(questionID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `DELETE FROM question WHERE questionID=?;`, [questionID], 
                (err, result)=>{
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.affectedRows);
                    }
                }
            )
        })
    }
}

module.exports = QuestionStorage;