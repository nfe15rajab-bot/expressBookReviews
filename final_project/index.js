const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    app.use("/customer/auth/*", function auth(req, res, next) {
        // Check for token in session OR in the Authorization header
        const token = req.session.authorization?.accessToken || req.headers['authorization'];
    
        if (token) {
            // If the header is "Bearer <token>", split it
            const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
    
            jwt.verify(actualToken, "access", (err, user) => {
                if (!err) {
                    req.user = user;
                    next();
                } else {
                    return res.status(403).json({ message: "User not authenticated" });
                }
            });
        } else {
            return res.status(403).json({ message: "User not logged in" });
        }
    });
    //Write the authenication mechanism here
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
