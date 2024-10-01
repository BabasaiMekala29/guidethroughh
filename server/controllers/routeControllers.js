const User = require('../models/User');
const Post = require('../models/Post');
const nodemailer = require('nodemailer');
require('dotenv').config();
const Bookmarks = require('../models/Bookmarks');
const Notifications = require('../models/Notifications');
const tipNotification = require('../models/TipNotification');
const jwt = require('jsonwebtoken');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
var validator = require('validator');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
    }
})



const sendMail = async (transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log('sent')
    }
    catch (err) {
        console.log('not sent')
        console.log(err);
    }
}



async function getRandomPostDescription() {
    try {
        const posts = await Post.find({ section: { $in: ["No-gos", 'Advice'] } });
        const totalCount = posts.length;
        const randomIndex = Math.floor(Math.random() * totalCount);
        return posts[randomIndex].description;
    }
    catch (err) {
        console.log('Cannot get random post');
        return 0;
    }
}

module.exports.get_tipnotification = async (req, res) => {
    const { uid } = req.params;
    let userMail;
    try {
        const userData = await User.findById(uid);
        userMail = userData.email;
    }
    catch (err) {
        console.log(err);
    }
    const userData = await tipNotification.findOne({ userinfo: uid });
    // console.log("sjnkw ",userData);
    if (userData) {
        const currentTime = new Date().getTime();
        const randomPostDescription = await getRandomPostDescription();
        if (!userData.tip || currentTime - userData.lastNotificationTimestamp > 24 * 60 * 60 * 1000) {
            userData.tip = randomPostDescription;
            userData.lastNotificationTimestamp = currentTime;
            const mailOptions = {
                from: {
                    name: "guide through",
                    address: process.env.USER
                },
                to: userMail,
                subject: 'Now you know',
                text: randomPostDescription
            }
            sendMail(transporter, mailOptions);
            await userData.save();
        }

        // console.log(userData);
        res.status(200).json(userData);
    }
    else {
        console.log('userData');
        res.status(404).json({ error: 'User notification record not found' });
    }
}

function handleErrors(err) {
    let errors = { username: '', email: '', password: '', title: '', description: '' };
    if (err.message === 'No recipients defined') {
        errors.email = 'e-mail not registered'
    }
    if (err.message === 'Incorrect username') {
        errors.email = 'user not registered'
    }
    if (err.message === 'Incorrect email') {
        errors.email = 'e-mail not registered'
    }
    if (err.message === 'Incorrect password') {
        errors.password = 'incorrect password'
    }
    if (err.code === 11000) {
        if (err.keyValue.username) {
            errors.username = "username already exists";
        }
        if (err.keyValue.email) {
            errors.email = "email already exists";
        }
        return errors;
    }
    // console.log(err.message)
    if (err.message.includes('Post validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }

    if (err.message.includes('user validation failed')) {
        // console.log(err.message)
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        })
    }
    return errors;
}

const maxAge = 30 * 24 * 60 * 60;
let otpText;

module.exports.get_otp = async (req, res) => {
    const { email } = req.body;
    console.log(validator.isEmail(email));
    const otpNum = Math.floor(1000+Math.random()*9000).toString();
    otpText = otpNum;
    
    console.log(typeof(otpNum))
    try{
        const userDoc = await User.findOne({email:email});
        console.log(userDoc)
        if(userDoc){
            res.status(400).json({ errors: "E-mail already exists"});
        }
        else if(!validator.isEmail(email)){
            res.status(400).json({ errors: "Enter valid E-mail"});
        }
        else{
            const mailOptions = {
                from: {
                    name: "guide through",
                    address: process.env.USER
                },
                to: email,
                subject: 'Verification code for Guidethrough account creation',
                text: otpNum
            }
            const sendMail =async (transporter, mailOptions) => {
                try {
                    await transporter.sendMail(mailOptions);
                    res.status(200).json({ otp: "sent" });
                    console.log('sent')
                }
                catch (err) {
                    res.status(400).json({ errors: "Enter valid E-mail"});
                    console.log(err);
                    
                }
            }
            sendMail(transporter,mailOptions);   
        }

    }
    catch (err) {
        console.log('c2')
        console.log(err)
    }
}

