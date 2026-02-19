import { Routes } from "@/interfaces/routes/routes";
import validationMiddleware from "@/middlewares/validation/validation";
import { authenticate } from "@/shared/middleware/authenticate";
import { Router } from "express";
import AuthController from "./auth.controller";
import { validateCreateUser, validateLogout, validateRefreshToken } from "./auth.validation";


class AuthRoute implements Routes {
  public path = '/v1/auth';
  public router = Router();
  public controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
     this.router.post(`${this.path}/create`,[authenticate,validationMiddleware(validateCreateUser,'body')],this.controller.createUser);
     this.router.post(`${this.path}/logout`, [authenticate,validationMiddleware(validateLogout,'body')], this.controller.logout);
     this.router.post(`${this.path}/refresh`,[authenticate,validationMiddleware(validateRefreshToken,'body')], this.controller.refresh);
  }
     
}

export default AuthRoute;