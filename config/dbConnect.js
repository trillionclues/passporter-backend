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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mySecret = process.env.MONGODB_URL;
// connect to mongodb
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!mySecret) {
        throw new Error("MONGODB_URL is not defined in your environment variables.");
    }
    try {
        const conn = yield mongoose_1.default.connect(mySecret);
        console.log("Connected to Database!");
    }
    catch (error) {
        throw new Error(`Error connecting to MongoDB: ${error}`);
    }
});
exports.default = dbConnect;
