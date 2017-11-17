"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Client {
    constructor(connectionId, dhMemberId, loginName, title, avatar) {
        this.ConnectionId = connectionId;
        this.Id = dhMemberId;
        this.LoginName = loginName;
        this.Title = title;
        this.Avatar = avatar;
    }
}
exports.Client = Client;
