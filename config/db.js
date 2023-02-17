const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    console.log(`process.env.MONGO_URI-> ${process.env.MONGO_URI}`);
    const conn = await mongoose.connect('mongodb+srv://chip:YceCLg0VqKhcv3oS@clusterchipdale.ub6uo.mongodb.net/ClusterChipDale?retryWrites=true&w=majority',
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