/* eslint-disable @typescript-eslint/no-explicit-any */

import ExceptionHandler from '@exceptions/Handler';
import testModel from '../data-access/test.model';

class TestService {
  private exceptionHandler = new ExceptionHandler();
  public async test(
  ) {
    try {
      const findUser = await testModel.TEST_ONE_ROW();
      return findUser;
    } catch (error) {
      console.log({error})
      this.exceptionHandler.handler(error);
    }
  }
  
}
export default TestService;
