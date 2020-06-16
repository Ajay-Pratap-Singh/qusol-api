module.exports = (sequelize, DataTypes) => {


    const Hobby = sequelize.define('hobbie', {
        hobby: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })


    Hobby.associate = (models) => {
        Hobby.belongsTo(models.Profile)
    };

    return Hobby
}