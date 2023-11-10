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
exports.logoutApplicant = exports.tokenRefresh = exports.updateApplicant = exports.deleteApplicant = exports.applicantLogin = exports.getOneApplicant = exports.getAllApplicants = exports.createNewApplicant = void 0;
const applicantModel_1 = __importDefault(require("../../models/applicantModel"));
const validateMongoDBId_1 = require("../../utils/validateMongoDBId");
const generateRefreshToken_1 = require("../../utils/generateRefreshToken");
const jwtToken_1 = require("../../utils/jwtToken");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createNewApplicant = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const email = body.email;
    const findApplicant = yield applicantModel_1.default.findOne({ email: email });
    if (!findApplicant) {
        const newApplicant = yield applicantModel_1.default.create(body);
        return newApplicant;
    }
    else {
        throw new Error("Applicant already exist");
    }
});
exports.createNewApplicant = createNewApplicant;
const applicantLogin = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = data;
    const findApplicant = yield applicantModel_1.default.findOne({ email });
    if (findApplicant && (yield findApplicant.isPasswordMatched(password))) {
        const refreshToken = yield (0, generateRefreshToken_1.generateRefreshToken)(findApplicant === null || findApplicant === void 0 ? void 0 : findApplicant._id);
        const updatedApplicant = yield applicantModel_1.default.findByIdAndUpdate(findApplicant === null || findApplicant === void 0 ? void 0 : findApplicant._id, {
            refreshToken: refreshToken,
        }, {
            new: true,
        });
        return {
            _id: findApplicant === null || findApplicant === void 0 ? void 0 : findApplicant._id,
            firstname: findApplicant === null || findApplicant === void 0 ? void 0 : findApplicant.firstname,
            lastname: findApplicant === null || findApplicant === void 0 ? void 0 : findApplicant.lastname,
            token: (0, jwtToken_1.generateToken)(findApplicant === null || findApplicant === void 0 ? void 0 : findApplicant._id),
            refreshToken,
        };
    }
    else {
        throw new Error("Invalid credentials!");
    }
});
exports.applicantLogin = applicantLogin;
const tokenRefresh = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const findApplicant = yield applicantModel_1.default.findOne({ refreshToken });
    if (!findApplicant)
        throw new Error("No refresh token found in DB");
    // Verify token with jwt
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET)
        throw new Error("Wrong JWT secret code");
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err || findApplicant.id !== (decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                reject("There is something wrong with the refresh token!");
            }
            // Generate a new access token
            const accessToken = yield (0, jwtToken_1.generateToken)(findApplicant._id);
            resolve({ accessToken });
        }));
    });
});
exports.tokenRefresh = tokenRefresh;
const logoutApplicant = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    if (!refreshToken) {
        return { success: true };
    }
    // ...find exact user and clear cookie
    const updatedResult = yield applicantModel_1.default.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
    if (updatedResult) {
        return { success: true, message: "Applicant successfully logged out!" };
    }
    else {
        return { success: false, message: "Logout failed" };
    }
});
exports.logoutApplicant = logoutApplicant;
const getAllApplicants = () => __awaiter(void 0, void 0, void 0, function* () {
    const applicant = yield applicantModel_1.default.find();
    return applicant;
});
exports.getAllApplicants = getAllApplicants;
const getOneApplicant = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = data;
    (0, validateMongoDBId_1.validateMongoDBId)(id);
    const getApp = yield applicantModel_1.default.findById(id);
    return getApp;
});
exports.getOneApplicant = getOneApplicant;
const updateApplicant = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, firstname, lastname, email } = body;
    (0, validateMongoDBId_1.validateMongoDBId)(_id);
    const updateData = {
        firstname: firstname || undefined,
        lastname: lastname || undefined,
        email: email || undefined,
    };
    const updatedApplicant = yield applicantModel_1.default.findByIdAndUpdate(_id, updateData, {
        new: true,
    });
    return updatedApplicant;
});
exports.updateApplicant = updateApplicant;
const deleteApplicant = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = data;
    (0, validateMongoDBId_1.validateMongoDBId)(id);
    const deleteApp = yield applicantModel_1.default.findByIdAndDelete(id);
    return deleteApp;
});
exports.deleteApplicant = deleteApplicant;
