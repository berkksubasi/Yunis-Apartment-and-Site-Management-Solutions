const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    if (req.url.endsWith('/register')) {
      // REGISTER
      const { name, email, password, role } = req.body;
      try {
        await client.connect();
        const db = client.db('mydatabase');
        const users = db.collection('users');

        const newUser = { name, email, password, role };
        const result = await users.insertOne(newUser);
        res.status(201).json(result.ops[0]);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    } else if (req.url.endsWith('/login')) {


      // LOGIN
      const { username, password } = req.body;

      if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        return res.json({ userType: 'admin' });
      } else if (username === process.env.RESIDENT_USERNAME && password === process.env.RESIDENT_PASSWORD) {
        return res.json({ userType: 'resident' });
      } else if (username === process.env.SECURITY_USERNAME && password === process.env.SECURITY_PASSWORD) {
        return res.json({ userType: 'security' });
      } else {
        return res.status(401).json({ message: 'Hatalı kullanıcı adı veya şifre' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
