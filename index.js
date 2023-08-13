const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
// middle ware  
app.use(cors());
app.use(express.json());

// db connect 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjhl6td.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const menuCollection = client.db("starship").collection("menu");
    const reviewsCollection = client.db("starship").collection("reviews");
    const cartCollection = client.db("starship").collection("carts");

    app.get('/menu', async(req,res)=>{
        const result = await menuCollection.find().toArray();
        res.send(result);
    })

    app.get('/reviews', async(req,res)=>{
        const result = await reviewsCollection.find().toArray();
        res.send(result);
    })

    // cart collection
    app.post('/carts',async(req,res)=>{
        const item = req.body;
        console.log(item);
        const result = await cartCollection.insertOne(item);
        res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// db connect 


app.get('/',(req,res)=>{
    res.send('server is running')
})

app.listen(port,()=>{
    console.log(`port ${port} online`)
    console.log('waiting for ping..');
})