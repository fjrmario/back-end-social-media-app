# Social Media App

A web based application to find and interact with other people in the comfort of your home

## Description

This web application allows any walk of life to interact with one another:
* By posting how their day went, like a diary
* Interact with each other(through commenting for now)
* Follow each other to get the latest update

### [Try the application here(Requires sign up)](https://agile-girdle-worm.cyclic.app)

## Tools and Libraries

* Github for repository
* Cyclic for deployment
* Visual Studio Code for development
* MongoDB to host database
* PUG engine to display views
* Node and the following libraries (and their dependencies)
  * express: server development
  * mongoose: connection to MongoDB database
  * bcrypt: hashing of passwords
  * method-override: using PUT and DELETE methods from browser
  * express-session & connect-mongo: authorization of users
  
## Timeframe

5 working days

## Wireframe and User Stories

## Development Approach and Details

This application implements basic Create Read Update Delete (CRUD) functions and was implemented by using a model-view-controller architectural approach as described below. My approach and timeline in developing this game was to:

#### Day 1
1. Set up server using express and connect to MongoDB database using mongoose 
2. Define its models
3. Plan and set up routers for basic CRUD functions using REST conventions

#### Day 2
1. Set up CRUD controllers and views for Users
2. Set up CRUD controllers and views for Post

#### Day 3
1. Set up CRUD controllers and views for Post

#### Day 4
1. Set up CRUD controllers and views for Post
2. Set up CRUD controllers and views for Likes

#### Day 5
1. Deploy application

### _Model_

The application stores data in three Collections within a MongoDB Database, with the Schemas described.

### _View_

The views were generated using PUG to dynamically display information passed by the Controller when rendered. 

### _Controller_

There are two categories of controllers in the application: for user's activity and its users. 

The controllers for activities allow basic CRUD functions for the users and post models. The routes for each of these functions adhere to REST conventions.

## Future Developments & Improvements

While the app contains basic functions, there are three key areas for future developments:

### 1. Ability to post in the Timeline page. 

There are some asyncrhonous functions that the controllers can perform simultaneously, such as updating multiple Trainee documents after a Training is completed. However, these are currently done synchronously due to ease of development. Promises can be used to execute these steps asynchronously and speed up run time. 

### 2. Ability to interact with other user's post. 

While the model Schema does restrict data to fit the expected data types, the validation can be further expanded to include dates, and to prevent the user from submitting these inputs at the server side. Furthermore, error handling has not yet been implemented. 

## Summary

This is my first attempt at creating a fully functioning web based application. There is so much more things to learn in the Back end development and so far it's been challenging and very fullfilling to learn how the http request works!