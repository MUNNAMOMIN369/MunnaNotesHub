import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

// Test connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1);
  });

export default pool;
