
module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('user', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    })

    User.associate = (models) => {
        User.hasOne(models.Profile);
    };

    return User

}