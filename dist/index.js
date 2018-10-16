"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var IReducer = require('./interfaces/IReducer');
var IEvent = require('./interfaces/IEvent');
var Event_1 = __importDefault(require("./classes/Event"));
var Reducer_1 = __importDefault(require("./classes/Reducer"));
exports.default = {
    Event: Event_1.default,
    Reducer: Reducer_1.default,
    IReducer: IReducer,
    IEvent: IEvent
};
