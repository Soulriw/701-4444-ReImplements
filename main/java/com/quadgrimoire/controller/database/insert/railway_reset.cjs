require('dotenv').config();
const mysql = require('mysql2/promise');

async function deleteAllTables() {
    let connection;
    try {
        // Connect to Railway MySQL
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('✅ Connected to Railway MySQL Database\n');
        console.log('🗑️  Starting to delete all tables...\n');

        // Drop tables in correct order (child tables first due to foreign keys)
        const tables = [
            'Historys',
            'Carts', 
            'Sections',
            'PromotionsBook',
            'Books',
            'Admins',
            'Users',
            'Categories'
        ];

        for (const table of tables) {
            try {
                await connection.query(`DROP TABLE IF EXISTS ${table}`);
                console.log(`✓ Deleted table: ${table}`);
            } catch (err) {
                console.log(`⚠️  Could not delete ${table}: ${err.message}`);
            }
        }

        console.log('\n✅ All tables deleted successfully!');
        console.log('═══════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Error connecting to database:', error.message);
        console.error('\n💡 Make sure your .env file has correct Railway credentials:');
        console.error('   DB_HOST=shuttle.proxy.rlwy.net');
        console.error('   DB_PORT=36089');
        console.error('   DB_USER=root');
        console.error('   DB_PASSWORD=your_password');
        console.error('   DB_NAME=railway');
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Database connection closed');
        }
    }
}

// Run delete
deleteAllTables()
    .then(() => console.log('\n✨ Done! All tables have been deleted from Railway.'))
    .catch(error => console.error('\n💥 Delete failed:', error.message));