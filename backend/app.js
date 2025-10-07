import express from "express";
import sequelize from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import {Server} from 'socket.io'
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

const app = express();
const port = 5000;



// app.use(express.static("uploads"));
app.use(cors());
app.use(express.json());

app.use("/", fileRoutes);

sequelize.sync()
.then(() => {
  console.log("Database Connected Successfully");
  })

  .catch((err) => console.log("Error Connecting database: ", err));
  
  
  
  app.get('/progress', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    
    clients.push(res); 
  });
  
  
  let server = app.listen(port, () => {
    console.log(`Your server is running on ${port}`);
  });
  

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
   
  });
   
  
  
  io.on('connection',(socket) => {
    console.log('Socket Connection Successfully')
  
    socket.on('disconnect',() => {
      console.log("Socket Disconnected")
    })
  })


  console.log("himanshuhjain")