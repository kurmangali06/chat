import cors from "cors";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import router from "./api/routes.js";
import sockets from "./socket/sockets.js";
import dotenv from 'dotenv'

dotenv.config();
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('connected to DB');
}).catch((err) => {
  console.log(err.message, "MongoDB error")})

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*:*",
    methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders:["secretHeader"],
    credentials: true
  },
});

app.get('/',  (req, res )=> {
  res.send("hello world")
} );
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/", router);

io.on("connection", sockets);

httpServer.listen(PORT, () => {
  console.log("Server is running at https://chat-tan-nine.vercel.app");
});