const Sequelize = require('sequelize');

const sequelize = new Sequelize('qusol', 'postgres', 'password', {
    dialect: 'postgres',
});

const models = {
    User: sequelize.import("./User/User"),
    Profile: sequelize.import("./User/Profile"),
    Hobby: sequelize.import("./User/Hobby")
};

Object.keys(models).forEach(modelName => {
    if ("associate" in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;


module.exports = models;
