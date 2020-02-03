import express from "express";
import api from "./api";
import mongoose from 'mongoose';

const server = express();
const port = process.env.PORT || 3000;

// server.get("/", (req, res) => res.json({ a: "123" }));
server.use(express.json());
server.use("/api/v1", api);

// server.listen(port, () => console.log(`Server listening on port ${port}!`));

connect();

function listen() {
    if (server.get('env') === 'test') return;
    server.listen(port, () => console.log(`Server listening on port ${port}!`));
}

function connect() {
    mongoose.connection
      .on('error', console.log)
      .on('disconnected', connect)
      .once('open', listen);
    return mongoose.connect(process.env.DATABASE_URL, {
      // keepAlive: 1,
      useNewUrlParser: true,
      // useUnifiedTopology: true
    });
  }

export default server;
