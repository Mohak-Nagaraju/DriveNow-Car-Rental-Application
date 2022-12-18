const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const { createCardInfo } = require('../data/cards');
const users = data.users;
const cars = data.cars;
const cards = data.cards;
const bookings = data.booking;
const payment = data.payment;
const wallets = data.wallet;

const main = async () => {
  const db = await dbConnection.dbConnection();
  //await db.dropDatabase();

  //const mohak = await users.createUser('Mohak     ', 'Nagaraju', 'aBc@GmAIL.CoM', 'male','Hoboken','NJ','25','Test123$', 'ABC123456789123');
  //console.log(mohak);
  //const car1 = await cars.createCar('sEdAn', 'Hoboken', 'Toyoto', 'Accord','$25','yes');
  //const car2 = await cars.createCar('SUV', 'Hoboken', 'Toyoto', 'Highlander','$40','yes');
  //const car3 = await cars.createCar('hatchback', 'Hoboken', 'Honda', 'Civic','$30','no');

 
<<<<<<< HEAD
  const parul = await users.createUser('Parul     ', 'Mahajan', 'parul123@aol.com', 'OthEr','Hoboken','NJ','25','Test123@', 'ABC123456789123');

 //const check = await cars.getCarLocation('Hoboken');
=======
>>>>>>> 8dc5994bd36eb57cf025cdf2e4dab5199e4b1236
 
  const cards1 = await cards.createCardInfo('639dfc15195383a3dc5bb48d','1111222233334444', '345', 'Mohak Nagaraju', '11', '2025');

  
  //const booking1 = await bookings.createBooking('55','2022/12/02','12.30pm','1.30pm','2022/12/03','hoboken');
  //const payment1 = await payment.createPayment('639ce5649a84e2c6a41f8dc2','639ce5649a84e2c6a41f8dbe','wallet');
  //const wallet1 = await wallets.createWallet('639d29b7c5ba2691f94af9f1','55','1111222233334444', '345', 'Mohak Nagaraju', '11', '2025');
  
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};

main().catch(console.log);