"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const applCtrl_1 = require("../controllers/applCtrl");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
// applicant
router.post("/auth/register", applCtrl_1.createApplicant);
router.post("/auth/login", applCtrl_1.handleApplicantLogin);
router.get("/", applCtrl_1.handleGetAllApplicants);
router.get("/auth/logout", applCtrl_1.handleApplicantLogout);
// specifics
router.get("/refresh", applCtrl_1.handleTokenRefresh);
// dynamic routes
router.delete("/:id", applCtrl_1.handleDeleteApplicant);
router.put("/update-user", authMiddleware_1.authMiddleware, applCtrl_1.handleUpdateApplicant);
router.get("/:id", authMiddleware_1.authMiddleware, applCtrl_1.handleGetOneApplicant);
exports.default = router;
