const { loginHandler, registerHandler, profileHandler, uploadFileHandler, editProfileHandler } = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/upload',
    handler: uploadFileHandler, // Handler untuk rute upload file
    options: {
      payload: {
        output: 'file',
        allow: 'multipart/form-data',
        multipart: true,
        parse: true,
      },
    },
  },
];

module.exports = routes;
