const { API_BASE_URL } = require('../../../config/api');
const { getWithBearerToken } = require('../../../utils/APIrequests');

describe('API integration: info endpoints', () => {
  let bearerToken;

  beforeAll(() => {
    bearerToken = process.env.BEARER_TOKEN;

    expect(API_BASE_URL).toBeTruthy();
    expect(bearerToken).toBeTruthy();
  });

  describe('GET /info', () => {
    it('returns a successful response using bearer token authentication', async () => {
      const url = `${API_BASE_URL}/info`;

      const response = await getWithBearerToken(url, bearerToken);

      expect(response).toBeTruthy();

      if (Object.hasOwn(response, 'success')) {
        expect(response.success).toBe(true);
      }
    });
  });
});
