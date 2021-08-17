'use strict';

const MemberStorage = require("./MemberStorage");

class Member {
    constructor(profileInfo) {
        this.profileInfo = profileInfo;
    }

    //member SELECT
    async getMember() {
        try {
            const member = await MemberStorage.getMember(this.profileInfo.identifier);
            return { success: true, member: member };
        } catch(err) {
            return { success: false, msg: err };
        }
    };

    //member INSERT
    async createMember() {
        try {
            const isCreatedMember = await MemberStorage.createMember(this.profileInfo);
            return { success: true};
        } catch(err) {
            return { success: false, msg: err };
        }
    }

    //member DELETE
    async deleteMember() {
        try {
            const isDeleted = await MemberStorage.deleteMember(this.profileInfo);
            return { success: true };
        } catch(err) {
            return { success: false, msg: err };
        }
    }
}

module.exports = Member;