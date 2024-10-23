const admin = require('firebase-admin');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config();

const serviceAccount = require(process.env.FIREBASE_CREDENTIALS_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
