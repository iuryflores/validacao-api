import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

const postgresClient = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

export const connectDB = async () => {
  try {
    await postgresClient.connect();
    console.log("Connected to PostgreSQL!");
  } catch (error) {
    console.error(error);
  }
};

export const disconnectDB = async () => {
  try {
    await postgresClient.end();
    console.log("Disconnected from PostgreSQL!");
  } catch (error) {
    console.error(error);
  }
};

export const getPostgresClient = () => postgresClient;
