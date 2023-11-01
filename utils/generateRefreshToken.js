"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mySecret = process.env.JWT_SECRET;
const generateRefreshToken = (id) => {
    if (!mySecret) {
        throw new Error("Wrong JWT secret");
    }
    return jsonwebtoken_1.default.sign({ id }, mySecret, { expiresIn: "3d" }); // 72hrs
};
exports.generateRefreshToken = generateRefreshToken;
