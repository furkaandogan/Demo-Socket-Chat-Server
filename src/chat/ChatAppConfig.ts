import { IAppConfig } from "../IAppConfig";

class ChatAppConfig implements IAppConfig {
    public RedisConfig: any;

    constructor() {
        this.RedisConfig = {
            host: "46.45.154.93",
            port: 6379,
            password : ';mgeEcVyLaTBLmrKhNjs7qQXQ?7j;{7M2ufty2eQ'
        };
    }
}

export default new ChatAppConfig() 