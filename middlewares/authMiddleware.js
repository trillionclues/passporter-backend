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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT = process.env.JWT_SECRET;
const authMiddleware = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let token;
    if ((_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        if (!JWT) {
            throw new Error("Wrong JWT secret");
        }
        try {
            if (jsonwebtoken_1.default) {
                const decoded = jsonwebtoken_1.default.verify(token, JWT);
                const applicant = yield applicantModel_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id);
                if (applicant) {
                    req.applicant = applicant;
                    next();
                }
            }
        }
        catch (error) {
            next(error);
        }
    }
    else {
        throw new Error("There is no token attached to header");
    }
}));
exports.authMiddleware = authMiddleware;
