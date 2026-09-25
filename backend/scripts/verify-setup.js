/**
 * MediRoute — Setup Verification Script
 * Run: node scripts/verify-setup.js
 *
 * Checks:
 *  1. .env file is present
 *  2. All required env vars exist
 *  3. MongoDB connection succeeds
 *  4. A test document can be written and deleted
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const REQUIRED_VARS = ['MONGO_URI', 'PORT', 'JWT_SECRET', 'CLIENT_URL'];

const PASS  = '✅';
const FAIL  = '❌';
const INFO  = '🔹';

async function verify() {
  console.log('\n══════════════════════════════════════════════');
  console.log('  🩺  MediRoute — Setup Verification Script');
  console.log('══════════════════════════════════════════════\n');

  // ── 1. Check env vars ──────────────────────────────────────
  console.log(`${INFO} Checking environment variables…`);
  let envOk = true;
  for (const v of REQUIRED_VARS) {
    if (process.env[v]) {
      console.log(`   ${PASS} ${v}`);
    } else {
      console.log(`   ${FAIL} ${v}  ← MISSING`);
      envOk = false;
    }
  }
  if (!envOk) {
    console.log('\n  ⚠️  Fix missing env vars in server/.env before continuing.\n');
    process.exit(1);
  }

  // ── 2. Connect to MongoDB ──────────────────────────────────
  console.log(`\n${INFO} Connecting to MongoDB…`);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`   ${PASS} Connected to: ${mongoose.connection.host}`);
    console.log(`   ${PASS} Database:     ${mongoose.connection.name}`);
  } catch (err) {
    console.log(`   ${FAIL} Connection failed: ${err.message}`);
    process.exit(1);
  }

  // ── 3. Read/Write test ─────────────────────────────────────
  console.log(`\n${INFO} Running read/write test…`);
  try {
    const TestSchema = new mongoose.Schema({
      label:     String,
      createdAt: { type: Date, default: Date.now },
    });
    const TestModel = mongoose.models._setup_test
      || mongoose.model('_setup_test', TestSchema);

    const doc = await TestModel.create({ label: 'mediroute-setup-check' });
    console.log(`   ${PASS} Document written  (_id: ${doc._id})`);

    await TestModel.deleteOne({ _id: doc._id });
    console.log(`   ${PASS} Document deleted`);
  } catch (err) {
    console.log(`   ${FAIL} Read/write test failed: ${err.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── Done ───────────────────────────────────────────────────
  await mongoose.disconnect();
  console.log('\n══════════════════════════════════════════════');
  console.log('  🎉  All checks passed! MediRoute is ready.');
  console.log('══════════════════════════════════════════════');
  console.log('\n  Next steps:');
  console.log('  • cd server  → npm run dev');
  console.log('  • cd client  → npm start');
  console.log('  • Open http://localhost:3000\n');
  process.exit(0);
}

verify();
