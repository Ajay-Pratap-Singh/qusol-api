module.exports = (sequelize, DataTypes) => {


    const Profile = sequelize.define('profile', {
        full_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cover_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone_number_country_code: {
            type: DataTypes.CHAR,
            allowNull: true
        },
        phone_number: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zipcode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        street_address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        education: {
            type: DataTypes.STRING,
            allowNull: true
        },
        currently_employed: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })

    Profile.associate = (models) => {
        Profile.belongsTo(models.User);
        Profile.hasMany(models.Hobby)
    };

    return Profile
    // Categories in which he is expert
    // Hobbies/Interests
}