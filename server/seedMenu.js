require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

const breakfastItems = [
  // அல்வா group
  { name: 'காசி அல்வா', group: 'அல்வா', selected: false },
  { name: 'பாதாம் அல்வா', group: 'அல்வா', selected: false },
  { name: 'Wheat அல்வா', group: 'அல்வா', selected: false },
  { name: 'கேரட் அல்வா', group: 'அல்வா', selected: false },
  { name: 'அசோகா அல்வா', group: 'அல்வா', selected: false },
  // Main items
  { name: 'இட்லி', group: 'Main', selected: false },
  { name: 'பொங்கல்', group: 'Main', selected: false },
  { name: 'ரவா பொங்கல்', group: 'Main', selected: false },
  { name: 'ரவா கிச்சடி', group: 'Main', selected: false },
  // Vada
  { name: 'சாம்பார் வடை', group: 'வடை', selected: false },
  { name: 'மெதுவடை', group: 'வடை', selected: false },
  // Dosa / Poori
  { name: 'தோசை', group: 'தோசை / பூரி', selected: false },
  { name: 'மசால் தோசை', group: 'தோசை / பூரி', selected: false },
  { name: 'பூரி', group: 'தோசை / பூரி', selected: false },
  { name: 'பூரி மசாலா', group: 'தோசை / பூரி', selected: false },
  { name: 'ஊத்தப்பம்', group: 'தோசை / பூரி', selected: false },
  // Chutney
  { name: 'தேங்காய் சட்னி', group: 'சட்னி', selected: false },
  { name: 'கொத்தமல்லி சட்னி', group: 'சட்னி', selected: false },
  { name: 'தக்காளி சட்னி', group: 'சட்னி', selected: false },
  // Sambar/Kotsu
  { name: 'சாம்பார்', group: 'சாம்பார்', selected: false },
  { name: 'கொத்சு', group: 'சாம்பார்', selected: false },
  // Always included
  { name: 'மிளகாய் பொடி', group: 'Always', selected: true, alwaysIncluded: true },
  { name: 'காபி, Tea', group: 'Always', selected: true, alwaysIncluded: true },
];

const lunchItems = [
  // Starters
  { name: 'Fruit Salad', group: 'Starters', selected: false },
  { name: 'Sweet பச்சடி', group: 'Starters', selected: false },
  // Rice & Dal (always)
  { name: 'சாதம், நெய், பருப்பு', group: 'சாதம்', selected: true, alwaysIncluded: true },
  { name: 'பருப்பு குழம்பு', group: 'சாதம்', selected: true, alwaysIncluded: true },
  // Kulambu
  { name: 'மோர் குழம்பு', group: 'குழம்பு', selected: false },
  { name: 'வத்தல் குழம்பு', group: 'குழம்பு', selected: false },
  // Poriyal
  { name: 'பீன்ஸ்', group: 'பொரியல்', selected: false },
  { name: 'குடைமிளகாய்', group: 'பொரியல்', selected: false },
  { name: 'அவரை பருப்பு உசிலி', group: 'பொரியல்', selected: false },
  // Karamadhu
  { name: 'வாழைக்காய்', group: 'கரமது', selected: false },
  { name: 'உருளை', group: 'கரமது', selected: false },
  { name: 'கத்தரி பொடி சேர்த்த கரமது', group: 'கரமது', selected: false },
  // Kootu / Aviyal
  { name: 'அவியல்', group: 'கூட்டு / அவியல்', selected: false },
  { name: 'புளிப்பு கூட்டு', group: 'கூட்டு / அவியல்', selected: false },
  { name: 'பொரிச்ச கூட்டு', group: 'கூட்டு / அவியல்', selected: false },
  // Vadai
  { name: 'தயிர் வடை', group: 'வடை', selected: false },
  { name: 'ஆமைவடை', group: 'வடை', selected: false },
  // Always
  { name: 'அப்பளம்', group: 'Always', selected: true, alwaysIncluded: true },
  // Pachadi
  { name: 'தயிர்பச்சடி', group: 'பச்சடி', selected: false },
  { name: 'கோஸ்மல்லி', group: 'பச்சடி', selected: false },
  // Chips
  { name: 'வாழை சிப்ஸ்', group: 'சிப்ஸ்', selected: false },
  { name: 'உருளை சிப்ஸ்', group: 'சிப்ஸ்', selected: false },
  { name: 'சேனை சிப்ஸ்', group: 'சிப்ஸ்', selected: false },
  // Always
  { name: 'சாத்துமது', group: 'Always', selected: true, alwaysIncluded: true },
  { name: 'புளியோதரை', group: 'Always', selected: true, alwaysIncluded: true },
  // Payasam / Sweet
  { name: 'அக்காரவடிசல்', group: 'பாயசம் / Sweet', selected: false },
  { name: 'பால்பாயசம்', group: 'பாயசம் / Sweet', selected: false },
  { name: 'இளநீர் பாயசம்', group: 'பாயசம் / Sweet', selected: false },
  { name: 'பாதாம் கீர்', group: 'பாயசம் / Sweet', selected: false },
  // Sweets
  { name: 'ஜாங்கிரி', group: 'இனிப்பு', selected: false },
  { name: 'மைசூர்பாக்', group: 'இனிப்பு', selected: false },
  { name: 'ரசமலாய்', group: 'இனிப்பு', selected: false },
  { name: 'பால் பேணி', group: 'இனிப்பு', selected: false },
  { name: 'குலாப் ஜாமுன்', group: 'இனிப்பு', selected: false },
  { name: 'Kaju Cake', group: 'இனிப்பு', selected: false },
  // Savouries
  { name: 'காராசேவ்', group: 'காரம்', selected: false },
  { name: 'காராபூந்தி', group: 'காரம்', selected: false },
  { name: 'ஓமப்பொடி', group: 'காரம்', selected: false },
  // Others
  { name: 'பகாளாபாத்', group: 'Others', selected: false },
  { name: 'தயிர்', group: 'Others', selected: false },
  // Always
  { name: 'ஊறுகாய்', group: 'Always', selected: true, alwaysIncluded: true },
  { name: 'வெற்றிலைபாக்கு', group: 'Always', selected: true, alwaysIncluded: true },
];

async function seedMenu() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');

    // Insert breakfast items
    const breakfastDocs = breakfastItems.map((item, i) => ({
      ...item,
      mealType: 'Breakfast',
      sortOrder: i,
      alwaysIncluded: item.alwaysIncluded || false
    }));

    // Insert lunch items
    const lunchDocs = lunchItems.map((item, i) => ({
      ...item,
      mealType: 'Lunch',
      sortOrder: i,
      alwaysIncluded: item.alwaysIncluded || false
    }));

    await MenuItem.insertMany([...breakfastDocs, ...lunchDocs]);
    console.log(`Seeded ${breakfastDocs.length} breakfast items and ${lunchDocs.length} lunch items`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedMenu();
