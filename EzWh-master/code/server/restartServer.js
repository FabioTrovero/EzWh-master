const SKUController = require('./controller/SKUController');
const SKUItemController = require('./controller/SKUItemController');
const PositionController = require('./controller/PositionController');
const ItemController = require('./controller/ItemController');
const UserController = require('./controller/UserController');
const IOController = require('./controller/internalOrderController');
const RESController = require('./controller/restockOrderController');
const RETController = require('./controller/returnOrderController');
const TDController = require('./controller/testDescriptorController');
const TRController = require('./controller/testResultController');

const daoSKU = new SKUController();
const daoSKUitem = new SKUItemController();
const daoPosition = new PositionController();
const daoItem = new ItemController();
const daoIO = new IOController();
const daoRes = new RESController();
const daoRet = new RETController();
const daoTD = new TDController();
const daoTR = new TRController();
const DB = require('./database/EzWh_Database');
const db = new DB('EzWh.db');

db.startConnection();
daoSKU.resetTable(db);
daoSKUitem.resetTable(db);
daoPosition.resetTable(db);
daoItem.resetTable(db);
daoIO.resetTable(db);
daoRes.resetTable(db);
daoRet.resetTable(db);
daoTD.resetTableTestDescriptor(db);
daoTR.resetTableTestResult(db);

db.endConnection();