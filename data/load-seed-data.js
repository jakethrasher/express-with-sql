const client = require('../lib/client');
// import our seed data:
const { records } = require('./data.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      records.map(item => {
        return client.query(`
                    INSERT INTO records (artist, album, image_url, condition, category, price, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
        [
          item.artist, 
          item.album, 
          item.image_url, 
          item.condition, 
          item.category, 
          item.price, 
          user.id]);
      })
    );
    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
