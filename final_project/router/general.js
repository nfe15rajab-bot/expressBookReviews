const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register User
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        const exists = users.filter((user) => user.username === username);
        if (exists.length === 0) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "user successfully registered" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user!" });
});

// Task 10: Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) { // Added 'async'
    try {
        const getBooksList = new Promise((resolve) => {
            resolve(books);
        });
        const bookList = await getBooksList;
        return res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list" });
    }
});

// Task 11: Get book details based on ISBN using Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const getBookByIsbn = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });
        const book = await getBookByIsbn;
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            // FIXED: Added 'book => book.author' to fix syntax error
            const filteredBooks = Object.values(books).filter(book => book.author === author);
            
            // FIXED: Added check for empty results
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject("No books found for this author");
            }
        });
        const result = await getBooksByAuthor;
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 13: Get all books based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            const filteredBooks = Object.values(books).filter(book => book.title === title);
            if (filteredBooks.length > 0) {
                resolve(filteredBooks);
            } else {
                reject("No books found with this title");
            }
        });
        const result = await getBooksByTitle;
        return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(404).json({ message: error });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
