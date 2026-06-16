const assert = require('node:assert/strict');
const test = require('node:test');

const { durationToMs } = require('../src/config/jwt');

test('durationToMs calcula duracion de sesion por dias, horas y minutos', () => {
  assert.equal(durationToMs('30d'), 30 * 24 * 60 * 60 * 1000);
  assert.equal(durationToMs('12h'), 12 * 60 * 60 * 1000);
  assert.equal(durationToMs('45m'), 45 * 60 * 1000);
});

test('durationToMs usa fallback seguro cuando la configuracion es invalida', () => {
  assert.equal(durationToMs('abc', 7), 7 * 24 * 60 * 60 * 1000);
});
