const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/** 
 * GET /
 * HOME
 */
router.get('/', async (req, res) => { 
  try {
    const locals = {
      title: "Node.js Blog",
      description: "Simple blog created with Node.js, Express, and MongoDB"
    };

    // Pagination setup
    const perPage = 10;
    const page = parseInt(req.query.page) || 1;

    const data = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const count = await Post.countDocuments();
    const hasNextPage = page * perPage < count;

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? page + 1 : null,
      currentRoute: '/'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

/** 
 * GET /post/:id
 * Post by ID
 */
router.get('/post/:id', async (req, res) => {
  try {
    const postId = req.params.id;

    const data = await Post.findById(postId);

    if (!data) {
      return res.status(404).send('Post not found');
    }

    const locals = {
      title: data.title,
      description: "Simple Blog created with Node.js, Express, and MongoDB."
    };
    // if (postId) 
    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${postId}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


/** 
 * post
 * Post 
 */

router.post('/search', async (req, res) => {
    try{
        const locals = {
            title:"Search",
            description: "Simple blog created with NodeJs, express & MongoDb"
        }
        let searchTerm = req.body.searchTerm;
        const searchNoSpeacialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");
        
        const data = await Post.find({
          $or: [
              {title: { $regex: new RegExp(searchNoSpeacialChar, 'i')}},
              {body: { $regex: new RegExp(searchNoSpeacialChar, 'i')}}
          ]
        });
        // console.log(data);
        if (data.length === 0) {
          // No search results found, render a message
          return res.render('search', {
              data: [{ title: "No results found", body: "The search term didn't match any posts."}],
              locals
          });
      }
        res.render('search',{
          data,
          locals
        });
    }catch (err){
        console.log(err);
    }
});

router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});

router.get('/login', (req, res) => {
  try {
    res.render('admin/index');
    
  } catch (err) {
    console.log(err);
  }
});
router.get('/register', (req, res) => {
  try {
    res.render('admin/register');
    
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
































// router.get('/post/:id', async (req, res) => {
//     try{
//         const locals = {
//             title:"Nodes Blog",
//             description: "Simple blog created with NodeJs, express & MongoDb"
//         }
//         let slug = req.params.id;
//         // console.log (slug);
//         const data = await Post.findById({ _id: slug});
//         res.render ('post', { locals, data });
//     }catch (err){
//         console.log(err);
//     }
// });



// const express = require('express');
// const router = express.Router();
// const Post = require('../models/Post');
// // const Users = require('../models/Users');

// /** 
//  * GET/
//  * HOME
// */
// //Router
// router.get('/', async (req, res) => { 

//     try{
//         const locals = {
//             title:"Nodes Blog",
//             description: "Simple blog created with NodeJs, express & MongoDb"
//         }
//         // const data = await Post.find();
//         let perPage = 10;
//         let page = req.query.page || 1;
//         // const data = await Post.aggregate([{$sort: {createdAt: -1} }])
//         const data = await Post.find()
//         .sort({createdAt: -1})
//         .skip(perPage * page - perPage)
//         .limit(perPage)
//         .exec();
//         const count = await Post.count();
//         const nextPage = parseInt(page) + 1;
//         const hasNextPage = nextPage <= Math.ceil(count / perPage);

//         res.render ('index', { 
//             locals,
//             data,
//             current: page,
//             nextPage: hasNextPage ? nextPage : null,
//             currentRoute: '/'
//         });

//     }catch (err){
//         console.log(err);
//     }
// });

// /** 
//  * GET/
//  * Post id
// */

// router.get('/post/:id', async (req, res) => {
//     try {
//       const slug = req.params.id;
  
//       const data = await Post.findById(slug);
//         if(!data){
//             return res.status(404).send('post not found');
//         }
//       const locals = {
//         title: data.title,
//         description: "Simple Blog created with NodeJs, Express & MongoDb.",
//       }
  
//       res.render('post', { 
//         locals,
//         data,
//         currentRoute: `/post/${slug}`
//       });
//     } catch (error) {
//       console.log(error);
//     }
  
//   });
// module.exports = router;




