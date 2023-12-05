const {investmentModel} = require('./bd');

module.exports = {
    create: async (code, amount, buyPrice, buyDate, userId) => {
        const investment = await investmentModel.create({
            code,
            amount,
            buyPrice,
            buyDate,
            userId,
        });
        return investment;
    },

    getAllByUserId: async (userId, page = 0, pageSize = 5) => {
        const investments = await investmentModel.findAll({
            where: {
                userId,
            },
            limit: pageSize,
            offset: page * pageSize,
        });
        return investments;
    },

    getById: async (id, userId) => {
        const investment = await investmentModel.findByPk(id, {
            where: {
                userId,
            },
        });
        return investment;
    },

    getQuote: async (code) => {
        const investment = await investmentModel.findOne({
            where: {
                code,
            },
        })
        return investment;
    },

    update: async (id, code, amount, buyPrice, buyName, userId) => {
        const investment = await investmentModel.update({
            code,
            amount,
            buyPrice,
            buyName,
        }, {
            where: {
                id,
                userId,
            },
        });
        return investment;
    },

    delete: async (id, userId) => {
        const investment = await investmentModel.destroy({
            where: {
                id,
                userId,
            },
        });
        return investment;
    },
}
