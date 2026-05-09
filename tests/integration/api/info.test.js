const assert = require('node:assert/strict');
const test = require('node:test');

const { API_BASE_URL } = require('../../../config/api');
const { getWithBearerToken } = require('../../../utils/APIrequests');

test('GET /info succeeds with bearer token', async () => {
  const bearerToken = process.env.BEARER_TOKEN;
  const url = `${API_BASE_URL}/info`;

  assert.ok(bearerToken, 'BEARER_TOKEN must be set in .env');

  const response = await getWithBearerToken(url, bearerToken);

  assert.ok(response, 'Expected a JSON response body');

  if (Object.hasOwn(response, 'success')) {
    assert.equal(response.success, true, 'Expected response.success to be true');
  }
});
