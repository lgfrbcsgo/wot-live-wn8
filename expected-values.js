const EXPECTED_VALUES_URL = "https://static.modxvm.com/wn8-data-exp/json/wn8exp.json";

let expectedValuesMapPromise = null;

export function fetchExpectedValuesCached() {
    if (!expectedValuesMapPromise) {
        expectedValuesMapPromise = fetchExpectedValues();
    }
    return expectedValuesMapPromise;
}

export function fetchExpectedValues() {
    return fetch(EXPECTED_VALUES_URL)
        .then(response => response.json())
        .then(content => expectedValuesToMap(content.data));
}

export function getExpectedValues(expectedValuesMap, vehicleId) {
    return expectedValuesMap[vehicleId];
}

export function getExpectedDamageDealt(expectedValues) {
    return expectedValues && expectedValues.expDamage;
}

export function getExpectedSpots(expectedValues) {
    return expectedValues && expectedValues.expSpot;
}

export function getExpectedFrags(expectedValues) {
    return expectedValues && expectedValues.expFrag;
}

export function getExpectedDefencePoints(expectedValues) {
    return expectedValues && expectedValues.expDef;
}

export function getExpectedVictories(expectedValues) {
    return expectedValues && expectedValues.expWinRate;
}

function expectedValuesToMap(values) {
    const expectedValuesById = {};
    for (const entry of values) {
        expectedValuesById[entry.IDNum] = entry;
    }
    return expectedValuesById;
}
