// ข้อมูลทั้งหมดในไฟล์นี้เป็นข้อมูลจำลองสำหรับ UI เท่านั้น ไม่ใช่ราคาตลาดจริง
export const FX_USDTHB = 32.5
export const MIN_US_ORDER = 50
export const FEE_RATE = 0.0015

export const STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA', market: 'US', sector: 'เซมิคอนดักเตอร์', prevClose: 182.4, pe: 48.2, dividend: 0.02, tags: ['ai', 'bigtech', 'starter'], about: 'ผู้ออกแบบชิปประมวลผลกราฟิกและชิปเร่งการประมวลผล AI สำหรับศูนย์ข้อมูล' },
  { symbol: 'AAPL', name: 'Apple', market: 'US', sector: 'เทคโนโลยี', prevClose: 228.15, pe: 33.6, dividend: 0.44, tags: ['bigtech', 'starter'], about: 'ผู้ผลิตสมาร์ตโฟน คอมพิวเตอร์ และบริการดิจิทัลสำหรับผู้บริโภคทั่วโลก' },
  { symbol: 'MSFT', name: 'Microsoft', market: 'US', sector: 'ซอฟต์แวร์', prevClose: 512.3, pe: 37.1, dividend: 0.66, tags: ['ai', 'bigtech'], about: 'ผู้ให้บริการซอฟต์แวร์องค์กร คลาวด์ และเครื่องมือด้าน AI' },
  { symbol: 'GOOGL', name: 'Alphabet', market: 'US', sector: 'อินเทอร์เน็ต', prevClose: 246.8, pe: 26.4, dividend: 0.34, tags: ['ai', 'bigtech'], about: 'บริษัทแม่ของธุรกิจเสิร์ชเอนจิน แพลตฟอร์มวิดีโอ และคลาวด์' },
  { symbol: 'AMZN', name: 'Amazon', market: 'US', sector: 'ค้าปลีกออนไลน์', prevClose: 221.6, pe: 34.8, dividend: 0, tags: ['bigtech', 'starter'], about: 'ผู้ให้บริการอีคอมเมิร์ซและโครงสร้างพื้นฐานคลาวด์รายใหญ่' },
  { symbol: 'META', name: 'Meta Platforms', market: 'US', sector: 'อินเทอร์เน็ต', prevClose: 702.5, pe: 27.3, dividend: 0.3, tags: ['ai', 'bigtech'], about: 'เจ้าของแพลตฟอร์มโซเชียลมีเดียและธุรกิจโฆษณาดิจิทัล' },
  { symbol: 'TSLA', name: 'Tesla', market: 'US', sector: 'ยานยนต์ไฟฟ้า', prevClose: 338.9, pe: 96.5, dividend: 0, tags: ['starter'], about: 'ผู้ผลิตรถยนต์ไฟฟ้า ระบบกักเก็บพลังงาน และซอฟต์แวร์ขับขี่' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', market: 'US', sector: 'เซมิคอนดักเตอร์', prevClose: 164.2, pe: 41.9, dividend: 0, tags: ['ai'], about: 'ผู้ออกแบบหน่วยประมวลผลสำหรับคอมพิวเตอร์ เกม และศูนย์ข้อมูล' },
  { symbol: 'KO', name: 'Coca-Cola', market: 'US', sector: 'เครื่องดื่ม', prevClose: 69.4, pe: 24.2, dividend: 2.9, tags: ['dividend', 'starter'], about: 'ผู้ผลิตเครื่องดื่มไม่มีแอลกอฮอล์ที่จำหน่ายในกว่า 200 ประเทศ' },
  { symbol: 'JPM', name: 'JPMorgan Chase', market: 'US', sector: 'ธนาคาร', prevClose: 298.7, pe: 15.1, dividend: 1.9, tags: ['dividend'], about: 'สถาบันการเงินขนาดใหญ่ที่ให้บริการธนาคารและวาณิชธนกิจ' },
  { symbol: 'PTT', name: 'ปตท.', market: 'TH', sector: 'พลังงาน', prevClose: 33.5, pe: 11.2, dividend: 5.8, tags: ['dividend'], about: 'กลุ่มธุรกิจพลังงานและปิโตรเคมีครบวงจรของไทย' },
  { symbol: 'AOT', name: 'ท่าอากาศยานไทย', market: 'TH', sector: 'ขนส่ง', prevClose: 58.75, pe: 29.4, dividend: 1.7, tags: [], about: 'ผู้บริหารท่าอากาศยานนานาชาติหลักของประเทศไทย' },
  { symbol: 'CPALL', name: 'ซีพี ออลล์', market: 'TH', sector: 'ค้าปลีก', prevClose: 56.25, pe: 19.6, dividend: 2.4, tags: ['starter'], about: 'ผู้ดำเนินธุรกิจร้านสะดวกซื้อและค้าส่งในประเทศไทย' },
  { symbol: 'KBANK', name: 'ธนาคารกสิกรไทย', market: 'TH', sector: 'ธนาคาร', prevClose: 148.5, pe: 8.3, dividend: 5.2, tags: ['dividend'], about: 'ธนาคารพาณิชย์ขนาดใหญ่ที่เน้นบริการดิจิทัลและลูกค้ารายย่อย' },
  { symbol: 'SCB', name: 'เอสซีบี เอกซ์', market: 'TH', sector: 'ธนาคาร', prevClose: 121, pe: 9.1, dividend: 7.4, tags: ['dividend'], about: 'กลุ่มธุรกิจการเงินที่มีธนาคารไทยพาณิชย์เป็นบริษัทหลัก' },
  { symbol: 'ADVANC', name: 'แอดวานซ์ อินโฟร์ เซอร์วิส', market: 'TH', sector: 'สื่อสาร', prevClose: 286, pe: 21.7, dividend: 3.8, tags: ['dividend'], about: 'ผู้ให้บริการโทรศัพท์เคลื่อนที่และอินเทอร์เน็ตบ้านรายใหญ่' },
  { symbol: 'GULF', name: 'กัลฟ์ ดีเวลลอปเมนท์', market: 'TH', sector: 'พลังงาน', prevClose: 49.5, pe: 26.8, dividend: 2.1, tags: [], about: 'ผู้ลงทุนและพัฒนาโครงการโรงไฟฟ้าและพลังงานหมุนเวียน' },
  { symbol: 'DELTA', name: 'เดลต้า อีเลคโทรนิคส์', market: 'TH', sector: 'อิเล็กทรอนิกส์', prevClose: 98, pe: 52.3, dividend: 0.6, tags: ['ai'], about: 'ผู้ผลิตระบบจ่ายไฟและอุปกรณ์อิเล็กทรอนิกส์สำหรับศูนย์ข้อมูล' },
]

