const mongoose = require('mongoose');
mongoose.plugin(require('mongoose-beautiful-unique-validation')); // unique validator
mongoose.plugin(require('mongoose-paginate-v2')); // paginator
mongoose.plugin(require('mongoose-aggregate-paginate-v2'));
// aggregate paginator
const DB_URL =
  'mongodb://ViktorJJF:Sed4cfv52309$@jfbotscluster-shard-00-00.88rtm.mongodb.net:27017,jfbotscluster-shard-00-01.88rtm.mongodb.net:27017,jfbotscluster-shard-00-02.88rtm.mongodb.net:27017/pepeBot?ssl=true&replicaSet=JFBotsCluster-shard-0&authSource=admin&retryWrites=true&w=majority';
const loadModels = require('../models');

module.exports = () => {
  const connect = () => {
    mongoose.Promise = global.Promise;

    mongoose.connect(
      DB_URL,
      {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        let dbStatus = '';
        if (err) {
          dbStatus = `*    Error connecting to DB: ${err}\n****************************\n`;
        }
        dbStatus = '*    DB Connection: OK\n****************************\n';
        if (process.env.NODE_ENV !== 'test') {
          // Prints initialization
          console.log('****************************');
          console.log('*    Starting Server');
          console.log(`*    Port: ${process.env.PORT || 3000}`);
          console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`);
          console.log('*    Database: MongoDB');
          console.log(dbStatus);
        }
      },
    );
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
  };
  connect();

  mongoose.connection.on('error', console.log);
  mongoose.connection.on('disconnected', connect);

  loadModels();
};
