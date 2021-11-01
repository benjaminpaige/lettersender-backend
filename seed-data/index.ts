import { messages } from './data';

export async function insertSeedData(ks: any) {
  // Keystone API changed, so we need to check for both versions to get keystone
  const keystone = ks.keystone || ks;
  const adapter = keystone.adapters?.MongooseAdapter || keystone.adapter;

  console.log(`🌱 Inserting Seed Data: ${messages.length} messages`);
  const { mongoose } = adapter;
  for (const message of messages) {
    console.log(`  🛍️ Adding message: ${message.content}`);
    const { _id } = await mongoose
      .model('MessageImage')
      .create({ image: message.photo });
    message.photo = _id;
    await mongoose.model('Message').create(message);
  }
  console.log(`✅ Seed Data Inserted: ${messages.length} messages`);
  console.log('👋 Please start the process with `yarn dev` or `npm run dev`');
  process.exit();
}
