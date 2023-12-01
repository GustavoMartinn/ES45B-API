require('dotenv').config();

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host:process.env.DB_HOST,
        dialect:'postgres',
        port:process.env.DB_PORT,
    }
);

const UserModel = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique:true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

const bankAccountModel = sequelize.define('BankAccount', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    initialBalance: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    bankName:{
        type: DataTypes.STRING,
        allowNull: false,
    }
});

bankAccountModel.belongsTo(UserModel, {foreignKey: 'userId'});

const transactionModel = sequelize.define('Transaction', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('INCOME', 'EXPENSE'),
        allowNull: false,
    }
});

transactionModel.belongsTo(bankAccountModel, {foreignKey: 'bankAccountId'});
transactionModel.belongsTo(UserModel, {foreignKey: 'userId'});
