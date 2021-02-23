const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/records', async(req, res) => {

  try {
    const data = await client.query('SELECT * from records');

    res.json(data.rows);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.get('/records/:id', async(req, res) => {
  try {
    const id = req.params.id;

    const data = await client.query('SELECT * from records where id=$1', [id]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.post('/records', async(req, res) => {

  try {
    const data = await client.query('INSERT INTO records(artist, album, image_url, condition, category, price, owner_id) VALUES ($1, $2, $3, $4, $5, $6, $7) returning *',
      [
        req.body.artist,
        req.body.album,
        req.body.image_url,
        req.body.condition,
        req.body.category,
        req.body.price,
        1
      ]
    );
    res.json(data.rows[0]);

  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.delete('/records/:id', async(req, res) => {
  try {
    const id = req.params.id;

    const data = await client.query('delete from records where id=$1 returning *', [id]);

    res.json(data.rows[0]);
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.put('/records/:id', async(req, res) => {
  
  try {
    //get id through params
    const recordId = req.params.id;

    const data = await client.query(`
    UPDATE records
    SET artist=$1, album=$2, image_url=$3, condition=$4, category=$5, price=$6
    WHERE id = $7
    RETURNING *
`,
    [
      req.body.artist,
      req.body.album,
      req.body.image_url,
      req.body.condition,
      req.body.category,
      req.body.price,
      recordId,
    ]);

    res.json(data.rows[0]);
    
  } catch (e) {

    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
