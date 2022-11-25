const express = require('express');


const app = express()

const cors = require('cors');

require('dotenv').config()
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 5000

app.get('/', async (req, res) => {
    res.send("Server is running")
})



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7kbtzra.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    //collections start
    const categoriesCollections = client.db("puranClothes").collection("categories")
    const mensCollections = client.db("puranClothes").collection("menClothes")
    const womensCollections = client.db("puranClothes").collection("womenClothes")
    const childsCollections = client.db("puranClothes").collection("childClothes")
    const usersCollections = client.db("puranClothes").collection("users")

    // collections end 

    //find all categories
    app.get('/categories', async (req, res) => {
        const query = {}
        const result = await categoriesCollections.find(query).toArray()
        res.send(result)

    })

    //find specific category
    app.get('/category/:id', async (req, res) => {
        const id = req.params.id;
        const query = {}

        if (id == 1) {
            const result = await mensCollections.find(query).toArray()
            res.send(result)
        } else if (id == 2) {
            const result = await womensCollections.find(query).toArray()
            res.send(result)
        } else if (id == 3) {
            const result = await childsCollections.find(query).toArray()
            res.send(result)
        }


    })

    //stored users
    app.post('/users', async (req, res) => {
        const data = req.body;
        console.log(data);
        const result = await usersCollections.insertOne(data)
        res.send(result)
    })
}
run().catch(error => console.log(error))

app.listen(port, () => {
    console.log("Server is running on port ", port);
})