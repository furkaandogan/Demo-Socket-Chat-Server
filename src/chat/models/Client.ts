
export class Client {
    public ConnectionId: string;
    public Id: number;
    public LoginName: string;
    public Title: string;
    public Avatar: string;

    constructor(connectionId: string, dhMemberId: number, loginName: string, title?: string, avatar?: string) {
        this.ConnectionId = connectionId;
        this.Id = dhMemberId;
        this.LoginName = loginName;
        this.Title = title;
        this.Avatar = avatar;
    }


}