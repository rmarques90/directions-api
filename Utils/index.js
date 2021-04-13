/**
 * Simplify a route obj
 * @param {Object|Array} routeObj
 * @returns {{polylinePoints: LatLng[] | string | SVGPointList, legs: []}}
 */
const transformRouteObj = (routeObj) => {

    if (Array.isArray(routeObj) && routeObj.length) {
        routeObj = routeObj[0];
    }

    if (!routeObj) {
        throw new Error('route obj is invalid')
    }

    let obj = {
        polylinePoints: routeObj['overview_polyline'].points,
        legs: []
    }

    if (routeObj['legs'] && routeObj['legs'].length) {

        for (let i = 0; i < routeObj['legs'].length; i++) {
            let legObj = routeObj['legs'][i];

            let objToInsert = {
                start_address: legObj['start_address'],
                end_address: legObj['end_address'],
                distance: legObj['distance'].value,
                duration: legObj['duration'].value,
                steps: []
            };

            if (legObj.steps && legObj.steps.length) {
                legObj.steps.forEach(s => {
                    objToInsert.steps.push(s.html_instructions);
                })
            }

            obj.legs.push(objToInsert);
        }

    }

    // console.log("object made", JSON.stringify(obj));

    return obj;

}

module.exports = {
    transformRouteObj
}