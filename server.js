import express from 'express';
import cors from 'cors';
import { connectDB } from './connectdb.js';
import morgan from 'morgan';

const app = express();
app.listen(3000);

app.use(cors());
app.use(express.json());
app.use(morgan('common')); //middleware that handle logging requests from the front end (fist one)
app.use(express.static('public')); //middleware that handle static files (second one)

app.get('/lessons', (req, res) => {//api endpoint to get all lessons
    connectDB().then(db => {
        db.collection('lesson_data').find().toArray()
        .then(result => {
            res.json(result); // return the resopnse to the front end
        })
        .catch(err => {
            res.status(500).json({ error: err.message }); //catch the collections errors
        });
    }).catch(err => {
        res.status(500).json({ error: err.message }); // catch the database errors
    });
});

app.get('/search', (req, res) => {
    const queryParam = req.query.query; // Get the 'query' parameter from the request
    
    connectDB().then(db => {
        let searchQuery = {};

        if (queryParam) {
            // Use the 'query' parameter to search across multiple fields
            searchQuery.$or = [
                { name: { $regex: new RegExp(queryParam, 'i') } },
                { city: { $regex: new RegExp(queryParam, 'i') } },
                { price: { $regex: new RegExp(queryParam, 'i') } },
                { avail: { $regex: new RegExp(queryParam, 'i') } }
            ];
        }

        db.collection('lesson_data').find(searchQuery).toArray()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
});


