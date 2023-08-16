/* eslint-disable no-console */
import mongoose from 'mongoose';
import app from './app';
import config from './config';

async function database() {
  try {
    await mongoose.connect(config.databaseUrl as string);

    app.listen(config.port, (): void => {
      console.log(
        `🔋  Database connected Successfully and App listening on port ${config.port}`
      );
    });
  } catch (error) {
    console.log(error);
  }
}
database();
