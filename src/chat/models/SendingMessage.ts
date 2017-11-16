import { Client } from "./Client";
import { Message } from "./Message";

export class SendingMessage {

    // kimden
    public FromClient: Client;
    // kime
    public ToClient: Array<Client>;
    // mesaj
    public Message: Message;

}