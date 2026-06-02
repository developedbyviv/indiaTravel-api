const mongoose = require('mongoose');
const uri = 'mongodb://127.0.0.1:27017/india-travel';
console.log('Connecting to:', uri);

mongoose.connect(uri)
  .then(() => {
    console.log('SUCCESS');
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILED:', err);
    process.exit(1);
  });
