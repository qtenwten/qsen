// НДС калькулятор

export function addVAT(amount, rate) {
  const num = parseFloat(amount);
  if (isNaN(num)) return null;

  const vatAmount = num * (rate / 100);
  const total = num + vatAmount;

  return {
    original: num.toFixed(2),
    vat: vatAmount.toFixed(2),
    total: total.toFixed(2)
  };
}

export function removeVAT(amount, rate) {
  const num = parseFloat(amount);
  if (isNaN(num)) return null;

  const withoutVAT = num / (1 + rate / 100);
  const vatAmount = num - withoutVAT;

  return {
    total: num.toFixed(2),
    vat: vatAmount.toFixed(2),
    original: withoutVAT.toFixed(2)
  };
}

export function calculateVAT(amount, rate) {
  const num = parseFloat(amount);
  if (isNaN(num)) return null;

  const vatAmount = num * (rate / 100);

  return {
    amount: num.toFixed(2),
    vat: vatAmount.toFixed(2),
    rate: rate
  };
}
