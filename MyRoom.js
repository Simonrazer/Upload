"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const schema_1 = require("@colyseus/schema");
class Player extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
}
__decorate([
    schema_1.type("number")
], Player.prototype, "x", void 0);
__decorate([
    schema_1.type("number")
], Player.prototype, "y", void 0);
__decorate([
    schema_1.type("number")
], Player.prototype, "z", void 0);
exports.Player = Player;
class State extends schema_1.Schema {
    constructor() {
        super(...arguments);
        this.players = new schema_1.MapSchema();
        this.pc = 0;
        this.something = "This attribute won't be sent to the client-side";
    }
    createPlayer(id) {
        this.players[id] = new Player();
        this.pc++;
        console.log(this.pc);
    }
    removePlayer(id) {
        delete this.players[id];
        this.pc--;
    }
    movePlayer(id, movement) {
        if (movement.x) {
            this.players[id].x = movement.x;
        }
        if (movement.y) {
            this.players[id].y = movement.y;
        }
        if (movement.z) {
            this.players[id].z = movement.z;
        }
    }
}
__decorate([
    schema_1.type({ map: Player })
], State.prototype, "players", void 0);
__decorate([
    schema_1.type("number")
], State.prototype, "pc", void 0);
exports.State = State;
class MyRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        this.maxClients = 4;
        this.patchRate = 10;
    }
    onCreate(options) {
        console.log("StateHandlerRoom created!", options);
        this.setPatchRate(10);
        this.setState(new State());
    }
    onJoin(client) {
        this.state.createPlayer(client.sessionId);
    }
    onLeave(client) {
        this.state.removePlayer(client.sessionId);
    }
    onMessage(client, data) {
        //console.log("StateHandlerRoom received message from", client.sessionId, ":", this.state.players[client.sessionId].x);
        this.state.movePlayer(client.sessionId, data);
    }
    onDispose() {
        console.log("Dispose StateHandlerRoom");
    }
}
exports.MyRoom = MyRoom;
