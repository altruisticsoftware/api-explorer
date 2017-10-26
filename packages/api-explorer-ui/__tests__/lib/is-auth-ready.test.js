const isAuthReady = require('../../src/lib/is-auth-ready');
const Oas = require('../../src/lib/Oas.js');
const authTypesOas = require('../fixtures/auth-types/oas');
const multipleSchemes = require('../fixtures/multiple-securities/oas');

const oas = new Oas(authTypesOas);
const oas2 = new Oas(multipleSchemes);

describe('isAuthReady', () => {
  it('should return true if multiple security types required (&&)', () => {
    const operation = oas2.operation('/and-security', 'post');

    expect(
      isAuthReady(operation, {
        oauth: 'bearer',
        apiKey: 'bearer',
      }),
    ).toBe(true);
  });

  it('should return false if multiple security types required (&&) and one missing', () => {
    const operation = oas2.operation('/and-security', 'post');

    expect(
      isAuthReady(operation, {
        oauth: '',
        apiKey: 'bearer',
      }),
    ).toBe(false);
  });

  it('should return false if multiple security types required (&&) and both missing', () => {
    const operation = oas2.operation('/and-security', 'post');

    expect(
      isAuthReady(operation, {
        oauth: '',
        apiKey: '',
      }),
    ).toBe(false);
  });

  it('should return true if one of multiple security types required (||)', () => {
    const operation = oas2.operation('/or-security', 'post');

    expect(
      isAuthReady(operation, {
        oauth: 'bearer',
        apiKey: '',
      }),
    ).toBe(true);

    expect(
      isAuthReady(operation, {
        oauth: '',
        apiKey: 'bearer',
      }),
    ).toBe(true);
  });

  it('should return false if both of multiple security types required is missing (||)', () => {
    const operation = oas2.operation('/or-security', 'post');

    expect(
      isAuthReady(operation, {
        oauth: '',
        oauthDiff: '',
      }),
    ).toBe(false);
  });

  it('should return false if both security types required are missing (&& ||)', () => {
    const operation = oas2.operation('/and-or-security', 'post');

    expect(
      isAuthReady(operation, {
        oauth: 'bearer',
        apiKey: '',
        oauthDiff: '',
      }),
    ).toBe(false);

    expect(
      isAuthReady(operation, {
        oauth: '',
        apiKey: 'key',
        oauthDiff: '',
      }),
    ).toBe(false);
  });

  it('should return true if one security types required (&& ||)', () => {
    const operation = oas2.operation('/and-or-security', 'post');

    expect(
      isAuthReady(operation, {
        oauth: 'bearer',
        apiKey: '',
        oauthDiff: 'test',
      }),
    ).toBe(true);

    expect(
      isAuthReady(operation, {
        oauth: '',
        apiKey: '',
        oauthDiff: 'test',
      }),
    ).toBe(true);

    expect(
      isAuthReady(operation, {
        oauth: 'bearer',
        apiKey: 'key',
        oauthDiff: '',
      }),
    ).toBe(true);
  });

  it('should return true if auth data is passed in correctly for api key condition', () => {
    const operation = oas.operation('/api-key', 'post');

    expect(isAuthReady(operation, { apiKey: 'test' })).toBe(true);
  });

  it('should return false if auth data is not passed in for api key condition', () => {
    const operation = oas.operation('/api-key', 'post');

    expect(isAuthReady(operation, { apiKey: '' })).toBe(false);
  });

  it('should return false if auth data is not passed in correctly for oauth condition', () => {
    const operation = oas.operation('/oauth', 'post');

    expect(isAuthReady(operation, { oauth: '' })).toBe(false);
  });

  it('should return true if auth data is passed in correctly for oauth condition', () => {
    const operation = oas.operation('/oauth', 'post');

    expect(isAuthReady(operation, { oauth: 'bearer' })).toBe(true);
  });

  it('should return true if auth data is passed in for basic condition', () => {
    const operation = oas.operation('/basic', 'post');

    expect(isAuthReady(operation, { basic: { username: 'test', password: 'pass' } })).toBe(true);
  });

  it('should return false if auth data is not passed in for basic condition', () => {
    const operation = oas.operation('/basic', 'post');

    expect(isAuthReady(operation, { basic: { username: '', password: '' } })).toBe(false);
  });

  it('should return true if endpoint does not need auth or passed in auth is correct', () => {
    const operation = oas.operation('/no-auth', 'post');

    expect(isAuthReady(operation)).toBe(true);
  });
});
