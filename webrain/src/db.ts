import mongoose ,{ Schema, model   } from "mongoose";

mongoose.connect("mongodb+srv://idprabal:1234567890@cluster0.tw52p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")


const UserSchema = new Schema({
    username : {type:String , required: true , unique: true },
    password : {type:String, required: true}
})

const ContentSchema = new Schema({
    title : String,
    link : String,
    tags: [{type : mongoose.Types.ObjectId, ref: "Tag"}],
    userId :{type: mongoose.Types.ObjectId , ref : 'User', required:true}
})
const LinkSchema = new Schema({
    hash : String,
    userId :{type: mongoose.Types.ObjectId , ref : 'User', required:true , unique:true}
})

export const userModel = model("User" , UserSchema);
export const contentModel = model("Content", ContentSchema);
export const linkModel = model("Share", LinkSchema);
