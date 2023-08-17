import express from 'express';
import { bookContoller } from './book.controller';

const routes = express.Router();

routes.get('/allbook', bookContoller.getAllbooks);
routes.post('/add-new', bookContoller.addNewBook);
routes.patch('/update', bookContoller.updateBook);
routes.delete('/', bookContoller.deletBook);

export const BooksRoutes = routes;
