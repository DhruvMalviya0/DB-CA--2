const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = 4000;

mongoose.connect(process.env.MONGO_URI,{
    // useNewUrlParser : true,
    // useUnifiedTopology : true
})

const bookSchema = mongoose.Schema({
    title:{type:String,require:true},
    author:{type:String,require:true},
    genre:{type:String,require:true},
    publishedYear:{type:Number},
    availableCopies:{type:Number,require:true},
    borrowedBy:{type:Array,default:"users"}
})

const books = mongoose.model('books',bookSchema);

app.post('/books',async (req,res) => {
    try{
        const {title,author,genre,publishedYear,availableCopies,borrowedBy} = req.body;

        if (!title,!author,!genre,!availableCopies,!borrowedBy){
            res.status(400).json({error:"Missing required field",details:error.message})
        }
        
        const newBook = new books;
        await newBook.save();
    }    
    catch(error){
        res.status(500).json({error:"Server error",details:error.message})
    }
})

app.get('/books',async (req,res) => {
    try{
        const book = books.find();
        res.status(200).send(book);
    }    
    catch(error){
        res.status(500).json({error:"Server error",details:error.message})
    }
})

app.put('/books/:id',async (req,res) => {
    try{
        const {title,author,genre,publishedYear,availableCopies,borrowedBy} = req.body;
        const updatedItem = new books.findByIdAndUpdate(
            req.params.id,
            {title,author,genre,publishedYear,availableCopies,borrowedBy},
            {new:true,runValidators}
        )
        if (!updatedItem){
            res.status(404).json({error:"Invalid book or id"})
        }
        res.status(200).json({message:"Succesfully updated",data:updatedItem})
    }catch(error){
        res.status(500).json({error:"Server error",details:error.message})
    }
})
app.delete('/books/:id',async (req,res) => {
    try{
        const deletedItem = new books.findByIdAndDelete(
            req.params.id
        )
        if (!deletedItem){
            res.status(404).json({error:"Invalid book or id"})
        }
        res.status(200).json({message:"Succesfully deleted",data:updatedItem})
    }catch(error){
        res.status(500).json({error:"Server error",details:error.message})
    }
})

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})