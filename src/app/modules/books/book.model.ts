import { Schema, model } from 'mongoose';
import { IBooks } from './book.interface';

const bookSchema = new Schema<IBooks>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publication_date: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    reviews: {
      type: [],
    },
  },
  { timestamps: true }
);

export const Book = model<IBooks>('Book', bookSchema);
