const express = require('express');
const router = express.Router();

// Dummy users
const users = [{ username:'admin', password:'admin' }];

router.get('/login', (req,res) => {
    res.render('login', { error:null });
});

router.post('/login', (req,res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if(user){
        req.session.user = username;
        res.redirect('/p'); // go to process timeline
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

router.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;
