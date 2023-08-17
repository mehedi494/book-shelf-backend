import express from 'express';
import { UserController } from './user.controller';

const route = express.Router();

route.get('/', (req, res) => {
  res.send('testing root route');
});
route.post('/create', UserController.createUser);

export const UserRoutes = route;
