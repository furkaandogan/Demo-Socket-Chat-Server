"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    ToKey() {
        return this.PmId.toString() + "-PM-ROOM";
    }
    constructor(pmId) {
        this.PmId = pmId;
    }
}
exports.Room = Room;
