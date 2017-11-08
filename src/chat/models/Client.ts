
export class Client 
{
    public ConnectionId:string;
    public DhMemberId:number;

    constructor(connectionId:string,dhMemberId:number){
        this.ConnectionId=connectionId;
        this.DhMemberId=dhMemberId;
    }
    
}