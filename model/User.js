const {UserModel} = require('./bd');

module.exports = {
    create: async (name, email, password, admin=false) => {

        const user = await UserModel.create({
            name,
            email,
            password,
            admin,
        });
        return user;
    },

    getAll: async (page = 0, pageSize = 5) => {
        const users = await UserModel.findAll(
            {
                limit: pageSize,
                offset: page * pageSize,
            }
        );
        return users;
    },

    getById: async (id) => {
        const user = await UserModel.findByPk(id);
        return user;
    },

    getByEmail: async (email) => {
        const user = await UserModel.findOne({
            where: {
                email,
            },
        });
        return user;
    },

    isAdmin: async (id) => {
        const user = await UserModel.findByPk(id);
        return user.admin;
    },

    update: async (id, name, email, password, admin) => {
        const user = await UserModel.update({
            name,
            email,
            password,
            admin,
        }, {
            where: {
                id,
            },
        });
        return user;
    },

    delete: async (id) => {
        const user = await UserModel.destroy({
            where: {
                id,
            },
        });
        return user;
    },
}
