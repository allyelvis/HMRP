module.exports = (sequelize, DataTypes) => {
  const Patient = sequelize.define('Patient', {
    name: DataTypes.STRING,
    age: DataTypes.INTEGER,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
  });
  return Patient;
};
