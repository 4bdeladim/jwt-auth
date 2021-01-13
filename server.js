require('dotenv').config()

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.json())

const posts = [
    {
        username: "Mohammed",
        title: "Post"
    },
    {
        username: 'Kyle',
        title: 'post2'
    }
]

app.get('/posts', auth, (req, res) => {
    res.json(posts.filter( post => post.username === req.user.name))
});

app.post('/login', (req, res) => {
    const username = req.body.username ;
    const user = { name : username}
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

    res.json({ accessToken: accessToken})
})

function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    if(token === null ) return res.status(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user ) => {
        if(err) return res.sendStatus(403)
        req.user = user 
    })
    next()
}

app.listen(3000)