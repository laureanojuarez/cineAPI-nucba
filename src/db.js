import { Sequelize } from "sequelize";

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      protocol: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize("postgres", "postgres", "root", {
      host: "localhost",
      dialect: "postgres",
    });

export default sequelize;