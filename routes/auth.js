const express = require('express');
const router = express.Router();

// Temporary hardcoded user
const user = { username: "admin", password: "admin" };

// Login page
router.get('/', (req,res) => {
    res.render('login', { error: null });
});

// Login submit
router.post('/login', (req,res) => {
    const { username, password } = req.body;
    if(username===user.username && password===user.password){
        req.session.user = username;
        return res.redirect('/dashboard');
    } else {
        res.render('login', { error: "Invalid credentials" });
    }
});

// Logout
router.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
