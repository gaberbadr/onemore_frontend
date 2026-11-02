const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('https://onemore.runasp.net/api/Auth/login-admin', {
      email: 'admin@onemore.com',
      password: 'password'
    });
    console.log(res.status, res.data);
  } catch (error) {
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}
test();
