import express from 'express';
import { UserRoutes } from '../modules/users/user.routes';
const router = express.Router();

const moduleRoute = [
  {
    path: '/user',
    route: UserRoutes,
  },
];

moduleRoute.forEach(module => router.use(module.path, module.route));
export const routers = router;
