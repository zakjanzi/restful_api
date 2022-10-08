    require('dotenv').config()
    // As a best practice, put all of your required calls on top.
    // This way, you can easily see what the dependencies for this module.
    // This index module is dependent on 3 modules: joi , express and dotenv

    //load the express module
    const express = require('express');
    //call this function (which will return an object of type 'express'. By convention, we call this object app)
    //Note: what is returned from this module is a class (Pascale naming convention for classes - aka upper case)
    const Joi = require('joi')
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

    //A const named courses that will be used for the endpoint of getting a single course
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



    // app.post('/api/courses', (req, res) => {
    // // The best security practice outlines that you should never trust what the client sends you. This is where input validation comes in.
    //     if (!req.body.name || req.body.name.length < 3) {
    //         //400 Bad Request will be sent if the above conditions are not met.
    //         res.status(400).send("Name is required and should be > 3")
    //         return;
    //     }

    // In a real world application, you'll most likely be working with something more complex than the object above ^^
    // Meaning that you'll want to write complex validation logic than the above if statement.
    // For that, we'll use a node pacakge named Joi.
    // Joi allows you to create blueprints or schemas for JavaScript objects to ensure validation of key information.

    app.post('/api/courses', (req, res) => {

    // First, we define a schema. A schema defines the properties of an object (number? range? size? etc...)
        const schema = {
            name: Joi.string().min(3).required()
        }
    // The above schema tells us that the returned object should be a string with a minimum of 3 characters
        const result = Joi.validate(req.body, schema);
        

        if (result.error) {
            res.status(400).send(result.error.details[0].message)
            return;
    }

        const course = {
            id: courses.length + 1,
            name: req.body.name
        }
        courses.push(course);
    //After adding a course into the object, it is good practice to return that object to the client
    // Chances are, the user needs to know the id of this new object so we return it in the response.
        res.send(course);
    });



    app.put('/api/courses/:id', (req, res) => {
    // First, we have to look up the course. 
        const course = courses.find(c => c.id === parseInt(req.params.id))
        //If it doesn't exist, return 404
        if (!course) return res.status(404).send('The course with the given ID was not found')

    // Next we have to validate the data (joi)
    const schema = {
        name: Joi.string().min(3).required()
    }
    // If invalid, return 400 (bad request)
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(400).send(result.error.details[0].message)

    }
    // Else, update the course (the "name" property in the request body)
    course.name = req.body.name
    // And return it to the client
    res.send(course);
    });


// Here, we refactored the code in order to use it instead of copying/pasting the validation snippet
// I did not use it above for the sake of the explanation.
    function validateCourse(course) {
        const schema = {
        name: Joi.string().min(3).required()
     }
        return Joi.validate(course, schema);
}

// How to use:
// const result = validateCourse(req.body);


//Delete requests

app.delete('/api/courses/:id', (req, res) => {
    // Find course
    const course = courses.find(c => c.id === parseInt(req.params.id))
    // If it does not exist send 404
    if (!course) res.status(404).send('The course with the given ID was not found')

    const index = courses.indexOf(course)
    courses.splice(index, 1);
    res.send(course)
});

app.listen(port, () => console.log(`live on port ${port}`))
    //assignment: import vs require?