module.exports = process.env.NB_COV ? require('./lib-cov/client') : require('./lib/client');