const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    console.log(`process.env.DATABASE_URL -> ${process.env.DATABASE_URL}`);
    const conn = await mongoose.connect(process.env.DATABASE_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      })

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
}

module.exports = connectDB;