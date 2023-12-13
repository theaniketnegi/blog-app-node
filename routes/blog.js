const { Router } = require("express");
const Blog = require("../models/blog");
const multer  = require('multer')
const path = require('path');
const Comment = require("../models/comment");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  
const upload = multer({ storage: storage })

const router = Router();

router.get('/add-new', (req,res)=>{
    if(!req.user)
      return res.redirect('/users/signin');
    return res.render('addBlog', {
        user: req.user
    });
});

router.post('/', upload.single('coverImage'), async (req,res)=>{
    const body = req.body;
    const blog = await Blog.create({
        title: body.title,
        body: body.body,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blogs/${blog._id}`);
})

router.post('/comments/:blogId', async (req,res)=>{
  const comment = await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  return res.redirect(`/blogs/${req.params.blogId}`);
})

router.get('/:id', async (req, res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({blogId: req.params.id}).populate("createdBy").sort({createdAt: -1});
  return res.render("blog", {
    user: req.user, 
    blog,
    comments
  })
})
module.exports = router;