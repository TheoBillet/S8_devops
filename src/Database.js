import { Sequelize } from 'sequelize';

const sequelize_database = new Sequelize(
    'best_db_project',
    'best_user_project',
    'best_password_project',
    {
      host: 'postgres',
      dialect: 'postgres',
      logging: false,
      port: 5432,
    },
  );

console.log("Waiting connection to database");
while (true)
{
    try {
        await sequelize_database.authenticate();
        await sequelize_database.sync();
        break;
    } catch (error) {
        // console.log(error);
    }
}
console.log('Connection has been established successfully to the database.');

export default sequelize_database;