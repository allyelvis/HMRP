const { initAuth } = require('./modules/auth');
const { initHotel } = require('./modules/hotel');
const { initRestaurant } = require('./modules/restaurant');
const { initRetail } = require('./modules/retail');
const { initAccounting } = require('./modules/accounting');
const { initSales } = require('./modules/sales');
const { initProduct } = require('./modules/product');
const { initInventory } = require('./modules/inventory');
const { initReport } = require('./modules/report');
const { initUser } = require('./modules/user');
const { initConfig } = require('./modules/config');

const initModules = () => {
  initAuth();
  initHotel();
  initRestaurant();
  initRetail();
  initAccounting();
  initSales();
  initProduct();
  initInventory();
  initReport();
  initUser();
  initConfig();
};

const runApp = () => {
  console.log('Initializing AENZBi backend modules...');
  initModules();
  console.log('AENZBi backend modules initialized successfully.');
};

runApp();
