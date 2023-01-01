const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Gima is Runnig...");

})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c2riiik.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect();

    const productsCollection = client.db('gimajhon').collection('products');
    
    app.get('/products', async (req, res) => {
        console.log(req.query)
        const product = productsCollection.find({});
        const page = parseInt(req.query.page);
        const size = parseInt(req.query.size);
        let result;
        if(page || size){
            result = await product.skip(page*size).limit(size).toArray();
        }else{
            result = await product.toArray();
        }
        res.send(result);
    })

    app.get('/productCount', async (req, res) => {
        const count = await productsCollection.estimatedDocumentCount();
        res.send({count});
    })

    app.post('/productByKeys', async (req, res) => {
        const items = req.body;
        const item = items.map(p => ObjectId(p));
        const query = {_id: {$in: item}};
        const product = productsCollection.find(query);
        const result = await product.toArray();
        res.send(result);

    })

    }
    finally{

    }
}

run().catch(console.dir)






app.listen(port, () => {
    console.log('Gima is Running ', port);
})
