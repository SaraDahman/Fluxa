import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware";
import { validate } from "../../middleware/validate.middleware";

import { authController } from "./auth.controller";
import { signInSchema } from "./dto/signIn.schema";
import { signUpSchema } from "./dto/signUp.schema";

const router = Router();

router.post("/signup", validate({ body: signUpSchema }), authController.signUp);

router.post("/signin", validate({ body: signInSchema }), authController.signIn);

router.post("/refresh", authController.refresh);

router.post("/logout", authController.logout);

router.get("/me", authenticate, authController.getMe);

export default router;
