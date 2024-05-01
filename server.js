const cors = require('cors');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

// MongoDB Client Setup

const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const mongoURI = `mongodb+srv://${username}:${password}@crudify.usixfr1.mongodb.net/?retryWrites=true&w=majority&appName=crudify`
const client = new MongoClient(mongoURI);


let db, henhouseCollection;

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('MongoDB connected');
        db = client.db('crudify'); // If no database name is provided, it connects to the default one
        henhouseCollection = db.collection('henhouses');
    } catch (err) {
        console.log('Error connecting to MongoDB', err);
    }
}

connectDB();

// CRUD APIs
app.get('/api/henhouse', async (req, res) => {
    try {
        const records = await henhouseCollection.find().toArray();
        console.log(records)
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/henhouse', async (req, res) => {
    try {
        const newRecord = req.body;
        const result = await henhouseCollection.insertOne(newRecord);
        res.json(result.ops[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/henhouse/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedRecord = await henhouseCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: req.body },
            { returnOriginal: false }
        );
        res.json(updatedRecord.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/henhouse/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await henhouseCollection.findOneAndDelete({ _id: new ObjectId(id) });
        res.json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
