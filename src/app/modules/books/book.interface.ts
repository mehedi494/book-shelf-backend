import { ObjectId } from 'mongoose';

export type IBooks = {
  _id?: ObjectId;
  title: string;
  author: string;
  publication_date: string;
  genre: string;
  reviews: string[];
  image: string;
  userId: ObjectId | string;
};

export type IBookFilters = {
  searchTerm?: string;
};

export type ICommentPayload = {
  bookId: string;
  comment: string;
};
