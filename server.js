import express from 'express';
import cors from 'cors';
import { connectDB } from './connectdb.js';
import morgan from 'morgan';
import { ObjectId } from 'mongodb';

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

app.post('/order', (req, res) => {
    const order = req.body;


    connectDB().then(db => {
        db.collection('order_collection').insertOne(order)
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

app.get('/order', (req, res) => {
    connectDB().then(db => {
        db.collection('order_collection').find().toArray()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
    }).catch(err => {
        res.status(500).json({ error: err.message });
    });
})

app.put('/updateAvailability', (req, res) => {
    const lessonsToUpdate = req.body;
    console.log("Received lessons to update:", lessonsToUpdate);

    connectDB().then(db => {
        return Promise.all(
            lessonsToUpdate.map(lesson => {
            console.log("Updating lesson with _id:", lesson._id);
            return db.collection('lesson_data').updateOne(
                { _id: new ObjectId(lesson._id) },
                { $inc: { avail: 0-lesson.availDelta } }
            );
        }));
    })
    .then(updateResults => {
        console.log("Update results:", updateResults);
        res.json({ updateResults: updateResults });
    })
    .catch(err => {
        console.error("Error updating lessons:", err);
        res.status(500).json({ error: err.message });
    });
});



