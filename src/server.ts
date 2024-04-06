import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app';
import { Custom_error } from '@himanshu_guptaorg/utils';
import { startSocket } from './socket';
dotenv.config({ path: '.env' });
dotenv.config({ path: 'config.env' });
const init = async () => {
  try {
    if (!process.env.MONGO_URI)
      throw new Custom_error({
        errors: [{ message: 'MONGO_URINotFound' }],
        statusCode: 500,
      });
    await mongoose.connect(process.env.MONGO_URI);
    console.log(process.env.MONGO_URI);
    app.listen(process.env.PORT, async () => {
      console.log('Server started!!!!!!');
    });
    startSocket();
  } catch (err) {
    console.error(err);
  }
};
init();
