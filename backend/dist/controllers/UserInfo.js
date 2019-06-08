"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userInfo = require("../models/UserInfo");
async function getUserInfo(req, res) {
    res.send({
        success: true,
        data: {
            balance: userInfo.getBalance(),
        },
        error: null,
    });
}
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=UserInfo.js.map