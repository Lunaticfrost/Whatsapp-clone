//imports
import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import Cors from 'cors';

//app config
const app = express();
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1631313",
    key: "17064d59ff1115bcbe69",
    secret: "b05cf7e2ab0039acff04",
    cluster: "eu",
    useTLS: true
  });


  const db = mongoose.connection

  db.once('open',()=>{
    console.log("DB connected");

    const msgCollection = db.collection('messagecontents');
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log(change);

        if(change.operationType == 'insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', 
            {
                name: messageDetails.name,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            });
        }else{
            console.log("Error triggering Pusher");
        }
    });

  });

//middleware
app.use(express.json()); 
app.use(Cors());

// app.use((req,res,next)=>{
//     res.setHeader("Access-Control-Allow-Origin","*");
//     res.setHeader("Access-Control-Allow-Headers","*");
//     next();
// });

//DB config
const connection_url = 'mongodb+srv://admin:FLObFxKsbP9KUzUs@cluster0.sfgkhbv.mongodb.net/whatsappdb?retryWrites=true&w=majority'
mongoose.connect(connection_url,{
    useNewUrlParser: true, //it will parse this url in newer way
    useUnifiedTopology: true
})

//????

//api routes
app.get('/',(req,res)=> res.status(200).send("Hello World!"));

app.get('/messages/sync',(req,res)=>{
    Messages.find()
        .then((data)=>{
            res.status(200).send(data);
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).send(err);
        })
})

app.post('/messages/new',(req,res)=>{
    const dbMessage = req.body;

    Messages.create(dbMessage)
    .then((data)=>{
        res.status(201).send(`new message created: \n ${data}`);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).send(err);
    });
})

//listen
app.listen(port, ()=> console.log(`Listening on localhost:${port}`));

 