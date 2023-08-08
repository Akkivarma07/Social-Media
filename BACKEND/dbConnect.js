const mongoose = require("mongoose");
require("dotenv").config();

const dbPassword = process.env.dbPassword;

module.exports = async () => {
  const mongoUri = `mongodb+srv://akhilvarma11111:${dbPassword}@cluster0.spu7k1j.mongodb.net/?retryWrites=true&w=majority`;
  try {
      const connect = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log(`MongoDB Connected:${connect.connection.host}`);
    
  } catch (error) {
    console.log(error);
    process.exit(1);
    
  }
};
