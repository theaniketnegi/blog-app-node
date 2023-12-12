const { Router } = require("express");
const Blog = require("../models/blog");
const multer  = require('multer')
const path = require('path');

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
    return res.redirect(`/blog/${blog._id}`);
})
module.exports = router;