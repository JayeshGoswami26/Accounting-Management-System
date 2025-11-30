"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Settings_1 = require("../models/Settings");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// All settings routes require authentication
router.use(auth_1.authenticate);
router.get("/", async (req, res) => {
    let settings = await Settings_1.Settings.findOne();
    if (!settings) {
        settings = new Settings_1.Settings({});
        await settings.save();
    }
    res.json(settings);
});
router.put("/", (0, auth_1.authorize)("admin", "manager"), async (req, res) => {
    let settings = await Settings_1.Settings.findOne();
    if (!settings) {
        settings = new Settings_1.Settings(req.body);
    }
    else {
        Object.assign(settings, req.body);
    }
    await settings.save();
    res.json(settings);
});
exports.default = router;
//# sourceMappingURL=settings.js.map