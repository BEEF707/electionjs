require('dotenv').config();

const API_BASE_URL = (process.env.API_BASE_URL || 'https://elections-irv.api.hscc.bdpa.org/v1').replace(/\/+$/, '');

module.exports = {
  API_BASE_URL,
};
