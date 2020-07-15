const mongoose=require('mongoose');
const modelName='user';
const schemas={
  name: { type: String, required: true, unique: true, index: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role:{type:Number,max:5},
  token: { type: String, select: false },
  description: { type: String },
  active: { type: Number },
  signuptime: { type: Number },
  avatar: {type: String},
  github: {type: String},
};
const dataSchema=new mongoose.Schema(schemas);

module.exports={modelName,dataSchema};


