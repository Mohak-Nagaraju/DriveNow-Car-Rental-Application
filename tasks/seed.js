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

 
 
  //const cards1 = await cards.createCardInfo('639f6cca9b60fec455993a59','1111222233334444', '345', 'Mohak Nagaraju', '11', '2025');
  //const cards2 = await cards.getAllCards('639f6cca9b60fec455993a59');
  //const cards3 = await cards.getCardById('639f6d1fa36deb1f710578ad');
  //const card4 = await cards.deleteCard('639f6d1fa36deb1f710578ad');

  
  //const booking1 = await bookings.createBooking('55','2022/12/02','12.30pm','1.30pm','2022/12/03','hoboken');
  const payment2 = await payment.getPaymentById('639f8a693e255048b8e85f3a');
  //const payment1 = await payment.createPayment('639f8a693e255048b8e85f3a','639f80d7ec8ef4cd4014be65','wallet');
   //const wallet1 = await wallets.createWallet('639f80d7ec8ef4cd4014be65','55');
   //const wallet1 = await wallets.getAllWallet('639f80d7ec8ef4cd4014be65');
  
  
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};

main().catch(console.log);