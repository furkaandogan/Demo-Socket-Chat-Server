"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatAppConfig {
    constructor() {
        this.RedisConfig = {
            host: "redis",
            port: 6379
        };
    }
}
exports.default = new ChatAppConfig();
