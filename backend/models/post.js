const mongoose =require('mongoose');

const postSchema = mongoose.Schema(
  {

    device:{type:String ,required:true},
    signal:{type:String,required:true},
    state:{ type:String ,required:true}

  }
);


module.exports=mongoose.model('Post',postSchema)

