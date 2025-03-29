"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var express_validator_1 = require("express-validator");
var Todo_1 = __importDefault(require("../models/Todo"));
var router = (0, express_1.Router)();
// @route   GET api/todos
// @desc    Get all todos
// @access  Public
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var todos, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Todo_1.default.find().sort({ date: -1 })];
            case 1:
                todos = _a.sent();
                res.json(todos);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// @route   POST api/todos
// @desc    Create a todo
// @access  Public
router.post('/', [(0, express_validator_1.check)('text', 'Todo description is required').not().isEmpty()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, newTodo, todo, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                newTodo = new Todo_1.default({ text: req.body.text });
                return [4 /*yield*/, newTodo.save()];
            case 2:
                todo = _a.sent();
                res.json(todo);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log(err_2.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @route   POST api/todos/:id/completed
// @desc    Mark todo as completed
// @access  Public
router.post('/:id/completed', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var todo, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Todo_1.default.findById(req.params.id)];
            case 1:
                todo = _a.sent();
                if (!todo) {
                    res.status(404).json({ msg: 'Todo not found' });
                    return [2 /*return*/];
                }
                if (todo.isCompleted) {
                    res.status(400).json({ msg: 'Todo already completed' });
                    return [2 /*return*/];
                }
                todo.isCompleted = true;
                return [4 /*yield*/, todo.save()];
            case 2:
                _a.sent();
                res.json(todo);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log(err_3.message);
                if (err_3.kind === 'ObjectId') {
                    res.status(404).json({ msg: 'Invalid ID format' });
                    return [2 /*return*/];
                }
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @route   DELETE api/todos/:id
// @desc    Delete a todo
// @access  Public
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var todo, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, Todo_1.default.findById(req.params.id)];
            case 1:
                todo = _a.sent();
                if (!todo) {
                    res.status(404).json({ msg: 'Not Found' });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, todo.deleteOne()];
            case 2:
                _a.sent();
                res.json({ msg: 'Successfully Removed', id: req.params.id });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.log(err_4.message);
                res.status(500).json({
                    error: 'Server Error',
                    details: err_4.message
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// @route   PUT api/todos/:id
// @desc    Update todo
// @access  Public
router.put('/:id', [(0, express_validator_1.check)('text', 'Todo description is required').not().isEmpty()], function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, text, isCompleted, todoFields, todo, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    res.status(400).json({ errors: errors.array() });
                    return [2 /*return*/];
                }
                _a = req.body, text = _a.text, isCompleted = _a.isCompleted;
                todoFields = {};
                if (text)
                    todoFields.text = text;
                if (typeof isCompleted === 'boolean')
                    todoFields.isCompleted = isCompleted;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, Todo_1.default.findByIdAndUpdate(req.params.id, { $set: todoFields }, { new: true })];
            case 2:
                todo = _b.sent();
                if (!todo) {
                    res.status(404).json({ msg: 'Not Found' });
                    return [2 /*return*/];
                }
                res.json(todo);
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                console.log(err_5.message);
                res.status(500).send('Server Error');
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
