/* eslint-disable max-len */
/* eslint-disable no-undef */
const responseService = require('../../src/services/ResponseService');
const httpUtil = require('../../src/util/http-util');
const config = require('../../src/config/index');

describe('Flight Resonse Service', () => {
  it('should return flights list from comtravo api stub1', async () => {
    jest.mock('superagent', () => ({
      get: jest.fn(() => {}).mockReturnThis(),
      set: jest.fn(async () => new Promise((resolve) => setTimeout(() => resolve({ status: 200, text: mockText }), 0))),
    }));
    const params = {
      operation: httpUtil.sendHttpRequest(
        'https://discovery-stub.comtravo.com/source1',
        'GET',
        config.headers,
      ),
    };
    const result = await responseService.processResponse(params);
    expect(result.length).toBe(5);
  });

  it('should return flights list from comtravo api stub2', async () => {
    jest.mock('superagent', () => ({
      get: jest.fn(() => {}).mockReturnThis(),
      set: jest.fn(async () => new Promise((resolve) => setTimeout(() => resolve({ status: 200, text: mockText }), 0))),
    }));
    const params = {
      operation: httpUtil.sendHttpRequest(
        'https://discovery-stub.comtravo.com/source2',
        'GET',
        config.headers,
      ),
    };
    const result = await responseService.processResponse(params);
    expect(result.length).toBe(6);
  });

  it('should return empty array on 503', async () => {
    jest.mock('superagent', () => ({
      get: jest.fn(() => {}).mockReturnThis(),
      set: jest.fn(async () => {
        const err = new Error('test');
        err.status = 503;
        return new Promise((resolve, reject) => setTimeout(() => reject(err), 0));
      }),
    }));
    const params = {
      operation: httpUtil.sendHttpRequest(
        'https://discovery-stub.comtravo.com/source1',
        'GET',
        config.headers,
      ),
    };
    const result = await responseService.processResponse(params);
    expect(result).toBe([]);
  });

  it.only('should return 401 unauthorized', async () => {
    jest.mock('superagent', () => ({
      get: jest.fn(() => {}).mockReturnThis(),
      set: jest.fn(async () => new Promise((resolve) => setTimeout(() => resolve({ status: 200, text: mockText }), 0))),
    }));
    const params = {
      operation: httpUtil.sendHttpRequest(
        'https://discovery-stub.comtravo.com/source1',
        'GET',
      ),
    };
    const result = await responseService.processResponse(params);
    console.log('---------result-----', result);
  });
});
