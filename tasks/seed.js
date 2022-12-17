const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const cars = data.cars;

const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  const mohak = await users.createUser('Mohak     ', 'Nagaraju', 'aBc@GmAIL.CoM', 'Male','Hoboken','NJ','25','Test123$', 'ABC123456789123');
  const parul = await users.createUser('Parul     ', 'Mahajan', 'parul123@aol.com', 'OthEr','Hoboken','NJ','25','Test123@', 'ABC123456789123');

  const car1 = await cars.createCar('sEdAn', 'Hoboken', 'Toyoto', 'Accord','$35','yes');
  
  
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};

main().catch(console.log);