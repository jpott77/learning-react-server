const indexRouter = require('../routes/index');
const authRouter = require('../routes/auth');

module.exports = function (app) {
  app.use('/api', indexRouter);
  app.use('/api/auth', authRouter)
  
};