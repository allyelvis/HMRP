module.exports = {
  secretKey: 'YOUR_SECRET_KEY',
  mysql: {
    host: 'localhost',
    user: 'your_mysql_user',
    password: 'your_mysql_password',
    database: 'aenzbi_db'
  },
  postgresql: {
    user: 'your_pg_user',
    host: 'localhost',
    database: 'aenzbi_db',
    password: 'your_pg_password',
    port: 5432,
  },
  mongodb: {
    uri: 'mongodb://localhost:27017/aenzbi_db'
  },
  paypal: {
    'mode': 'sandbox', // sandbox or live
    'client_id': 'YOUR_PAYPAL_CLIENT_ID',
    'client_secret': 'YOUR_PAYPAL_CLIENT_SECRET'
  }
};
