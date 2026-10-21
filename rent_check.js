export function reconcileRentCharges(charges, payments) {
  const paidByCharge = new Map(payments.map((payment) => [payment.chargeId, payment]));
  const missing = [];
  const partial = [];
  const overpaid = [];
  for (const charge of charges) {
    const payment = paidByCharge.get(charge.id);
    if (!payment) {
      missing.push(charge.id);
    } else if (payment.amount < charge.amount) {
      partial.push({chargeId: charge.id, remaining: charge.amount - payment.amount});
    } else if (payment.amount > charge.amount) {
      overpaid.push({chargeId: charge.id, excess: payment.amount - charge.amount});
    }
  }
  return {chargeCount: charges.length, paymentCount: payments.length, missing, partial, overpaid};
}

export function summarize(result) {
  return `Rent reconciliation: ${result.missing.length} unpaid, ${result.partial.length} partial, ${result.overpaid.length} overpaid.`;
}
