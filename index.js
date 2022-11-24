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

}
run().catch(error => console.log(error))

app.listen(port, () => {
    console.log("Server is running on port ", port);
})