import express from 'express';
import { bookContoller } from './book.controller';

const routes = express.Router();

routes.get('/allbooks', bookContoller.getAllbooks);
routes.post('/add-new', bookContoller.addNewBook);
routes.patch('/update', bookContoller.updateBook);
routes.delete('/', bookContoller.deletBook);
routes.get('/:id', bookContoller.getSingleBook);
routes.patch('/comment/', bookContoller.postComment);

export const BooksRoutes = routes;
