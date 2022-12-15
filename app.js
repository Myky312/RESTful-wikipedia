const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//get is to read from my database
// app.get("/articles", function(req, res){
//     Article.find(function(err, foundArticles){
//         if(!err){
//             res.send(foundArticles);
//         }else{
//             res.send(err);
//         }
//         //console.log(foundArticles);
//         //if(!err){
//         //    console.log("eve");
//         //}
//     });
// });

//post is to create object in my database
// app.post("/articles", function(req, res){
//     // console.log(req.body.title);
//     // console.log(req.body.content);
//     const newArticle = new Article({
//         title: req.body.title,
//         content: req.body.content
//     });
//     newArticle.save(function(err){
//         if(!err){
//             res.send("The new article is added. ");
//         }else{
//             res.send(err);
//         }
//     });
// });

//delete for deleting everying
// app.delete("/articles", function(req, res){
//     Article.deleteMany(function(err) {
//         if(!err){
//             res.send("Deleted all articles. ");
//         }else{
//             res.send(err);
//         }
//     });
// });

app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
      //console.log(foundArticles);
      //if(!err){
      //    console.log("eve");
      //}
    });
  })

  .post(function (req, res) {
    // console.log(req.body.title);
    // console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("The new article is added. ");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Deleted all articles. ");
      } else {
        res.send(err);
      }
    });
  });

//////////////////////////Requesting Specific Route///////////////////////////

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          res.send(foundArticle);
        } else {
          res.send("No articles with this title were found");
        }
      }
    );
  })

  .put(function (req, res) {
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          //put overwrites data
          Article.updateOne(
            { title: foundArticle.title },
            { title: req.body.title, content: req.body.content },
            function (err) {
              if (!err) {
                res.send("Successfully updated article.");
              } else {
                res.send("Cannot update article with the given title! ");
              }
            }
          );
        } else {
          res.send("There is no article with the given title! ");
        }
      }
    );
  })

  .patch(function (req, res) {
    //put doesn't overwrites the missing data to 0 it keeps previous data
    Article.findOne(
      { title: req.params.articleTitle },
      function (err, foundArticle) {
        if (foundArticle) {
          //put overwrites data
          Article.updateOne(
            { title: foundArticle.title },
            { $set: req.body },
            function (err) {
              if (!err) {
                res.send("Successfully updated article.");
              } else {
                res.send("Cannot update article with the given title! ");
              }
            }
          );
        } else {
          res.send("There is no article with the given title! ");
        }
      }
    );
  })

  .delete(function (req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, 
    function (err) {
      if (!err) {
        res.send("Article Deleted");
      } else {
        res.send(err);
      }
    });
  }
);

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
