const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const cars = data.cars;
const cards = data.cards;
const bookings = data.booking;
const payment = data.payment;

const main = async () => {
  const db = await dbConnection.dbConnection();
  await db.dropDatabase();

  const mohak = await users.createUser('Mohak     ', 'Nagaraju', 'aBc@GmAIL.CoM', 'MaN','Hoboken','NJ','25','Test123$', 'ABC123456789123');
  const car1 = await cars.createCar('sEdAn', 'Hoboken', 'Toyoto', 'Accord','$35','yes');
  const card1 = await cards.createCardInfo('{1234 1234 1234 1234}', '123', '  Mohak naga  ','10', '2010');
  //const card2 = await cards.updateCardInfo('{1234 4567 1234 1234}', '456', 'Mohak', 'Nagaraju', '11', '2011')
  const booking1 = await bookings.createBooking('55', '14 November 2022', '12.30pm', '1.30pm', '15 November 2022', 'hoboken');
  const payment1 = await payment.createPayment('639c8bfd06a6f9ed6651878b', '639c8bf306a6f9ed66518788','Crede');
  
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};

main().catch(console.log);