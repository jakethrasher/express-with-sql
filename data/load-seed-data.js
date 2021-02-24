const client = require('../lib/client');
// import our seed data:
const { records } = require('./data.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
const { categoriesData } = require('./categories.js');

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

      categoriesData.map(category => {
        const { name } = category;
        
        return client.query(`
                      INSERT INTO categories (name)
                      VALUES ($1)
                      RETURNING *;
                  `,
        [name]);
      })
    );
      
   
    await Promise.all(
      records.map(item => {
        return client.query(`
                    INSERT INTO records (artist, album, image_url, condition, category_id, price, owner_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
        [
          item.artist, 
          item.album, 
          item.image_url, 
          item.condition, 
          item.category_id,
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
