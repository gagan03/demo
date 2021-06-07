const express = require('express');
const mongoose = require("mongoose");

const Post = require("./models/post");
const app = express();
const bodyparser = require("body-parser");

var cors = require('cors');

app.use(cors());



mongoose.connect(
  "mongodb+srv://max1:gjUdFmh9TREHxEr6@cluster.yktxl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useNewUrlParser: true }).then(() => {
  console.log("Connected to database!");
})
.catch(() => {
  console.log("Connection failed!");
});

app.use(bodyparser.json());


app.use((req,res,next) =>
{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


app.post("/api/posts",(req,res,next) => {
  const post = new Post({
    device: req.body.device,
    signal:req.body.signal,
    state: req.body.state

  });
  post.save();

  res.status(201).json({   //its getting saved in the server.
    message: "Post added successfully",
    post
  });
});


// app.use('/api/posts',async (req,res,next)=>
// {

//   const posts= await Post.find({});
//   res.status(200).json(
//     {
//       message:'Post fetched successfully',
//       posts:posts
//     }
//   );
// });
app.get("/api/posts", async (req, res, next) => {

  const pageSize=+req.query.pagesize;
  const currentPage=+req.query.page;
  const postcount=await Post.countDocuments();

  console.log(postcount)

  const postQuery = Post.find();

  if(pageSize && currentPage)
  {
    postQuery.skip(pageSize*(currentPage-1))
    .limit(pageSize);
  }


  postQuery.then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents,
      postcount

    });
  });
});


app.put("/api/posts/:id",(req,res,next) =>
{
  const post=new Post(
    {
      _id:req.body.id,
      device:req.body.device,
      signal:req.body.signal,
      state:req.body.state

    }
  )
  Post.updateOne({_id:req.params.id},post).then( result =>
    {
      console.log(result);
      res.status(200).json(
        {
          message:"Update success"
        }
      );
    })
})


app.delete("/api/posts/:id",(req,res,next)=>
{

  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = app;