export const STOCK_BY_SYMBOL = Object.fromEntries(STOCKS.map((s) => [s.symbol, s]))

export const THEMES = [
  { id: 'starter', label: 'เริ่มต้นง่าย', hint: 'หุ้นที่คนเริ่มลงทุนรู้จัก' },
  { id: 'ai', label: 'ธีม AI', hint: 'ชิป คลาวด์ และซอฟต์แวร์' },
  { id: 'bigtech', label: 'Big Tech', hint: 'เทคโนโลยีรายใหญ่' },
  { id: 'dividend', label: 'เน้นปันผล', hint: 'กระแสเงินสดสม่ำเสมอ' },
]

export const NEWS = [
  { id: 1, tag: 'ตลาดสหรัฐ', title: 'ดัชนีหุ้นเทคโนโลยีแกว่งตัว นักลงทุนรอตัวเลขเงินเฟ้อ', time: '2 ชม.' },
  { id: 2, tag: 'ตลาดไทย', title: 'กลุ่มธนาคารเป็นแรงหนุนหลักของการซื้อขายช่วงเช้า', time: '4 ชม.' },
  { id: 3, tag: 'ความรู้', title: 'DCA คืออะไร และทำไมการทยอยลงทุนจึงเหมาะกับมือใหม่', time: '1 วัน' },
]

export const initialAccount = {
  cash: 25000,
  hidden: false,
  watchlist: ['NVDA', 'TSLA', 'CPALL', 'DELTA'],
  holdings: {
    AAPL: { qty: 2.4, avg: 196.5 },
    NVDA: { qty: 5.25, avg: 131.2 },
    KO: { qty: 4, avg: 71.8 },
    PTT: { qty: 400, avg: 32.75 },
    KBANK: { qty: 100, avg: 139.5 },
  },
  orders: [
    { id: 'seed-5', kind: 'buy', at: '2026-11-06T10:42:00+07:00', symbol: 'KO', qty: 4, price: 71.8, fx: 32.5, fee: 14, total: 9347.6 },
    { id: 'seed-4', kind: 'deposit', at: '2026-11-05T19:15:00+07:00', amount: 20000 },
    { id: 'seed-3', kind: 'buy', at: '2026-10-28T11:03:00+07:00', symbol: 'KBANK', qty: 100, price: 139.5, fx: 1, fee: 20.93, total: 13970.93 },
    { id: 'seed-2', kind: 'sell', at: '2026-10-21T14:26:00+07:00', symbol: 'AMD', qty: 3, price: 158.4, fx: 32.5, fee: 23.17, total: 15420.23 },
    { id: 'seed-1', kind: 'deposit', at: '2026-10-20T09:30:00+07:00', amount: 50000 },
  ],
}
