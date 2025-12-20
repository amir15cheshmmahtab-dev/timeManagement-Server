/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response, Router } from 'express';

import { Application } from 'express';
import Locals from './Locals';
import Log from '@utils/log/Log';

import { Routes } from '@interfaces/routes/routes';
import TestRoute from '@modules/test/V1/entry-points/api/test.routes';

class ApiRoutes {
  routes: Array<Routes> = [
    new TestRoute(),
  ];

  private initializeRoutes(): Array<Router> {
    const routesRouter: Array<Router> = [];
    for (const route of this.routes) {
      routesRouter.push(route.router);
    }
    return routesRouter;
  }



  public mountApi(_express: Application): Application {
    const apiPrefix = Locals.config().apiPrefix;
    Log.info('Routes :: Mounting API Routes...');
    _express = _express.get(`/health`, (_request: Request, response: Response) => {
      response.status(200);
      response.end()
    });
    return _express.use(`/${apiPrefix}`, this.initializeRoutes());
  }

}

export default new ApiRoutes();
