const errorHandler = (schema) => {
  let checkError = (error, doc, next) => {
    console.log('error is: ', error);
    if (error.name === 'MongoError' && error.code === 11000) {
      let messageSplit = error.message.split(' ');
      next(new Error(messageSplit[7].split('_')[0] + ' ' + messageSplit[12].slice(1, -1) + ' already existed'));
    } else if ((error.name = 'ValidationError')) {
      next(new Error(error.message.split(': ')[2]));
    } else {
      next();
    }
  };

  schema.post('save', checkError);
  schema.post('update', checkError);
  schema.post('findOneAndUpdate', checkError);
  schema.post('insertMany', checkError);
};

module.exports = errorHandler;
