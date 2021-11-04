require('dotenv').config({ path: './.env' });

module.exports =  {
    headers: {
        'Authorization': 'Basic '+ Buffer.from(process.env.COMTRAVO_USER_NAME + ':' + process.env.COMTRAVO_PASSWORD).toString('base64'),
        'Content-Type': 'application/json'
    },
    delay: 5000,
    retries: 5,
    timeout: 950,
  }