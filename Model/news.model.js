var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var newsSchema = mongoose.Schema({
  snippet: String,
  description: String ,
  sentimentScore: Number,
  mood: String,
  date: String,
  datestamp: String,
  url: String,
  urlimage: String,
  sadness: Number,
  Joy: Number,
  fear: Number,
  disgust: Number,
  anger: Number
});

module.exports = mongoose.model('News', newsSchema);
