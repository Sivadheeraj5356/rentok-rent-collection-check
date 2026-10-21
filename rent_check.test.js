import test from 'node:test';
import assert from 'node:assert/strict';
import {reconcileRentCharges, summarize} from './rent_check.js';

test('matches fully paid rent charges', () => {
  const result = reconcileRentCharges([{id:'rent-1',amount:12000}], [{chargeId:'rent-1',amount:12000}]);
  assert.deepEqual(result, {chargeCount:1,paymentCount:1,missing:[],partial:[],overpaid:[]});
});

test('flags unpaid and partial rent charges', () => {
  const result = reconcileRentCharges(
    [{id:'rent-1',amount:12000}, {id:'rent-2',amount:9000}],
    [{chargeId:'rent-1',amount:10000}],
  );
  assert.deepEqual(result.missing, ['rent-2']);
  assert.deepEqual(result.partial, [{chargeId:'rent-1',remaining:2000}]);
});

test('summarizes collection exceptions', () => {
  const result = reconcileRentCharges([{id:'rent-3',amount:8000}], [{chargeId:'rent-3',amount:9000}]);
  assert.equal(summarize(result), 'Rent reconciliation: 0 unpaid, 0 partial, 1 overpaid.');
});
