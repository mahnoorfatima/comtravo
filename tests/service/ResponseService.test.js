/* eslint-disable global-require */
/* eslint-disable max-len */
/* eslint-disable no-undef */
beforeEach(() => {
  jest.resetModules();
});

const mockStubResponse = JSON.stringify(require('../fixtures/response.json'));

describe('Process Response', () => {
  it('should return flights list from comtravo api', async () => {
    jest.mock('../../src/util/http-util', () => ({
      sendHttpRequest: jest.fn()
        .mockReturnValueOnce(Promise.resolve(mockStubResponse)),
    }));
    const responseService = require('../../src/services/ResponseService');
    const result = await responseService.processResponse('stub api');
    expect(JSON.parse(result).length).toBe(3);
  });

  it('should return [] on 503', async () => {
    jest.mock('../../src/util/http-util', () => ({
      sendHttpRequest: jest.fn(async () => {
        const err = new Error('Service Unavailable');
        err.statusCode = 503;
        return new Promise((resolve, reject) => setTimeout(() => reject(err), 0));
      }),
    }));
    const responseService = require('../../src/services/ResponseService');
    const result = await responseService.processResponse('stub api');
    expect(result).toEqual([]);
  });
});
