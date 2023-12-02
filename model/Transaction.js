const { transactionModel } = require('./bd');

module.exports = {
    create: async (value, date, type, bankAccountId, userId) => {
        const transaction = await transactionModel.create({
            value,
            date,
            type,
            bankAccountId,
            userId,
        });
        return transaction;
    },

    getAllByUserId: async (userId) => {
        const transactions = await transactionModel.findAll({
            where: {
                userId,
            },
        });
        return transactions;
    },

    getAllByBankAccountId: async (bankAccountId, userId) => {
        const transactions = await transactionModel.findAll({
            where: {
                bankAccountId,
                userId,
            },
        });
        return transactions;
    },

    getById: async (id) => {
        const transaction = await transactionModel.findByPk(id, {
            where: {
                userId,
            },
        });
        return transaction;
    },

    update: async (id, value, date, type, bankAccountId, userId) => {
        const transaction = await transactionModel.update({
            value,
            date,
            type,
            bankAccountId,
        }, {
            where: {
                id,
                userId,
            },
        });
        return transaction;
    },

    delete: async (id, userId) => {
        const transaction = await transactionModel.destroy({
            where: {
                id,
                userId,
            },
        });
        return transaction;
    },
}