module.exports.verifyotp = (req,res) =>{
    const { otp } = req.body;
    console.log(otpText);
    if(otp===otpText){
        res.status(200).json({ otp: "matched" });
    }
    else{
        res.status(400).json({ error: "mismatched" });
    }
}

function createToken(id, username) {
    return jwt.sign({ id, username }, process.env.JWT_SECRET, { expiresIn: maxAge });
}

module.exports.signup_post = async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(req.body);  
    try {
        const user = await User.create({ username, email, password });
        await tipNotification.create({ userinfo: user._id });
        const token = createToken(user._id, user.username);
        // console.log("token",token)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite:'None', secure:true });
        res.status(201).json({ user, token });
    }
    catch (err) {
        const errors = handleErrors(err);
        // console.log(errors)
        res.status(400).json({ errors });
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const userData = await tipNotification.findById(user._id);
        if (!userData) {
            await tipNotification.create({ userinfo: user._id });
        }
        const token = createToken(user._id, user.username);
        // console.log("token",token)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, sameSite:'None', secure:true });
        // console.log(user);
        res.status(200).json({ user, token });
    }
    catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');

}



module.exports.profile_get = (req, res) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'Token not found' })
    }
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }
        //   console.log(info)
        res.json(info);
    })

}

module.exports.create_post = async (req, res) => {
    const token = req.cookies.jwt;
    console.log("title ", req.body.title)
    if (!token) {
        return res.status(401).json({ error: 'Token not found' })
    }
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }
        //   console.log(info)
        // console.log(req.body);
        try {
            const postDoc = await Post.create({
                ...req.body,
                author: info.id
            })
            // console.log(postDoc)
            res.json({ postDoc })
        }
        catch (err) {
            const errors = handleErrors(err);
            console.log("errors ", errors);
            res.status(400).json({ errors });
        }

    })
}

