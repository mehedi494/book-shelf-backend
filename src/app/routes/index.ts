import express from 'express';
import { UserRoutes } from '../modules/users/user.routes';
import { BooksRoutes } from '../modules/books/book.routes';
const router = express.Router();

const moduleRoute = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/book',
    route: BooksRoutes,
  },
];

moduleRoute.forEach(module => router.use(module.path, module.route));
export const routers = router;
