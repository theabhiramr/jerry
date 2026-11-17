const express = require('express');
const router = express.Router();
const pool = require('./db');

function createSlug(title) {
    return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').replace(/-+/g, '-');
}

router.post('/create-post', async (req, res) => {
    const { title, content, topic, site } = req.body;
    const slug = createSlug(title);

    if (!title || !content || !topic || !site) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = req.user.id;

    const client = await pool.connect();


    try {
        const result = await pool.query(
            'INSERT INTO posts (title, content, slug, topic, site, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, content, slug, topic, site, userId]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    try{
        await client.query('BEGIN');
        const insertPostQuery = 'INSERT INTO posts (title, content, slug, topic, site, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const postResult = await client.query(insertPostQuery, [title, content, slug, topic, site, userId]);
        const postId = postResult.rows[0].id;

        const permission = await client.query('INSERT INTO permissions (user_id, post_id, permission_type) VALUES ($1, $2, $3)', [userId, postId, 'owner']);
        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

module.exports = router;

