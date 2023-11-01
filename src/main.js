"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = require("body-parser");
const errorHandler_1 = require("../middlewares/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
(0, dbConnect_1.default)();
app.use((0, morgan_1.default)("dev")); // timestamps in terminal
app.use((0, body_parser_1.json)()); // parse HTTP request body
app.use((0, body_parser_1.urlencoded)({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Welcome to Passporter!");
});
// routes
app.use("/api/applicant", authRoutes_1.default);
// error middlwares
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});
