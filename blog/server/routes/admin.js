const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/Users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const adminLayout = '../views/layouts/admin';

const jwtSecret = process.env.JWT_SECRET;

/** 
 * check login
 */

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json( {message: 'Unauthorized'});
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({message: 'Unauthorized'});
    }
}



/** 
 * GET /
 * HOME
 */


router.get('/admin', (req, res) => {
    try {
        const locals = {
            title: "Admin",
            description: "Simple Blog creaded with express & mongo db"
        }
        res.render('admin/index', {locals, layout: adminLayout});
    }catch (err){
        console.log(err);
    }
});


/** 
 * POST /
 * Admin check login
 */

router.post('/admin', async (req, res) => {
    try {
        const { username , password} = req.body;
        const user = await User.findOne ({ username});
        if (!user) {
            return res.status(401).json({message: 'Invalid credentials'});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid){
            return res.status(401).json({message: 'Invalid credentials'});
        }


        const token = jwt.sign({userId: user._id}, jwtSecret);
        res.cookie('token', token, {httpOnly: true});
        // res.render('admin/index', {locals, layout: adminLayout});
        res.redirect('/dashboard');
    }catch (err){
        console.log(err);
    }
});

/** 
 * get /
 * dashboard
 */

router.get('/dashboard',  authMiddleware, async (req, res) => {
    try {
        const locals = {
            title: 'Dashboard',
            description: 'Simple blog created with node js , express & MongoDb'
        }
        const data =  await Post.find();
        res.render('admin/dashboard', {
            locals,
            data,
            layout: adminLayout
        });


    } catch (error) {
        res.status(401).json({message: "khjidd"})
    }
});

/** 
 * get /
 * admin ceate a new post
 */
router.get('/add-post', authMiddleware, async (req, res) =>{
    try {
        const locals = {
            title: 'Add Post',
            description: 'Simple blog created with NodeJs, Express & MongoDB'
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            data,
            layout: adminLayout
        })
    } catch (error) {
        console.log(error);
    }

});

/** 
 * Put /
 * admin ceate a new post
 */
router.get('/edit-post/:id', authMiddleware, async (req, res) =>{
    try {
        const locals = {
            title: 'Edit Post',
            description: 'Free NodeJs User Managment System'
        };
        const data = await Post.findById({ _id: req.params.id});

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout
        })
        
    } catch (error) {
        console.log(error);
    }

});



/** 
 * Put /
 * admin ceate a new post
 */
router.put('/edit-post/:id', authMiddleware, async (req, res) =>{
    try {
        
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updateAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);

    } catch (error) {
        console.log(error);
    }

});

/** 
 * post /
 * admin ceate a new post
 */

router.post('/add-post', authMiddleware,  async (req, res) => {
    try {
        const newPost = new Post({
            title: req.body.title,
            body: req.body.body
        })
        await Post.create(newPost);
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
    }
})


/** 
 * POST /
 * regester check login
 */

router.post('/register',async (req, res) => {
    try {
        const { username , password} = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        try {
            const user = await User.create({username, password:hashedPassword});
            res.status(201).json({message: 'User Created', user});
        } catch (error) {
            if(error.code ===  11000)
                res.status(409).json({message : 'User already in use'});
            res.status(500).json({message: 'Internal server error'});
        }

    }catch (err){
        console.log(err);
    }
});


/** 
 * Delete /
 * Admin - Delete Post */

router.delete('/delete-post/:id', authMiddleware, async (req, res) =>{
    try {
        await Post.deleteOne({_id: req.params.id});
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

/** 
 * get  /
 * logout */

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/')
});



module.exports = router;
