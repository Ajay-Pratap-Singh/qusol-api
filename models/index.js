const Sequelize = require('sequelize');

let sequelize

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
    sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
    sequelize = new Sequelize('qusol', 'postgres', 'password', {
        dialect: 'postgres',
    });
}

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
