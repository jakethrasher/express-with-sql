require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns records', async() => {

      const expectation = [
        {
          id:1,
          artist: '4hero',
          album: 'Parallel Universe',
          image_url: 'https://img.discogs.com/vxFq6LdcKwQGKafp2ody9lxP7H4=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-165598-1539913995-2404.jpeg.jpg',
          condition: 'Near Mint',
          category: '90\'s electronic',
          price: 25,
          owner_id:1
        },
        {
          id:2,
          artist: 'Hardrive',
          album: 'Deep Inside -Ep',
          image_url: 'https://img.discogs.com/5spOhHtJmHqH8Dd8jpczb-88zqc=/fit-in/500x500/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-20174-1479150151-4220.jpeg.jpg',
          condition: 'Very Good',
          category: '90\'s electronic',
          price: 40,
          owner_id:1
        },
        {
          id:3,
          artist: 'Crystal Waters',
          album: 'Gypsy Woman(She\'s Homeless)',
          image_url: 'https://img.discogs.com/TXEtaXhJRzb5EyrH8qUi2CY46Hg=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-899617-1303174618.jpeg.jpg',
          condition: 'Good',
          category: '90\'s electronic',
          price: 45,
          owner_id:1
      
        },
        {
          id:4,
          artist: 'Meat Beat Manifesto',
          album: '99%',
          image_url: 'https://img.discogs.com/AfjYcXcPyvYQqIcqXMP8s59wdW0=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-2316-1171433225.jpeg.jpg',
          condition: 'Near Mint',
          category: '90\'s electronic',
          price: 35,
          owner_id:1
        },
        {
          id:5,
          artist: 'St Germain',
          album: 'Boulevard',
          image_url: 'https://img.discogs.com/u5gt-Kffj9J5JRd0oc4vLeGbArc=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-21982-1420641781-1700.jpeg.jpg',
          condition: 'Very Good',
          category: '90\'s electronic',
          price: 35,
          owner_id:1
        },
        {
          id:6,
          artist: 'Aphex Twin',
          album: 'Come To Daddy',
          image_url: 'https://img.discogs.com/x8ylz_d53GEVV8Gw-znkgrXe-CA=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-52184-1573464832-8266.jpeg.jpg',
          condition: 'Good',
          category: '90\'s electronic',
          price: 35,
          owner_id:1
        },
        {
          id:7,
          artist: 'Adonis',
          album: 'No Way Back - Single',
          image_url: 'https://img.discogs.com/f8YFlFg6TF7RNfinsilma5hXOy4=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-27332-1231412285.jpeg.jpg',
          condition: 'Mint',
          category: '90\'s electronic',
          price: 12,
          owner_id:1
        },
      ];

      const data = await fakeRequest(app)
        .get('/records')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns the matching record', async() => {

      const expectation = 
        {
          id:1,
          artist: '4hero',
          album: 'Parallel Universe',
          image_url: 'https://img.discogs.com/vxFq6LdcKwQGKafp2ody9lxP7H4=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-165598-1539913995-2404.jpeg.jpg',
          condition: 'Near Mint',
          category: '90\'s electronic',
          price: 25,
          owner_id:1
        };

      const data = await fakeRequest(app)
        .get('/records/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
