require('dotenv').config();

const {Client} = require("@googlemaps/google-maps-services-js");

const client = new Client({});

client
    .directions({
        params: {
            language: "pt-BR",
            units: "metric",
            optimize: true,
            origin: "Rua C-152, 201 - Goiânia/GO - Brasil",
            destination: "Rua Alberto Pinto de Faria, 101 - Caçapava/SP - Brasil",
            waypoints: [
              "Taubaté shopping - Taubaté/SP - Brasil",
              "Shopping Colinas - São José dos Campos/SP - Brasil"
            ],
            key: process.env.API_KEY,
        },
        timeout: 15000, // milliseconds
    })
    .then((r) => {
        console.log(r.data.routes);
        console.log(r.data.routes[0].legs);
    })
    .catch((e) => {
        console.log(e);
    });

