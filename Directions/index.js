const {Client} = require("@googlemaps/google-maps-services-js");

let client;

const {getSystemById} = require('../Mongo/system');
const {insertNewLog} = require('../Mongo/requestedRoutesLog');
const {transformRouteObj} = require('../Utils')

const getDirectionsByAddressString = async (origin, destination, user, waypoints = [], simplifiedResponse = false) => {
    if (!origin || !destination || !user || !user.systemId) {
        throw new Error('Args are invalid');
    }

    const system = await getSystemById(user.systemId);

    if (!system || !system._id) {
        throw new Error('System not found');
    }

    if (!system.apiKey) {
        throw new Error('System api key not found');
    }

    if (!client) {
        client = new Client({});
    }

    try {
        let paramsObj = {
            language: "pt-BR",
            units: "metric",
            optimize: (!!(waypoints && waypoints.length)),
            origin: origin,
            destination: destination,
            key: system.apiKey,
            waypoints: waypoints
        }

        const response = await client.directions({
            params: paramsObj,
            timeout: 15000, // milliseconds
        });

        if (response && response.status === 200 && response.data && response.data.routes) {
            // console.log(response.data.routes);

            //register the request
            const simplifiedObj = transformRouteObj(response.data.routes);

            await insertNewLog(user._id, system._id, response.data, simplifiedObj);

            if (simplifiedResponse) {
                return simplifiedObj;
            } else {
                return response.data.routes;
            }
        }
    } catch (e) {
        console.error('Error requesting directions by address string', e);
        if (e.status && e.status === 404) {
            console.log(`route not found -- origin ${origin} - destination ${destination}`);
            return;
        }
        throw e;
    }
}

module.exports = {
    getDirectionsByAddressString
}

