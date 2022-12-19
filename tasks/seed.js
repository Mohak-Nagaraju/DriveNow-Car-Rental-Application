const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const cars = data.cars;
const booking = data.booking;
const main = async () => {
  const db = await dbConnection.dbConnection();
  //await db.dropDatabase();
  //const mohak = await users.createUser('Mohak     ', 'Nagaraju', 'aBc@GmAIL.CoM', 'male','Hoboken','NJ','25','Test123$', 'ABC123456789123');  
  //const parul = await users.createUser('Parul     ', 'Mahajan', 'parul123@aol.com', 'OthEr','Hoboken','NJ','25','Test123@', 'ABC123456789123');

  //const car1 = await cars.createCar('sEdAn', 'Hoboken', 'Toyoto', 'Accord','$25','yes');
  //const car2 = await cars.createCar('SUV', 'Hoboken', 'Toyoto', 'Highlander','$40','yes');
  //const car3 = await cars.createCar('hatchback', 'Hoboken', 'Honda', 'Civic','$30','no'); 
  const updateCheck = await  cars.updateCarAvailabilty("63a07ea5869217694717210a");
  
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};

main().catch(console.log);