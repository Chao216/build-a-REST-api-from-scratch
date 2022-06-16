# REST API
## 1 REST is a architectural style of API

how to make our apis restful?
1. use http verbs
2. use specific patterns of route and endpoint URLs


#### HTTP verbs are methods such as GET, POST, PUT, PATCH, DELETE
|HTTP|Database|
|:--:|:--:|
|GET| READ|
|POST|CREATE|
|PUT/PATCH|UPDATE|
|DELTE|DELETE|

PUT will send a new entire entry to replace old one, while PATCH will send relavents fileds only.

/models<sub>this is the route</sub>  /Sarai<sup>This is our endpoint</sup>

___
## 2 Please donload robo 3T which is the free version of Studio 3T

robo 3T offers an GUI interface for MongoDB

to create a new DB , right click `new connection` on left top corner

also right click `collection` to create a  new collection. naming convention is to use lowercase plural form.

----
## 3 create a node app
```javascript
//load all necessary packages.
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

//setup body-parser and static dolfer
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
```

dont forget set view engine and app.listen on port
```javascript
app.set("view engine", "ejs");

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("server started on port " + port)
});
```
----
##  4 build our REST API

when access /articles, we will get json file of all articles objects
```javascript
app.get("/articles", (req,res)=>{
  Article.find({}, (err,result)=>{
    if (!err){
      res.send(result)
    } else {
      res.send(err)
    }
  })
})
```

to use app.post() without a front end we use our old friend  **postman**
while using postman to send request, click body and choose `x-www-form-urlencoded` and enter key values below in the table. then click send.

```javascript
//post route

app.post("/articles", (req, res) => {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(err => !err ? res.send("successfully send one article") : res.send(err))
})
```
if you want to delete, use app.delete() with Mongoose deleteMany()
```javascript
app.delete("/articles", (req, res) => {
  Article.deleteMany({}, (err) => {
    !err? res.send("succesfully deleted all articles") : res.send(err)
  })
})
```
you can use `app.route()` to simplify your code.

```javascript
app.route('/book')
  .get((req, res) => {
    res.send('Get a random book')
  })
  .post((req, res) => {
    res.send('Add a book')
  })
  .put((req, res) => {
    res.send('Update the book')
  })
```
----
to fetch a specific article use route params
```javascript
app.route("/articles/:articleTitle")

.get((req,res)=>{
  Article.findOne({title:req.params.articleTitle}, (err,result)=>{
    !err?res.send(result):res.send(err)
  })
})
```
the user typed *`:articleTitle`* can be get through body-parser *`req.params.articleTitle`*



<details><summary> play around with nesting params</summary>
<p>

```javascript

app.route("/first/:firstParam/second/:secondParam/third/:thirdParam")

  .get((req, res) => {

    res.write(req.params.firstParam)
    res.write(req.params.secondParam)
    res.write(req.params.thirdParam)
    res.send()
  })
```
</p>
</details>

to update a specific article with PUT
```javascript
  .put((req, res) => {
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      title: req.body.title,
      content: req.body.content
    }, (err) => {
      if (!err) {
        res.send("successfully updated this artcile")
      } else {
        res.send(err)
      }
    })
  })
```
Don't use Model.delete() from June 2022 onwards, &nbsp;&nbsp;<sub>Note! Model.delete() is deprecated in mongoose.</sub>

update a specific article with PATCH
```javascript
  .patch((req, res) => {
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, (err) => {!err ? res.send("succesfully updated this article") : res.send(err)})
  })
```

to delete a specific article use app.delete() with model.deleteOne()
```javascript
  .delete((req, res) => {
    Article.deleteOne({
      title: req.params.articleTitle
    }, (err) => {
      !err ? res.send("article succesfully deleted") : res.send(err)
    })
  });
  ```


`req.body.<something>` is values from user's request, while `req.params.<someRouteParams>` is simply what user typed in the browser address bar.
