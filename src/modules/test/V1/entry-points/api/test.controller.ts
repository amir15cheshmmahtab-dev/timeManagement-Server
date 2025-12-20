import { NextFunction, Request, Response } from 'express';
import TestService from '../../domain/test.service';

class TestController {
  private service = new TestService();

  public test = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      
      
      const response = await this.service.test()
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
  
}
export default TestController;


