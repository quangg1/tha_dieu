// Vietnamese banks for transfers, by NAPAS BIN; the QR picture comes from VietQR (img.vietqr.io).
export const BANKS: readonly { bin: string; name: string }[] = [
  { bin: '970436', name: 'Vietcombank' },
  { bin: '970415', name: 'VietinBank' },
  { bin: '970418', name: 'BIDV' },
  { bin: '970405', name: 'Agribank' },
  { bin: '970407', name: 'Techcombank' },
  { bin: '970422', name: 'MB Bank' },
  { bin: '970416', name: 'ACB' },
  { bin: '970432', name: 'VPBank' },
  { bin: '970423', name: 'TPBank' },
  { bin: '970403', name: 'Sacombank' },
  { bin: '970441', name: 'VIB' },
  { bin: '970437', name: 'HDBank' },
  { bin: '970443', name: 'SHB' },
  { bin: '970448', name: 'OCB' },
  { bin: '970426', name: 'MSB' },
  { bin: '970440', name: 'SeABank' },
  { bin: '970431', name: 'Eximbank' },
  { bin: '970449', name: 'LPBank' },
  { bin: '970428', name: 'Nam A Bank' },
];

export const bankName = (bin: string) => BANKS.find((b) => b.bin === bin)?.name ?? '';

/** A VietQR transfer picture for the account, with a short note prefilled. */
export function vietQr(bin: string, account: string, holder: string) {
  const q = new URLSearchParams({ accountName: holder, addInfo: 'Ung ho Tha Dieu' });
  return `https://img.vietqr.io/image/${bin}-${account}-compact2.png?${q}`;
}
