const dbConnection = require('../config/mongoConnection');
const data = require('../data/');

const users = data.users;
const cars = data.cars;



const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();
 
 
  const mohak = await users.createUser('Mohak     ', 'Nagaraju', 'aBc@GmAIL.CoM', 'male','Hoboken','NJ','25','Test123$', 'ABC123456789123');
  
  const sneha = await users.createUser('Sneha','Jadhav','sneha93@gmail.com','female','Hoboken','NJ','28','Test456$','QWE987654329786');
  const rose = await users.createUser('rose','marta','martaevi123@gmail.com','female','Hoboken','NJ','28','Test458$','QWE987654329786');
  const ross = await users.createUser('ross','joseph','josephrose@gmail.com','transgender','NewPort','NJ','33','Pass490$','ZXC987654329001');
  const rachel = await users.createUser('rachel','sharma','sharma22@gmail.com','male','NewPort','NJ','30','Asdr490$','MCV987654329201');
  const shruti = await users.createUser('shruti','mehta','mehta223@gmail.com','female','NewPort','NJ','40','Inkr488$','ITK987654323401');

 

//cars------------------------------>//
  const car1 = await cars.createCar('sEdAn', 'Hoboken', 'Toyoto', 'Accord','$25','yes');
  const car2 = await cars.createCar('SUV', 'Hoboken', 'Toyoto', 'Highlander','$40','yes');
  const car3 = await cars.createCar('hatchback', 'Hoboken', 'Honda', 'Civic','$30','no');
  const car4 = await cars.createCar('hatchback', 'jersey city', 'Honda', 'Civic','$30','no');
  const car5 = await cars.createCar('hatchback', 'new port', 'Toyota', 'Highlander','$45','yes');
  const car6 = await cars.createCar('hatchback', 'jersey city', 'Honda', 'Civic','$30','yes');

  

  
 
  
  
  
  
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};

main().catch(console.log);
