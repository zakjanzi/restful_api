require('dotenv').config()

//load the express module
const express = require('express');
//call this function (which will return an object of type 'express'. By convention, we call this object app)
const app = express()


//This object has a bunch of useful methods: (which are http methods)

// app.get
// app.post
// app.put
// app.delete

// These methods take 2 arguements:
    //First arg: the path or URL. Use '/' to represent the root of the website
    //Second arg: function that will be called when we have an HTTP request for this endpoint.
        //This function also takes 2 arguements:
        // req: request
        // res: response

//Note: the callback function in this case is also called a route handler.

app.get('/', (req, res) => {
    res.send('Hi');
});

// Note that the port in this case is hardcoded. This will only work locally and not in a production environment. Once we deploy this app to
// a hosting environment, the port will automatically be assigned (so we can't rely on port 3000 to be available.)
// The way to improve this, is to use an environment variable.
// PORT is an environment variable (it exists in hosting environments for Node applications.)
// The way to read the value of this variable is by using the 'process' object.
// This object has a property called env (short for environment)
// process.env.PORT || 3000; (the latter part means that either run on PORT or on localhost 3k if unavailable)
//Finally we store the result in a const called port and we 'import' dotenv (above).
const port = process.env.PORT || 3000;

//an endpoint to get a single course. Will create a const named courses below:
const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

app.get('/api/courses', (req, res) => {
    res.send(courses);
})


app.get('/api/courses/:id', (req, res) => {
   let course = courses.find(c => c.id === parseInt(req.params.id))
   if (!course) res.status(404).send('not found')
   res.send(course);
});



// This is a piece of middleware. Request body must be parsed in JSON for it to be 'readable'. 
// By "it", I'm referring to the `req.body.name` in the post method below.
// This middleware is responsible for that. When we call the `express.json()` method, this method returns a piece of middleware - 
// Then we call app.use to use that middleware in the request processing pipeline.
app.use(express.json());



app.post('/api/courses', (req, res) => {
// The best security practice outlines that you should never trust what the client sends you. This is where input validation comes in.
    if (!req.body.name || req.body.name.length < 3) {
        //400 Bad Request will be sent if the above conditions are not met.
        res.status(400).send("Name is required and should be > 3")
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
//After adding a course into the object, it is good practice to return that object to the client
// Chances are, the user needs to know the id of this new object.
    res.send(course);
});

//assignment: import vs require?




app.listen(port, () => console.log(`live on port ${port}`))