module.exports.get_posts = async (req, res) => {
    try {
        const { head, subhead } = req.params;

        // Query posts based on category and subcategory
        const posts = await Post.find({
            category: head,
            subcategory: subhead
        })
        const authorIds = posts.map(post => post.author);

        // Query authors based on their IDs
        const authors = await User.find({ _id: { $in: authorIds } });

        // Create a map of author IDs to authors for easy lookup
        const authorMap = authors.reduce((map, author) => {
            map[author._id] = author;
            return map;
        }, {});

        // Update each post object with author details
        const postsWithAuthorInfo = posts.map(post => {
            return {
                ...post.toObject(), // Convert Mongoose document to plain JavaScript object
                author: authorMap[post.author]
            };
        });

        res.json(postsWithAuthorInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.get_userposts = async (req, res) => {
    const { id } = req.params;
    try {
        const posts = await Post.find({
            author: id
        })
        res.json({ posts });
    }
    catch (err) {
        console.log('userposts ', err)
        res.status(400).json({ err });
    }
}

module.exports.delete_post = async (req, res) => {
    const { id } = req.params;
    try {
        // Check if the post exists
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // If the post exists, delete it
        await Post.findByIdAndDelete(id);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.edit_post = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    // console.log(title,description)
    try {
        // Find the post by ID
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Update the post with the new data
        post.title = title;
        post.description = description;
        await post.save();

        res.json(post); // Send back the updated post
    } catch (error) {
        const errors = handleErrors(error);
        console.log("errors ", errors);
        res.status(400).json({ errors });
        // console.error('Error updating post:', error);
        // res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_upvote = async (req, res) => {
    const { postid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(postid);

        // Check if the user has already upvoted the post
        const alreadyUpvoted = post.upvotes.includes(user);
        const alreadyDownvoted = post.downvotes.includes(user);

        if (alreadyUpvoted) {
            // Remove user from upvotes array and decrease upvote count
            post.upvote = post.upvote - 1;
            post.upvotes = post.upvotes.filter(upvoter => upvoter !== user);
        } else {
            if (alreadyDownvoted) {
                post.downvote = post.downvote - 1;
                post.downvotes = post.downvotes.filter(downvoter => downvoter !== user);
            }
            // Add user to upvotes array and increase upvote count
            post.upvote = post.upvote + 1;
            post.upvotes.push(user);
        }

        // Save the updated post
        await post.save();

        res.status(200).json({ up: post.upvote, down: post.downvote });
    } catch (error) {
        console.error('Error toggling upvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.put_downvote = async (req, res) => {
    const { postid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(postid);

        // Check if the user has already downvoted the post
        const alreadyDownvoted = post.downvotes.includes(user);
        const alreadyUpvoted = post.upvotes.includes(user);
        if (alreadyDownvoted) {
            // Remove user from downvotes array and decrease downvote count
            post.downvote = post.downvote - 1;
            post.downvotes = post.downvotes.filter(downvoter => downvoter !== user);
        } else {
            if (alreadyUpvoted) {
                post.upvote = post.upvote - 1;
                post.upvotes = post.upvotes.filter(upvoter => upvoter !== user);
            }
            // Add user to downvotes array and increase downvote count
            post.downvote = post.downvote + 1;
            post.downvotes.push(user);
        }

        // Save the updated post
        await post.save();
        res.status(200).json({ up: post.upvote, down: post.downvote });
        // res.status(200).json({ message: 'Downvote toggled successfully' });
    } catch (error) {
        console.error('Error toggling downvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_like = async (req, res) => {
    const { postid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(postid);

        // Check if the user has already liked the post
        const alreadyLiked = post.loves.includes(user);

        if (alreadyLiked) {
            // Remove user from loves array and decrease like count
            post.likes = post.likes - 1;
            post.loves = post.loves.filter(liker => liker !== user);
        } else {
            // Add user to loves array and increase like count
            post.likes = post.likes + 1;
            post.loves.push(user);
        }

        // Save the updated post
        await post.save();
        res.status(200).json(post.likes);
        // res.status(200).json({ message: 'like toggled successfully' });
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.save_post = async (req, res) => {
    const { postid } = req.params;
    const { user, cmtId, username } = req.body;
    console.log(user, username)
    try {
        const postDoc = await Post.findById(postid);
        let i;
        // for (i = 0; i < postDoc.comments.length; i++) {
        //     if (postDoc.comments[i]._id.toString() === cmtId) {
        //         if (!(postDoc.comments[i].booked.includes(username))) postDoc.comments[i].booked.push(username);
        //     }
        // }
        for (let comment of postDoc.comments) {
            if (comment._id.toString() === cmtId) {
                if (!(comment.booked.includes(username))) comment.booked.push(username);
            }
        }
        await postDoc.save();
        const doc = await Bookmarks.findOne({
            userinfo: user
        })
        // console.log(postDoc);
        // console.log('ejk',!doc)
        if (!doc) {
            // console.log('ijenejk')
            const newDoc = await Bookmarks.create({
                userinfo: user,
                saves: [postDoc],
            })

            res.json(newDoc);
            // console.log("newdoc ", newDoc)
        }

        else {
            if (!doc.saves.includes(postDoc._id)) {
                doc.saves.push(postDoc);
                await doc.save();
            }
            res.json(doc);
        }

    }
    catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error. Unable to save' });
    }
}

module.exports.get_savedposts = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    try {


        const posts = await Bookmarks.findOne({
            userinfo: id
        }).populate({
            path: 'saves',
            select: ['title', 'description', 'category', 'subcategory', 'section', 'createdAt', 'comments'],
            populate: {
                path: 'author',
                model: 'user', // Assuming your User model is named 'User'
                select: 'username' // Retrieving only the username from the User collection
            }
        });
        // console.log("posts  ", posts.saves);
        if (posts) {
            res.json(posts.saves);
        }
        else res.json([]);
    }
    catch (err) {
        console.log(err)
        res.status(400).json({ err });
    }
}

module.exports.unsavepost = async (req, res) => {
    const { postid } = req.params;
    const { id, username } = req.body;
    // console.log(id);
    try {
        const postDoc = await Post.findById(postid);
        let i;
        // for (i = 0; i < postDoc.comments.length; i++) {
        //     postDoc.comments[i].booked = false;
        // }
        if (postDoc) {
            for (let comment of postDoc.comments) {
                const index = comment.booked.findIndex(uname => uname === username);
                if (index !== -1) {
                    comment.booked.splice(index, 1);
                }
            }

            await postDoc.save();
        }
        const posts = await Bookmarks.findOne({
            userinfo: id
        })
        const index = posts.saves.findIndex(post => post._id.toString() === postid);
        if (index !== -1) {
            posts.saves.splice(index, 1);
            await posts.save();
        }
        // console.log("index ", posts.saves);

        res.json(posts.saves);
    }
    catch (err) {
        res.status(400).json({ error: 'Internal server error' });
    }
}

module.exports.get_sortedposts = async (req, res) => {
    const { head, subhead, sec } = req.params;
    try {
        //Popular, Most Useful, Recent, None
        let posts;
        if (sec === "Popular") {
            posts = await Post.find({
                category: head,
                subcategory: subhead
            }).sort({ upvote: -1 })
        }
        else if (sec === "Most Useful") {
            posts = await Post.find({
                category: head,
                subcategory: subhead
            }).sort({ likes: -1 })
        }
        else if (sec === "Recent") {
            posts = await Post.find({
                category: head,
                subcategory: subhead
            }).sort({ createdAt: -1 })
        }
        else if (sec === "Unanswered") {
            posts = await Post.find({
                category: head,
                subcategory: subhead,
                comments: { $size: 0 }
            })
        }
        else {
            posts = await Post.find({
                category: head,
                subcategory: subhead
            })
        }

        const authorIds = posts.map(post => post.author);

        // Query authors based on their IDs
        const authors = await User.find({ _id: { $in: authorIds } });

        // Create a map of author IDs to authors for easy lookup
        const authorMap = authors.reduce((map, author) => {
            map[author._id] = author;
            return map;
        }, {});

        // Update each post object with author details
        const postsWithAuthorInfo = posts.map(post => {
            return {
                ...post.toObject(), // Convert Mongoose document to plain JavaScript object
                author: authorMap[post.author]
            };
        });

        res.json(postsWithAuthorInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports.put_comments = async (req, res) => {
    const { postid } = req.params;
    const { user, comment } = req.body;
    try {
        const post = await Post.findById(postid);
        post.comments.push({ user, comment });
        await post.save();
        res.json(post.comments);
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_comments = async (req, res) => {
    const { postid } = req.params;
    try {
        const post = await Post.findById(postid);
        if (post) {
            res.json(post.comments);
        }
        else {
            res.json([]);
        }
    }
    catch (error) {
        console.error('Error getting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_fullPost = async (req, res) => {
    const { id } = req.params;
    // console.log("id ",id);
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(id);
        const author = await User.findById(post.author);
        if (!author) {
            return res.status(404).json({ error: 'Author not found' });
        }

        // Merge the author data into the post object
        const postWithAuthor = {
            ...post.toObject(), // Convert Mongoose document to plain JavaScript object
            author: {
                _id: author._id,
                username: author.username,
                // Add more author fields if needed
            }
        };

        res.json(postWithAuthor);

        // const authname = post.author.username;
        // console.log(post);
        // res.json(post);

    }

    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.get_interactions = async (req, res) => {
    const { id, username } = req.params;
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(id);
        // const authname = post.author.username;
        let uped = false;
        for (let user of post.upvotes) {
            if (user === username) {
                uped = true;
                break;
            }
        }
        let downed = false;
        for (let user of post.downvotes) {
            if (user === username) {
                downed = true;
                break;
            }
        }
        let impressed = false;
        for (let user of post.loves) {
            if (user === username) {
                impressed = true;
                break;
            }
        }

        res.json({ positive: post.upvote, negative: post.downvote, fav: post.likes, uped, downed, impressed });
    }
    catch (error) {
        console.error('Error fetching interactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.get_cominteractions = async (req, res) => {
    const { pid, cid, uname } = req.params;
    // console.log("pid",pid);
    // console.log("cid",cid);
    try {
        // const post = await Post.findById(id);
        const post = await Post.findById(pid);
        let comment;
        for (let cmt of post.comments) {
            if (cmt._id.toString() === cid) {
                // console.log("1")
                comment = cmt;
            }
        }
        let upStatus = false;
        for (let user of comment.upvoters) {
            if (user === uname) {
                upStatus = true;
                break;
            }
        }
        let downStatus = false;
        for (let user of comment.downvoters) {
            if (user === uname) {
                downStatus = true;
                break;
            }
        }
        // const authname = post.author.username;
        // console.log(comment.comUpvote);

        res.json({ pos: comment.comUpvote, neg: comment.comDownvote, upStatus, downStatus });
    }
    catch (error) {
        console.error('Error fetching comment interactions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}



module.exports.put_comupvote = async (req, res) => {
    const { pid, cid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(pid);

        let comment;
        for (let cmt of post.comments) {
            if (cmt._id.toString() === cid) {
                comment = cmt;
            }
        }

        // Check if the user has already upvoted the comment
        const alreadyUpvoted = comment.upvoters.includes(user);
        const alreadyDownvoted = comment.downvoters.includes(user);
        if (alreadyUpvoted) {
            // Remove user from upvotes array and decrease upvote count
            comment.comUpvote = comment.comUpvote - 1;
            comment.upvoters = comment.upvoters.filter(upvoter => upvoter !== user);
        } else {
            if (alreadyDownvoted) {
                comment.comDownvote = comment.comDownvote - 1;
                comment.downvoters = comment.downvoters.filter(downvoter => downvoter !== user);
            }
            // Add user to upvotes array and increase upvote count
            comment.comUpvote = comment.comUpvote + 1;
            comment.upvoters.push(user);
        }

        // Save the updated post
        // await comment.save();
        await post.save();
        res.status(200).json({ up: comment.comUpvote, down: comment.comDownvote });
        // res.status(200).json({ message: 'upvote toggled successfully' });
    } catch (error) {
        console.error('Error toggling upvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_comdownvote = async (req, res) => {
    const { pid, cid } = req.params;
    const { user } = req.body;

    try {
        // Find the post by postId
        const post = await Post.findById(pid);
        // console.log(post)
        let comment;
        for (let cmt of post.comments) {
            if (cmt._id.toString() === cid) {
                comment = cmt;
            }
        }

        // Check if the user has already downvoted the comment
        const alreadyDownvoted = comment.downvoters.includes(user);
        const alreadyUpvoted = comment.upvoters.includes(user);
        if (alreadyDownvoted) {
            // Remove user from downvotes array and decrease downvote count
            comment.comDownvote = comment.comDownvote - 1;
            comment.downvoters = comment.downvoters.filter(downvoter => downvoter !== user);
        } else {
            if (alreadyUpvoted) {
                comment.comUpvote = comment.comUpvote - 1;
                comment.upvoters = comment.upvoters.filter(upvoter => upvoter !== user);
            }
            // Add user to downvotes array and increase downvote count
            comment.comDownvote = comment.comDownvote + 1;
            comment.downvoters.push(user);
        }

        // Save the updated post
        // await comment.save();
        await post.save();
        res.status(200).json({ up: comment.comUpvote, down: comment.comDownvote });
        // res.status(200).json({ message: 'Downvote toggled successfully' });
    } catch (error) {
        console.error('Error toggling downvote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.put_notification = async (req, res) => {
    const { id } = req.params;
    const { user, by, comment, category, subcategory, section } = req.body;
    // console.log('user', user);
    // console.log('post', post);
    // console.log('by', by);
    // console.log('comment', comment);
    // console.log('category', category);
    // console.log('subcategory', subcategory);
    // console.log('section', section);
    // console.log(post===id);
    console.log(section == 'Q&A')
    try {
        const doc = await Notifications.findOne({
            userinfo: user
        })
        if (!doc) {
            if (section == 'Q&A') {

                const newDoc = await Notifications.create({
                    userinfo: user,
                    notifs: [{ commentText: comment, postDetails: id, by, category, subcategory, section }],
                })
            }

            res.json(newDoc);
        }

        else {
            if (section == 'Q&A') {
                doc.notifs.push({ commentText: comment, postDetails: id, by, category, subcategory, section });
                await doc.save();
            }
            res.json(doc);
        }

        // console.log("notificaion dhi ", doc);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports.get_notifications = async (req, res) => {
    const { userid } = req.params;
    // console.log('userid  ', userid)
    try {
        const notifications = await Notifications.findOne({ userinfo: userid });
        if (notifications) {
            res.json(notifications.notifs.reverse());
        }
        else {
            res.json([]);
        }

    }
    catch (err) {
        res.status(500).json({ error: 'Cannot find user' });
    }
}

module.exports.get_searchresults = async (req, res) => {
    const { searchValue } = req.params;
    try {
        const posts = await Post.find({
            $or: [
                { title: { $regex: searchValue, $options: 'i' } }, // Case-insensitive search
                { description: { $regex: searchValue, $options: 'i' } }
            ]
        });
        // console.log(posts);
        const authorIds = posts.map(post => post.author);

        // Query authors based on their IDs
        const authors = await User.find({ _id: { $in: authorIds } });

        // Create a map of author IDs to authors for easy lookup
        const authorMap = authors.reduce((map, author) => {
            map[author._id] = author;
            return map;
        }, {});

        // Update each post object with author details
        const postsWithAuthorInfo = posts.map(post => {
            return {
                ...post.toObject(), // Convert Mongoose document to plain JavaScript object
                author: authorMap[post.author]
            };
        });
        // console.log(postsWithAuthorInfo)
        res.json(postsWithAuthorInfo);

    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports.get_notificationcount = async (req, res) => {
    const { userid } = req.params;
    try {
        const notifications = await Notifications.findOne({ userinfo: userid });
        // for(let i=0;i<notifications.notifs.length;i++) console.log(i,notifications.notifs[i].viewed);

        if (notifications) {
            res.json(notifications.notifs);
            
        }
        else {
            res.json([]);
        }

    }
    catch (err) {
        console.log("err", err)
        res.status(500).json({ error: 'Cannot find notifications' });
    }
}

module.exports.make_viewed = async (req, res) => {
    const { nid } = req.params;
    const { user } = req.body;
    console.log(nid);
    // req.json(nid);
    try {
        const notifications = await Notifications.findOne({ userinfo: user });

        for (let i = 0; i < notifications.notifs.length; i++) {
            if (notifications.notifs[i]._id == nid) {
                notifications.notifs[i].viewed = true;
                break;
            }
        }
        await notifications.save();
        res.json(notifications.notifs);

    }
    catch (err) {
        res.status(500).json({ error: 'Cannot find user' });
    }
}

module.exports.check_post = async (req, res) => {
    const { id } = req.params;
    try {
        const postData = await Post.findById(id);
        if (!postData) {
            // console.log('if')
            return res.status(404).json({ message: 'Post not found' });
        }
        else {
            // console.log('else')
            return res.status(200).json({ message: 'Post found' });
        }
    }
    catch (err) {
        console.log(err)
        return res.status(404).json({ message: 'unable to find' });
    }
}
