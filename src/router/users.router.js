import { Router } from "express";
const router = Router();

import userController from "../controllers/user.controller.js";

router.get('/resetPass/:email', userController.restartPass);
router.get('/resetPassword', userController.renderResetPasswordPage);
router.post('/resetPassword', userController.renderResetPasswordPage);
router.get('/premium/:uid', userController.changeUserRole);

export default router;