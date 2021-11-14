/* eslint-disable no-undef */
beforeEach(() => {
  jest.resetModules()
})
const mockStub1 = require('../fixtures/stub1-res.json');
const mockStub2 = require('../fixtures/stub2-res.json');

describe('Get Flights', () => {
  it('should return array of flights from comtravo API', async () => {
    jest.mock('../../src/services/ResponseService', () => ({
      processResponse: jest.fn()
      .mockReturnValueOnce(Promise.resolve(mockStub1))
      .mockReturnValueOnce(Promise.resolve(mockStub2))
    }));
    const flightService = require('../../src/services/FlightService');
    const result = await flightService.getFlights();
    expect(result[0]).toBe(mockStub1);
    expect(result[1]).toBe(mockStub2);
  });

  it('should return empty array if results are timeout', async () => {
    jest.mock('../../src/services/ResponseService', () => ({
      processResponse: jest.fn(async () => {
        return new Promise(resolve => setTimeout(() => resolve([]), 0))
      })
    }))
    const flightService = require('../../src/services/FlightService')
    const result = await flightService.getFlights();
    expect(result.length).toBe(2)
    expect(result).toStrictEqual([[], []])
  })
});

describe('Merge and Remove Duplicates', () => {
  it('should merge flights and filter out duplicates', async () => {
    jest.mock('../../src/services/ResponseService', () => ({
      processResponse: jest.fn()
      .mockReturnValueOnce(Promise.resolve(mockStub1))
      .mockReturnValueOnce(Promise.resolve(mockStub2))
    }));
    const flightService = require('../../src/services/FlightService');
    const result = await flightService.getFlights();
    const flights = await flightService.mergeAndRemoveDuplicateFlights(result);
    expect(flights.length).toBe(9)
  });
  it('should return empty array if the flight service response is unstable', async () => {
    jest.mock('../../src/services/ResponseService', () => ({
      processResponse: jest.fn()
      .mockReturnValueOnce(Promise.resolve([]))
      .mockReturnValueOnce(Promise.resolve([]))
    }));
    const flightService = require('../../src/services/FlightService');
    const result = await flightService.getFlights();
    const flights = await flightService.mergeAndRemoveDuplicateFlights(result);
    expect(flights).toEqual([])
    expect(flights.length).toBe(0);
  });

  it('should return filtered and merged flights from stub 1 if stub 2 response is unstable', async () => {
    jest.mock('../../src/services/ResponseService', () => ({
      processResponse: jest.fn()
      .mockReturnValueOnce(Promise.resolve([]))
      .mockReturnValueOnce(Promise.resolve(mockStub1))
    }));
    const flightService = require('../../src/services/flightService')
    const result = await flightService.getFlights();
    const flights = await flightService.mergeAndRemoveDuplicateFlights(result);
    expect(flights.length).toBe(mockStub1.length);
  })
});
