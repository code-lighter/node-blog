const path = require('path');
const expressEdge = require('express-edge');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = new express();
const fileUpload = require("express-fileupload");
const Post = require('./database/models/Post');
 
mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err));


app.use(fileUpload());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/post/', express.static(path.join(__dirname, 'public')));

app.use(expressEdge.engine);
app.set('views', __dirname + '/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));

const storePost = require('./middleware/storePost')
app.use('/posts/store', storePost)

app.get('/post/new', (req, res) => {
    res.render('create');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});
app.get('/', async (req, res) => {
    const posts = await Post.find({})
    res.render('index', {
        posts
    })
});

app.get('/post/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    res.render('post', {
        post
    })
});
app.post('/posts/store', (req, res) => {
    const {
        image
    } = req.files
 
    image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
        Post.create({
            ...req.body,
            image: `/posts/${image.name}`
        }, (error, post) => {
            res.redirect('/');
        });
        console.log(req.body);
    })
});
app.get('/about', (req, res) => {
    res.render('about');
});

app.listen(4000, () => {
    console.log('App listening on http://localhost:4000/')
});