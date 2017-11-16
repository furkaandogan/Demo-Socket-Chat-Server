import { Client } from "./Client";

export class Room {
    public PmId: number;
    public ToKey(): string {
        return this.PmId.toString() + "-PM-ROOM";
    }
    constructor(pmId: number) {
        this.PmId = pmId;
    }
}