const { MongoClient } = require('mongodb');

const localUri = 'mongodb://localhost:27017/hostel_management';
const remoteUri = 'mongodb+srv://jamwal1502_db_user:6xRJhc75VQp0uvsX@cluster0.q5xpsxt.mongodb.net/hostel_management?retryWrites=true&w=majority';

async function migrate() {
    let localClient, remoteClient;
    try {
        console.log('Connecting to local database...');
        localClient = new MongoClient(localUri);
        await localClient.connect();
        const localDb = localClient.db();

        console.log('Connecting to remote database...');
        remoteClient = new MongoClient(remoteUri);
        await remoteClient.connect();
        const remoteDb = remoteClient.db();

        const collections = await localDb.listCollections().toArray();
        console.log(`Found ${collections.length} collections.`);

        for (let colInfo of collections) {
            const colName = colInfo.name;
            // Ignore system collections
            if (colName.startsWith('system.')) {
                continue;
            }
            console.log(`\nMigrating collection: ${colName}`);
            
            const localCol = localDb.collection(colName);
            const remoteCol = remoteDb.collection(colName);

            const docs = await localCol.find({}).toArray();
            console.log(`Found ${docs.length} documents in ${colName}.`);

            if (docs.length > 0) {
                await remoteCol.deleteMany({});
                console.log(`Cleared existing documents in remote ${colName}.`);

                const result = await remoteCol.insertMany(docs);
                console.log(`Inserted ${result.insertedCount} documents into remote ${colName}.`);
            } else {
                console.log(`Skipping empty collection: ${colName}`);
            }
        }

        console.log('\nMigration completed successfully!');

    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        if (localClient) await localClient.close();
        if (remoteClient) await remoteClient.close();
    }
}

migrate();
