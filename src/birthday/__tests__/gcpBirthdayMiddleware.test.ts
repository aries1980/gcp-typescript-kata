import { extractDateOfBirth, extractUsername, getResponse } from '../gcpBirthdayMiddleware';
import moment = require('moment');

describe('GCP Birthday Express MiddleWare', () => {

  it('should sanitize username', async () => {
    const sanitizedUsername1 = () => { return extractUsername('&foo'); };
    const sanitizedUsername2 = () => { return extractUsername('foo123,'); };
    const sanitizedUsername3 = () => { return extractUsername(' spaces ,'); };

    expect(sanitizedUsername1()).toEqual('foo');
    expect(sanitizedUsername2()).toEqual('foo123');
    expect(sanitizedUsername3()).toEqual('spaces');
  });

  it('should throw error on wrong username', async () => {
    const sanitizedUsername = extractUsername('&foo');
    const badUsername = () => { const u = extractUsername('&áé'); };

    expect(sanitizedUsername).toEqual('foo');
    expect(badUsername).toThrow(TypeError);
  });

  it('should get a Moment object on good dates', async () => {
    const goodDate1 = extractDateOfBirth('1980-02-29');
    const goodDate2 = extractDateOfBirth('1980-04-07');
    expect(goodDate1.format('YYYY-MM-DD')).toEqual('1980-02-29');
    expect(goodDate2.format('YYYY-MM-DD')).toEqual('1980-04-07');
  });

  it('should throw error on wrong date', async () => {
    const storage = {
      save: jest.fn(() => true)
    };

    const badDate1 = () => { const d = extractDateOfBirth('800-01-01'); };
    const badDate2 = () => { const d = extractDateOfBirth('1980-02-30'); };

    expect(badDate1).toThrow(TypeError);
    expect(badDate2).toThrow(TypeError);
  });

  it('should return with the correct birthday greeting', async () => {
    const username = 'Foo';

    const birthdayResponse1 = getResponse(username, moment());
    const tomorrowResponse1 = getResponse('Foo', moment().add(2, 'days').add(1, 'hours'));
    const yesterdayResponse1 = getResponse('Foo', moment().subtract(1, 'days').subtract(1, 'hours'));

    expect(birthdayResponse1).toEqual(`Hello ${username}! Happy birthday!`);
    expect(tomorrowResponse1).toEqual(`Hello ${username}! Your birthday is in 2 day(s).`);
    // @TODO: This test will fail in leap years
    expect(yesterdayResponse1).toEqual(`Hello ${username}! Your birthday is in 364 day(s).`);
  });

});
