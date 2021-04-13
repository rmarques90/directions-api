const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const {connectToMongoDb} = require("./Mongo");

const {initiateSchedules} = require('./Schedules');

const AdminRouter = require('./Express/admin');
const SystemRouter = require('./Express/system');
const LoginRouter = require('./Express/login');
const DirectionsRouter = require('./Express/directions');

app.use(bodyParser.json());

app.use('/admin', AdminRouter);
app.use('/system', SystemRouter);
app.use('/', LoginRouter);
app.use('/directions', DirectionsRouter);

const init = async () => {
    try {
        await connectToMongoDb();

        initiateSchedules();

        app.listen(port, () => {
            console.log('server started on port 3000...');
        })
    } catch (e) {
        console.error("error initializing application", e);
        process.exit(1);
    }
}

init();