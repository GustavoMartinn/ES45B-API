const {investmentModel} = require('./bd');

module.exports = {
    create: async (code, buyPrice, buyDate, userId) => {
        const investment = await investmentModel.create({
            code,
            buyPrice,
            buyDate,
            userId,
        });
        return investment;
    },

    getAllByUserId: async (userId) => {
        const investments = await investmentModel.findAll({
            where: {
                userId,
            },
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

    update: async (id, code, buyPrice, buyName, userId) => {
        const investment = await investmentModel.update({
            code,
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
