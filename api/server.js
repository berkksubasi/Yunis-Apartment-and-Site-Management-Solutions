const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 


mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.log('MongoDB bağlantı hatası:', err));

// Kullanıcı rotalarını ekleyin
app.use('/api', userRoutes);

app.get('/', (req, res) => {
  res.send('Backend çalışıyor');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
