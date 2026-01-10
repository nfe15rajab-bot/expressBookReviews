const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
    const exists=users.filter((user)=>user.username === username);
    if (exists.length===0){
        users.push({"username":username, "password":password});
        return res.status(200).json({message:"user successfully registered"});
    } else {
        return res.status(404).json({message:"User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user!"});
});

// Get the book list available in the shop
c

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.send(JSON.stringify(book, null,4));
  }else{
    return res.status(404).json({message:"Book not found"});
  }
    });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; // 1. Get author from URL
    const bookKeys = Object.keys(books); // 2. Get all ISBNs (keys)
    let results = [];
  
    // 3. Iterate through the books to find matches
    bookKeys.forEach(key => {
      if (books[key].author === author) {
        results.push(books[key]);
      }
    });
  
    // 4. Return the results
    if (results.length > 0) {
      return res.send(JSON.stringify(results, null, 4));
    } else {
      return res.status(404).json({message: "No books found by this author"});
    }
  });

// Get all books based on title
// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books); // Get all keys from the books object
    let results = [];
  
    bookKeys.forEach(key => {
      if (books[key].title === title) {
        results.push(books[key]);
      }
    });
  
    if (results.length > 0) {
      return res.send(JSON.stringify(results, null, 4)); // Use JSON.stringify for neat output
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // 1. Extract ISBN from the URL parameters
    const book = books[isbn];     // 2. Use the ISBN to find the book in your database
  
    if (book) {
      // 3. Return only the reviews property of the found book
      return res.send(JSON.stringify(book.reviews, null, 4));
    } else {
      // 4. Return an error if the ISBN doesn't exist
      return res.status(404).json({message: "Book not found"});
    }
  });

module.exports.general = public_users;
