const express = require('express');
const app = express();

// Module that permits connect graphql with express
const express_graphql = require('express-graphql');
// Module that permits create schemas for graphql
const { buildSchema } = require('graphql');

// courses const has all example data that we used for work in this project
const { courses } = require('./data.json');
//console.log(courses);

// the next const has define all schemas that graphQL'll use
const schema = buildSchema(`
    type Query {
        getCourse(id: Int!): Course
        getCourses(topic: String): [Course]
    }

    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }

    type Course {
        id: Int,
        title: String,
        author: String
        topic: String,
        url: String
    }
`);

let getCourse = (args) => {
    let id = args.id;
    return courses.filter(course => {
        return course.id == id;
    })[0];
}

let getCourses = (args) => {
    if (!args.topic) return false;
    let topic = args.topic;
    return courses.filter(course => course.topic == topic);
}

let updateCourseTopic = ({id, topic}) => {
    courses.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    });

    return courses.filter(course => course.id == id)[0];
}

// const root defines the "rootValues" that server has require to find the functions in the project
const root = {
    getCourse: getCourse,
    getCourses: getCourses,
    updateCourseTopic: updateCourseTopic
}

// use() method is used for specify a route to the browser
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(3000, () => console.log('server on port 3000'));
