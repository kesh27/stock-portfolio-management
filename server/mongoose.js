import Mongoose from 'mongoose'

const mongoose = Mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log("Connected!!")
});

export default mongoose

