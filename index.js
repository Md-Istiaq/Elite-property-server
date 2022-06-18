const express = require('express')
const cors = require('cors')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000
const app = express()
const { MongoClient, ServerApiVersion ,ObjectId } = require('mongodb');
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://eliteProperty:ELdCFl2otAyJrCUs@cluster0.5gxy7.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run(){
    try{
        await client.connect();
        const propertiesCollection = client.db('elite-property').collection('property')
        const blogsCollection = client.db('elite-property').collection('blog')
        const reviewsCollection = client.db('elite-property').collection('review')
        const ordersCollection = client.db('elite-property').collection('orders')
        const usersCollection = client.db('elite-property').collection('users')

        
        app.get('/properties' , async(req,res) =>{
            const query = {}
            const cursour =  propertiesCollection.find(query)
            const property = await cursour.toArray()
            res.send(property)
        })

        app.get('/blogs' , async(req,res) =>{
            const query = {}
            const cursour =  blogsCollection.find(query)
            const blogs = await cursour.toArray()
            res.send(blogs)
        })

        app.get('/reviews' , async(req,res) =>{
            const query = {}
            const cursour =  reviewsCollection.find(query)
            const reviews = await cursour.toArray()
            res.send(reviews)
        })

        app.get('/property/:id' , async(req,res) =>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const property = await propertiesCollection.findOne(query)
            res.send(property)
        })

        app.post('/orders' , async(req,res) =>{
            const newOrder = req.body;
            const result = await ordersCollection.insertOne(newOrder)
            res.send(result)
        })

        app.get('/orders/:email', async(req,res) =>{
            const email = req.params.email
            const query = {email:email}
            const cursor =  ordersCollection.find(query)
            const items = await cursor.toArray()
            res.send(items)

        })

        app.delete('/order/:id' , async(req,res) =>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await ordersCollection.deleteOne(query)
            res.send(result)
        })

        
        app.post('/review' , async(req,res) =>{
            const newReview = req.body;
            const result = await reviewsCollection.insertOne(newReview)
            res.send(result)
        })

        app.post('/properties' , async(req,res) =>{
            const newProperty = req.body;
            const result = await propertiesCollection.insertOne(newProperty)
            res.send(result)
        })

        app.delete('/properties/:id' , async(req,res) =>{
            const id = req.params.id
            const query = {_id:ObjectId(id)}
            const result = await propertiesCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/orders' , async(req,res) =>{
            const query = {}
            const cursour =  ordersCollection.find(query)
            const orders = await cursour.toArray()
            res.send(orders)
        })

        app.get('/user' , async(req,res) =>{
            const users = await usersCollection.find().toArray()
            res.send(users)
          })

          app.put('/user/:email' , async(req,res) =>{
            const email = req.params.email;
            const user = req.body
            const filter = {email:email}
            const options = {upsert:true}
            const updatedDoc = {

              $set:user
            }
            const result = await usersCollection.updateOne(filter , updatedDoc,options)
            const token = jwt.sign({email:email} , '370334ba94458c6a1951596b2e98db9756e213301330c290352fc0abef332cbc6d30ba5277c238cce51b68db60623f20352bf7e6a2451b45400aa164b2176e26' , {expiresIn:'1h'})
            res.send({result , token})
          })

          app.put('/users/admin/:email' , async(req,res) =>{
            const email = req.params.email;
             const filter = {email:email}
            
            const updatedDoc = {

              $set:{role:'admin'}
            }
            const result = await usersCollection.updateOne(filter , updatedDoc)
            
            res.send(result )

          })

          app.get('/admin/:email' , async(req,res) =>{
            const email = req.params.email
            const user = await usersCollection.findOne({email:email})
            const isAdmin = user.role === 'admin'
            res.send({admin:isAdmin})
          })

    }
    finally{

    }
}
run().catch(console.dir)

app.get('/' , (req,res) =>{
    res.send("Running elite property server")
})

app.listen(port, () =>{
    console.log("Listening to port",port)
})