import { Sequelize } from 'sequelize';
import { config } from "dotenv"
config()

const sequelize_database = new Sequelize(
    'best_db_project',
    'best_user_project',
    'best_password_project',
    {
      host: process.env.NODE_ENV !== "test" ? 'postgres' : "postgres_test",
      dialect: 'postgres',
      logging: false,
      port: 5432,
    },
  );

export default sequelize_database;