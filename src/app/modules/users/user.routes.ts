import express from 'express';

const route = express.Router();

route.get('/', (req, res) => {
  res.send('testing root route');
});

export const UserRoutes = route;
