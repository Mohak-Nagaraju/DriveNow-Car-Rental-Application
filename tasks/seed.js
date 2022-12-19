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
 
  //User -------------------------->//
  const mohak = await users.createUser('Mohak     ', 'Nagaraju', 'aBc@GmAIL.CoM', 'male','Hoboken','NJ','25','Test123$', 'ABC123456789123');
  
  const sneha = await users.createUser('Sneha','Jadhav','sneha93@gmail.com','female','Hoboken','NJ','28','Test456$','QWE987654329786');
  const rose = await users.createUser('rose','marta','martaevi123@gmail.com','female','Hoboken','NJ','28','Test458$','QWE987654329786');
  const ross = await users.createUser('ross','joseph','josephrose@gmail.com','transgender','NewPort','NJ','33','Pass490$','ZXC987654329001');
  const rachel = await users.createUser('rachel','sharma','sharma22@gmail.com','male','NewPort','NJ','30','Asdr490$','MCV987654329201');
  const shruti = await users.createUser('shruti','mehta','mehta223@gmail.com','female','NewPort','NJ','40','Inkr488$','ITK987654323401');

  const allUsers = await users.getAllUsers();
  console.log(allUsers);
  const userById = await users.getUserById('639fe4ffb137951ea5504c28');
  console.log(userById);
  const userById1 = await users.getUserById('639fe508b137951ea5504c29');
  console.log(userById1);
  const userById2 = await users.getUserById('639fe512b137951ea5504c2a');
  console.log(userById2);

  const deleteUsers1 = await users.deleteUser('639fe4ffb137951ea5504c28');
  const deleteUsers2 = await users.deleteUser('639fe508b137951ea5504c29');
  const deleteUsers3 = await users.deleteUser('639fe512b137951ea5504c2a');

  const updateUser1 = await users.updateUser('Sneha','Jadhav','sneha93@gmail.com','female','Jersey City','NJ','20','Test456$','QWE987654329786');
  const updateUser2 = await users.updateUser('mohak','Naga','aBc@GmAIL.CoM','male','Jersey City','NJ','55','Test456$','QWE987654329786');
  const updateUser3 = await users.updateUser('shruti','patel','patel223@gmail.com','female','Jersey City','NJ','20','Test456$','RTY987654329786');

  const checkUser1 = await users.checkUser('aBc@GmAIL.CoM','Test123$');
  const checkUser2 = await users.checkUser('sneha93@gmail.com','Test456$');
  const checkUser3 = await users.checkUser('martaevi123@gmail.com','Test458$');

//cars------------------------------>//
  const car1 = await cars.createCar('sEdAn', 'Hoboken', 'Toyoto', 'Accord','$25','yes');
  const car2 = await cars.createCar('SUV', 'Hoboken', 'Toyoto', 'Highlander','$40','yes');
  const car3 = await cars.createCar('hatchback', 'Hoboken', 'Honda', 'Civic','$30','no');
  const car4 = await cars.createCar('hatchback', 'jersey city', 'Honda', 'Civic','$30','no');
  const car5 = await cars.createCar('hatchback', 'new port', 'Toyota', 'Highlander','$45','yes');
  const car6 = await cars.createCar('hatchback', 'jersey city', 'Honda', 'Civic','$30','yes');

  const allCars = await cars.getAllCars();
  console.log(allCars);

  const getCarById1 = await cars.getCarById('639febd691b59c3e3b80fcf9');
  const getCarById2 = await cars.getCarById('639febd691b59c3e3b80fcfa');
  const getCarById3 = await cars.getCarById('639febd691b59c3e3b80fcfb');


  
 
  //const cards1 = await cards.createCardInfo('639f6cca9b60fec455993a59','1111222233334444', '345', 'Mohak Nagaraju', '11', '2025');
  //const cards2 = await cards.getAllCards('639f6cca9b60fec455993a59');
  //const cards3 = await cards.getCardById('639f6d1fa36deb1f710578ad');
  //const card4 = await cards.deleteCard('639f6d1fa36deb1f710578ad');

  
  //booking--------------------->//
  const booking1 = await bookings.createBooking('55','2022/12/02','12.30pm','1.30pm','2022/12/03','hoboken');
  const booking2 = await bookings.createBooking('125','2022/12/18','12.30pm','1.30pm','2022/12/19','hoboken');
  const booking3 = await bookings.createBooking('125','2022/12/18','12.30pm','1.30pm','2022/12/19','newport');

  const allBooking = await bookings.getAllBookings();
  console.log(allBooking);

  const bookingById1 = await bookings.getBookingById('639f8a693e255048b8e85f3a');
  const bookingById2 = await bookings.getBookingById('639fe94ca55ea16930d463ef');
  const bookingById3 = await bookings.getBookingById('639fe94ca55ea16930d463f0');
  console.log(bookingById3);
  console.log(bookingById2);
  console.log(bookingById1);

  const deleteBookingDetails1 = await bookings.deleteBookingDetails('639f8a693e255048b8e85f3a');
  const deleteBookingDetails2 = await bookings.deleteBookingDetails('639fe94ca55ea16930d463ef');
  const deleteBookingDetails3 = await bookings.deleteBookingDetails('639fe94ca55ea16930d463f0');

  const updatebooking1 = await bookings.updateBooking('55','2022/12/22','12.30pm','1.30pm','2022/12/23','newport');
  const updatebooking2 = await bookings.updateBooking('34','2022/12/23','12.30pm','1.30pm','2022/12/24','newjersey');
  const updatebooking3 = await bookings.updateBooking('90','2022/12/20','12.30pm','1.30pm','2022/12/21','hoboken');


  

  //const payment2 = await payment.getPaymentById('639f8a693e255048b8e85f3a');
  //const payment1 = await payment.createPayment('639f8a693e255048b8e85f3a','639f80d7ec8ef4cd4014be65','wallet');
   //const wallet1 = await wallets.createWallet('639f80d7ec8ef4cd4014be65','55');
   //const wallet1 = await wallets.getAllWallet('639f80d7ec8ef4cd4014be65');
  
  
  console.log('Done seeding database');
  await dbConnection.closeConnection();
};

main().catch(console.log);