import { Router } from 'express';
import { Routes } from '@interfaces/routes/routes';
import TestController from './test.controller';

class TestRoute implements Routes {
  public path = '/test';
  public router = Router();
  public controller = new TestController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, [], this.controller.test);

 
    
  }
}

export default TestRoute;
