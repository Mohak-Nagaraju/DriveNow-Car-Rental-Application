//Here you will require both data files and export them as shown in lecture code where there is more than one data file. Look at lecture 6 lecture code for example
const usersData = require('./users');
const carsData = require('./cars');



module.exports = {
  users: usersData,
  cars: carsData,
 
};