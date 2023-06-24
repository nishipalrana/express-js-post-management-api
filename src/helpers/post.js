const { postSchema } = require('../mongodb');
const Post = postSchema.Post;

const createPostHandler = async (req, res) => {
    try {
        const { title, description, keywords } = req?.body;
        const image = req?.file?.buffer;
        const newPost = new Post({ title, description, image, keywords, userId: req?.userId });
        await newPost.save();

        res.json(newPost);
    } catch (err) {
        console.error('Failed to create post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllPostsHandler = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req?.userId });
        if (!posts) {
            res.json({ message: 'No Post found for this' })
        }
        res.json(posts);
    } catch (err) {
        console.error('Failed to get posts:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getPostByIdHandler = async (req, res) => {
    try {
        const post = await Post.findOne({ _id: req?.params?.postId, userId: req?.userId });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error('Failed to get post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updatePostByIdHandler = async (req, res) => {
    try {
        const { title, description, keywords } = req?.body;
        const image = req?.file?.buffer;
        const updatedPost = await Post.findOneAndUpdate(
            { _id: req?.params?.postId, userId: req?.userId },
            { title, description, image, keywords },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(updatedPost);
    } catch (err) {
        console.error('Failed to update post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePostHandler = async (req, res) => {
    try {
        const deletedPost = await Post.findOneAndDelete({ _id: req?.params?.postId, userId: req?.userId });
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error('Failed to delete post:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createPostHandler, getAllPostsHandler, getPostByIdHandler, updatePostByIdHandler, deletePostHandler };