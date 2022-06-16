//load all necessary packages.
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const app = express();

//setup body-parser and static dolfer
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('public'));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/wikiDB", (err, result) => {
  err ? console.log(err) : console.log("succesfully connected to MongoDB")
})

//create article schema and mongoose model
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Article = new mongoose.model("Article", articleSchema);


app.route("/articles")

  .get((req, res) => {
    Article.find({}, (err, result) => {
      if (!err) {
        res.send(result)
      } else {
        res.send(err)
      }
    })
  })

  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(err => !err ? res.send("successfully send one article") : res.send(err))
  })

  .delete((req, res) => {
    Article.deleteMany({}, (err) => {
      !err ? res.send("succesfully deleted all articles") : res.send(err)
    })
  });

//------------------------------------------------------------------------------------------------
app.route("/articles/:articleTitle")

  .get((req, res) => {
    Article.findOne({
      title: req.params.articleTitle
    }, (err, result) => {
      !err ? res.send(result) : res.send(err)
    })
  })

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

  .patch((req, res) => {
    Article.updateOne({
      title: req.params.articleTitle
    }, {
      $set: req.body
    }, (err) => {!err ? res.send("succesfully updated this article") : res.send(err)})
  })

.delete((req,res)=>{
  Article.deleteOne({title:req.params.articleTitle}, (err)=>{
    !err?res.send("article succesfully deleted"):res.send(err)
  })
})






// play around with nesting params
app.route("/first/:firstParam/second/:secondParam/third/:thirdParam")

  .get((req, res) => {

    res.write(req.params.firstParam)
    res.write(req.params.secondParam)
    res.write(req.params.thirdParam)
    res.send()
  })






const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log("server started on port " + port)
});
