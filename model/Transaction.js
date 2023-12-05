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

    getAllByUserId: async (userId, page = 0, pageSize = 5) => {
        const transactions = await transactionModel.findAll({
            where: {
                userId,
            },
            limit: pageSize,
            offset: page * pageSize,
        });
        return transactions;
    },

    getAllByBankAccountId: async (bankAccountId, userId, page = 0, pageSize = 5) => {
        const transactions = await transactionModel.findAll({
            where: {
                bankAccountId,
                userId,
            },
            limit: pageSize,
            offset: page * pageSize,
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