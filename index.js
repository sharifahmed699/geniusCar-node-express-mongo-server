const express = require('express')
const app = express()
const cors  = require('cors')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId

// middleware 
app.use(cors())
app.use(express.json())


const port = 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s17ux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect()
        const database = client.db("geniusCar");
        const serviceCollection = database.collection("services");

        // Get API
        app.get('/service',async(req,res)=>{
            const cursor = serviceCollection.find({})
            const services  =await cursor.toArray()
            res.send(services)
        })

        // GET Single ID 
        app.get('/service/:id',async(req,res)=>{
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query)
            res.json(result)
        })

        //POST API
        app.post('/service', async(req,res)=>{
            const service = req.body
            console.log("hit the post api",service)
            const result = await serviceCollection.insertOne(service)
            res.json(result)

        })
        // Delete Api
        app.delete('/service/:id',async(req,res)=>{
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const result = serviceCollection.deleteOne(query)
            res.json(result)
        })


    }
    finally{
        // await client.close()
    }

}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("Hello, I came express")
})

app.listen(port,()=>{
    console.log("Listening port",port);
})