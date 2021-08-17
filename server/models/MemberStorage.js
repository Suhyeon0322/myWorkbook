'use strict';

const mysql = require('mysql2');

const dbConfig = require('../config/database');

const db = mysql.createConnection(dbConfig);
db.connect();

class MemberStorage {
    //Select member data
    static getMember(identifier) {
        return new Promise((resolve, reject)=>{
            db.query(`SELECT * FROM member WHERE identifier=?`, [identifier], (err, member, fields)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(member);
                }
            });
        });
    }

    //INSERT member data
    static createMember(profileInfo) {
        return new Promise((resolve, reject)=>{
            db.query(
                `INSERT INTO member(memberID, memberName, identifier, socialType, memberEmail) 
                    VALUES (create_PK('memb'), ?, ?, ?, ?)`, 
                [profileInfo.memberName, profileInfo.identifier, profileInfo.socialType, profileInfo.memberEmail], 
                (err)=>{
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    //DELETE member data
    static deleteMember(memberID) {
        return new Promise((resolve, reject)=>{
            db.query(
                `DELETE FROM member WHERE memberID=?`, memberID, function(err, result, fields) {
                    if (err) {
                        reject(err);
                    } else if(result.affectedRows===0) {    //삭제될 유저가 없을 경우.(front에서 요청데이터를 잘못 보냈을 경우)
                        reject("member 존재하지 않음.");
                    } else {
                        resolve(true);
                    }
                });
        });
    }
}

module.exports = MemberStorage;