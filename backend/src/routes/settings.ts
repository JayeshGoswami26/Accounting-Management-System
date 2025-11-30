import { Router } from "express";
import { Settings } from "../models/Settings";
import { authenticate, authorize, AuthRequest } from "../middleware/auth";

const router = Router();

// All settings routes require authentication
router.use(authenticate);

router.get("/", async (req: AuthRequest, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings({});
    await settings.save();
  }
  res.json(settings);
});

router.put("/", authorize("admin", "manager"), async (req: AuthRequest, res) => {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = new Settings(req.body);
  } else {
    Object.assign(settings, req.body);
  }
  await settings.save();
  res.json(settings);
});

export default router;

