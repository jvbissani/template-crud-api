import { Express } from 'express-serve-static-core';
import userRoute from './userRoute';

function Routes(app: Express) {
  userRoute(app);
}

export default Routes;