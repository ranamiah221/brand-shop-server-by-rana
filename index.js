const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware..
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.pywpewq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbConnect = async () => {
  try {
      await client.connect()
      console.log('Database Connected!')
  } catch (error) {
      console.log(error.name, error.message)
  }
}
dbConnect()

    const brandCollection = client.db('brandDB').collection('brand');
    const myCartCollection = client.db('brandDB').collection('myCart');
    const userCollection = client.db('brandDB').collection('user');

// Use to product add..
    app.post('/product', async(req, res)=>{
        const newProduct = req.body;
        const result = await brandCollection.insertOne(newProduct);
        res.send(result);
    })
    //read product 
    app.get('/product', async(req, res)=>{
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

     // myCart add..
     app.post('/myCart', async (req, res)=>{
      const product = req.body;
      const result = await myCartCollection.insertOne(product);
      res.send(result);
    })
    
    app.get('/myCart', async (req, res)=>{
      const cursor = myCartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

   
   
    app.put('/product/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updatedProduct = req.body;
      const product = {
        $set: {
          name : updatedProduct.name, 
          image : updatedProduct.image,
          brandName : updatedProduct.brandName, 
          shortDescription : updatedProduct.shortDescription, 
          type : updatedProduct.type, 
          price : updatedProduct.price,
        }
      }
      const result = await brandCollection.updateOne(filter, product, options)
      res.send(result);
    })

    app.get('/product/:id',async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      result= await brandCollection.findOne(query);
      res.send(result);
    })
    

    app.delete('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id : new ObjectId (id)}
      const result = await brandCollection.deleteOne(query)
      res.send(result);

    })

    
     
    // user related apis

    app.post('/user', async(req, res) =>{
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      res.send(result);

    })

  


app.get('/', (req, res)=>{
    res.send('Running');
})
app.listen(port, ()=>{
    console.log(`brand shop server running port : ${port}`);
})