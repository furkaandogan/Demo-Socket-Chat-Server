import { IAppConfig } from "../IAppConfig";

class ChatAppConfig implements IAppConfig {
    public RedisConfig: any;

    constructor() {
        this.RedisConfig = {
            host: "redis",
            port: 6379
        };
    }
}

export default new ChatAppConfig() 