const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const dbConnection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log(`Connected to database: ${dbConnection.connection.host}`);
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;
