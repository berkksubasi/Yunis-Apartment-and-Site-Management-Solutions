const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.log(err));

const createUsers = async () => {
  try {
    const admin = new User({
      name: 'Admin User',
      email: 'admin@yunis.com',
      password: 'adminpassword', 
      role: 'admin'
    });

    const resident = new User({
      name: 'Resident User',
      email: 'resident@yunis.com',
      password: 'residentpassword',
      role: 'resident'
    });

    const security = new User({
      name: 'Security User',
      email: 'security@yunis.com',
      password: 'securitypassword',
      role: 'security'
    });

    await admin.save();
    await resident.save();
    await security.save();

    console.log('Kullanıcılar başarıyla oluşturuldu');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createUsers();
