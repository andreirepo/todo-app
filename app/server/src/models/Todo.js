"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var TodoSchema = new mongoose_1.default.Schema({
    text: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});
var Todo = mongoose_1.default.model('Todo', TodoSchema);
exports.default = Todo;
