import { Router, Response } from "express";
import Lead from "../models/Lead.js";
import { leadSchema, statusSchema } from "../validation/schemas.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const lead = await Lead.create(parsed.data);
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { search, status } = req.query;

    const filter: Record<string, unknown> = {};

    if (search && typeof search === "string") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (status && typeof status === "string") {
      filter.status = status;
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id/status", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const parsed = statusSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status: parsed.data.status },
      { new: true }
    );

    if (!lead) {
      res.status(404).json({ error: "Lead not found" });
      return;
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
