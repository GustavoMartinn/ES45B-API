const {bankAccountModel} = require('./bd');

module.exports = {
    create: async (bankName, initialBalance, userId) => {
        const bankAccount = await bankAccountModel.create({
            bankName,
            initialBalance,
            userId,
        });
        return bankAccount;
    },

    getAllByUserId: async (userId, page = 0, pageSize = 5) => {
        const bankAccounts = await bankAccountModel.findAll({
            where: {
                userId,
            },
            limit: pageSize,
            offset: page * pageSize,
        });
        return bankAccounts;
    },

    getById: async (id, userId) => {
        const bankAccount = await bankAccountModel.findByPk(id, {
            where: {
                userId,
            },
        });
        return bankAccount;
    },

    update: async (id, bankName, initialBalance, userId) => {
        const bankAccount = await bankAccountModel.update({
            bankName,   
            initialBalance,
        }, {
            where: {
                id,
                userId,
            },
        });
        return bankAccount;
    },

    delete: async (id, userId) => {
        const bankAccount = await bankAccountModel.destroy({
            where: {
                id,
                userId,
            },
        });
        return bankAccount;
    },
}
