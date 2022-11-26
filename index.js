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
    const bookingsCollections = client.db("puranClothes").collection("bookings")

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

    //stored users in the databage
    app.post('/users', async (req, res) => {
        const data = req.body;
        console.log(data);
        const result = await usersCollections.insertOne(data)
        res.send(result)
    })

    //delete a  users
    app.delete('/allusers/:id', async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const query = { _id: ObjectId(id) }
        console.log(query);
        const result = await usersCollections.deleteOne(query);
        res.send(result)
    })

    //check users type to log in
    app.get('/users', async (req, res) => {
        const email = req.query.email;
        const role = req.query.role;
        const users = await usersCollections.find({}).toArray()

        const search = users.find(user => user.email === email)
        console.log("Search value", search);
        console.log("compare", search.role == role);

        if (search.role == role) {
            res.send({ isFound: 'Yes' })
        } else {
            res.send({ isFound: 'No' })
        }
    })

    //all users
    app.get('/allUsers', async (req, res) => {
        res.send(await usersCollections.find({}).toArray())
    })

    //check role
    app.get('/role', async (req, res) => {
        const email = req.query.email;
        console.log(email);
        const allusers = await usersCollections.find({}).toArray()
        const search = allusers.find(user => user.email == email)
        if (search) {
            const admin = search.isAdmin;
            const userType = search.role;
            if (admin) {
                res.send({ isAdmin: 1, role: userType })
            } else {

                res.send({ isAdmin: 0, role: userType })
            }
        }
    })

    //all buyers
    app.get('/allBuyers', async (req, res) => {
        const allusers = await usersCollections.find({}).toArray()

        const buyers = allusers.filter(user => user.role === 'User' && !user.isAdmin)
        res.send(buyers)
    })

    //all sellers
    app.get('/allSellers', async (req, res) => {
        const allusers = await usersCollections.find({}).toArray()

        const sellers = allusers.filter(user => user.role === 'Seller' && !user.isAdmin)
        res.send(sellers)
    })


    //seller
    //add product

    app.post('/addProduct', async (req, res) => {
        const product = req.body;
        console.log(product);
        let result;
        if (product.categoryId == 1) {

            result = await mensCollections.insertOne(product)

        } else if (product.categoryId == 2) {

            result = await womensCollections.insertOne(product)

        } else if (product.categoryId == 3) {

            result = await childsCollections.insertOne(product)

        }

        res.send(result)
    })




    //find specific product of the seller
    app.get('/myproduct', async (req, res) => {
        const email = req.query.email;

        let myProducts = []

        //mens
        const menProduct = await mensCollections.find({}).toArray()
        const myMenProduct = menProduct.filter(product => product.sellerEmail == email)

        //womens
        const womenProduct = await womensCollections.find({}).toArray()
        const myWomenProduct = womenProduct.filter(product => product.sellerEmail == email)

        //child
        const childProduct = await childsCollections.find({}).toArray()
        const myChildProduct = childProduct.filter(product => product.sellerEmail == email)


        //combined all
        myProducts = [...menProduct, ...womenProduct, ...childProduct]
        res.send(myProducts)
    })


    //delete sellers product
    app.delete('/deleteProducts/:id', async (req, res) => {
        const id = req.params.id;
        console.log("delete my product", id);
        let result;

        const query = { _id: ObjectId(id) }

        //check 
        if (await mensCollections.findOne(query)) {

            result = await mensCollections.deleteOne(query)

        } else if (await womensCollections.findOne(query)) {

            result = await womensCollections.deleteOne(query)

        } else if (await childsCollections.findOne(query)) {

            result = await childsCollections.deleteOne(query)

        }
        res.send(result)
    })


    //update advertise value
    app.patch('/updateAdvertise/:id', async (req, res) => {
        const id = req.params.id;
        console.log("update advertise", id);

        let result;
        const filter = { _id: ObjectId(id) }

        const updateDoc = {
            $set: {
                advertise: 1
            },
        };

        //check 
        if (await mensCollections.findOne(filter)) {

            result = await mensCollections.updateOne(filter, updateDoc)

        } else if (await womensCollections.findOne(filter)) {

            result = await womensCollections.updateOne(filter, updateDoc)

        } else if (await childsCollections.findOne(filter)) {

            result = await childsCollections.updateOne(filter, updateDoc)

        }
        res.send(result)
    })


    //get all advertised products
    app.get('/allAdvertiseProducts', async (req, res) => {
        const query = { advertise: 1 }

        const menData = await mensCollections.find(query).toArray()
        const womenData = await womensCollections.find(query).toArray()
        const childData = await childsCollections.find(query).toArray()

        const allData = [...menData, ...womenData, ...childData]

        res.send(allData)
    })

    //update verifyStatus
    app.patch('/verifyStatus', async (req, res) => {
        const email = req.query.email;
        console.log("update advertise", email);


        const filter = { email: email }

        const updateDoc = {
            $set: {
                verified: 1
            },
        };

        //check 

        const result = await usersCollections.updateOne(filter, updateDoc)

        const menProductVerified = await mensCollections.updateMany({ sellerEmail: email }, updateDoc)
        const womenProductVerified = await womensCollections.updateMany({ sellerEmail: email }, updateDoc)
        const childProductVerified = await childsCollections.updateMany({ sellerEmail: email }, updateDoc)

        res.send(result)
    })

    //book product
    app.post('/bookings', async (req, res) => {
        const data = req.body;
        const result = await bookingsCollections.insertOne(data)
        res.send(result)
    })


    //get my book products
    app.get('/bookings', async (req, res) => {
        const email = req.query.email;
        const query = { buyerEmail: email }
        const result = await bookingsCollections.find(query).toArray()
        res.send(result)
    })

    //delete booked product
    app.delete('/bookings/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) }
        const result = await bookingsCollections.deleteOne(filter)
        res.send(result)
    })


}
run().catch(error => console.log(error))

app.listen(port, () => {
    console.log("Server is running on port ", port);
})