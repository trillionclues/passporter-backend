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
exports.handleApplicantLogout = exports.handleTokenRefresh = exports.handleUpdateApplicant = exports.handleDeleteApplicant = exports.handleApplicantLogin = exports.handleGetOneApplicant = exports.handleGetAllApplicants = exports.createApplicant = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const applService_1 = require("../services/Applicant/applService");
const jwtToken_1 = require("../utils/jwtToken");
const createApplicant = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicantData = req.body;
        const newApplicant = yield (0, applService_1.createNewApplicant)(applicantData);
        res.json(newApplicant);
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.createApplicant = createApplicant;
const handleApplicantLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicant = yield (0, applService_1.applicantLogin)(req.body);
        res.cookie("refreshToken", applicant.refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000, // 72hrs
        });
        res.json({
            _id: applicant._id,
            firstname: applicant.firstname,
            lastname: applicant.lastname,
            token: (0, jwtToken_1.generateToken)(applicant._id),
        });
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.handleApplicantLogin = handleApplicantLogin;
const handleTokenRefresh = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookie = req.cookies;
        // console.log(cookie);
        if (!(cookie === null || cookie === void 0 ? void 0 : cookie.refreshToken))
            throw new Error("No refresh token found in cookie!");
        const refreshToken = cookie.refreshToken;
        const result = yield (0, applService_1.tokenRefresh)(refreshToken);
        res.json({ result });
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.handleTokenRefresh = handleTokenRefresh;
const handleApplicantLogout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    try {
        const result = yield (0, applService_1.logoutApplicant)(refreshToken);
        if (result.success) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            res.json({ message: result.message });
        }
        else {
            res.status(400).json({ error: result.message });
        }
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.handleApplicantLogout = handleApplicantLogout;
const handleGetAllApplicants = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicants = yield (0, applService_1.getAllApplicants)();
        res.json(applicants);
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.handleGetAllApplicants = handleGetAllApplicants;
const handleGetOneApplicant = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applicantId = req.params;
    //   console.log(applicantId);
    try {
        const getApplicant = yield (0, applService_1.getOneApplicant)(applicantId);
        res.json({ getApplicant });
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.handleGetOneApplicant = handleGetOneApplicant;
const handleDeleteApplicant = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const applicantId = req.params;
    try {
        const deleted = yield (0, applService_1.deleteApplicant)(applicantId);
        res.json({ deleted });
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.handleDeleteApplicant = handleDeleteApplicant;
const handleUpdateApplicant = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const updated = yield (0, applService_1.updateApplicant)(data);
        res.json(updated);
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.handleUpdateApplicant = handleUpdateApplicant;
