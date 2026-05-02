require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Task = require('./models/Task');

const seedData = [
  {
    category: 'Mapillai Appa and Amma',
    tasks: ['Mapillai Appa and Amma']
  },
  {
    category: 'Menu',
    tasks: [
      'Water Can or Water can Purifier',
      'Thambaloom Bag',
      'Juice / Coffee Counter',
      'Ice-cream',
      'Pakshanam Packet'
    ]
  },
  {
    category: 'Pathirikai (Invitations)',
    tasks: [
      'Pathirikai Digital for Whatsapp',
      'Official Manjal Pathirikai'
    ]
  },
  {
    category: 'Dress & Gifts',
    tasks: [
      'Podavai and Veshti, Dress for relatives'
    ]
  },
  {
    category: 'Decoration',
    tasks: [
      'Vazhai Maram entrance',
      'Stage Decoration',
      'Entrance Board',
      'Izhai Kolam - One Day Advance'
    ]
  },
  {
    category: 'Venue & Services',
    tasks: [
      'Finalize venue Krishna Mini Hall',
      'Confirm With Sundara Vadyar',
      'Finalize Photo Team',
      'Finalize catering Srinidhi or Mayakootan or Sedhu'
    ]
  },
  {
    category: 'Music & Entertainment',
    tasks: [
      'Speaker or Similar set up for song',
      'Blue tooth Song'
    ]
  },
  {
    category: 'Temple',
    tasks: [
      'Perungalathur Srinivasan Perumal'
    ]
  },
  {
    category: 'Pudavai & Veshti',
    tasks: [
      'Pudavai and Veshti'
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Task.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing data');

    for (let i = 0; i < seedData.length; i++) {
      const { category: catName, tasks } = seedData[i];
      const category = await Category.create({ name: catName, order: i });
      console.log(`Created category: ${catName}`);

      for (const taskName of tasks) {
        await Task.create({ name: taskName, category: category._id });
        console.log(`  - Created task: ${taskName}`);
      }
    }

    console.log('\nSeeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
