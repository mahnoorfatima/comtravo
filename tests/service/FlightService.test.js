/* eslint-disable no-undef */
const flightService = require('../../src/services/FlightService');
const mockStub1 = require('../fixtures/stub1-res.json');
const mockStub2 = require('../fixtures/stub2-res.json');

describe('getFlights()', () => {
  it('should return array of results', async () => {
    jest.mock('../../src/services/dataService', () => ({
      getData: jest.fn()
        .mockReturnValueOnce(Promise.resolve(mockStub1))
        .mockReturnValueOnce(Promise.resolve(mockStub2)),
    }));
    const result = await flightService.getFlights();
    expect(result.length).toBe(2);
    expect(result[0]).toBe(mockStub1);
    expect(result[1]).toBe(mockStub2);
  });

  it('should return null if results are timeouted', async () => {
    jest.mock('../../src/services/dataService', () => ({
      getData: jest.fn(async () => new Promise((resolve) => setTimeout(() => resolve(null), 0))),
    }));
    const result = await flightService.getFlights();
    expect(result.length).toBe(2);
    expect(result).toStrictEqual([[], []]);
  });
});
