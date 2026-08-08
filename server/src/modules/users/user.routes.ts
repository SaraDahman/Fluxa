import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

import { userController } from "./user.controller";
import { updateProfileSchema } from "./dto/update-profile.schema";

const router = Router();

router.patch("/me", authenticate, validate({ body: updateProfileSchema }), userController.updateMe);

export default router;
