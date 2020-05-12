/**
 * The URL to the list of expect values.
 * @type {string}
 */
const EXPECTED_VALUES_URL = 'https://static.modxvm.com/wn8-data-exp/json/wn8exp.json';

/**
 * Variable for caching the expected values.
 * @type {Promise<object>}
 */
let expectedValuesMapPromise = null;

/**
 * Fetches the expected values or returns them from the cache if they have been fetched already.
 * @returns {Promise<object>}
 */
export function fetchExpectedValuesCached() {
    if (!expectedValuesMapPromise) {
        expectedValuesMapPromise = fetchExpectedValues();
    }
    return expectedValuesMapPromise;
}

/**
 *  Fetches the map from vehicle id to expected values.
 * @returns {Promise<object>}
 */
export function fetchExpectedValues() {
    return fetch(EXPECTED_VALUES_URL)
        .then(response => response.json())
        .then(content => expectedValuesToMap(content.data));
}

/**
 * Returns the expected values give a vehicle id and a map from vehicle id to expected values
 * @param expectedValuesMap
 * @param vehicleId
 * @returns {object}
 */
export function getExpectedValues(expectedValuesMap, vehicleId) {
    return expectedValuesMap[vehicleId];
}

/**
 * Returns the expected damage dealt given expected values
 * @param expectedValues
 * @returns {number}
 */
export function getExpectedDamageDealt(expectedValues) {
    return expectedValues && expectedValues.expDamage;
}

/**
 * Returns the expected spots given expected values
 * @param expectedValues
 * @returns {number}
 */
export function getExpectedSpots(expectedValues) {
    return expectedValues && expectedValues.expSpot;
}

/**
 * Returns the expected frags given expected values
 * @param expectedValues
 * @returns {number}
 */
export function getExpectedFrags(expectedValues) {
    return expectedValues && expectedValues.expFrag;
}

/**
 * Returns the expected defence points given expected values
 * @param expectedValues
 * @returns {number}
 */
export function getExpectedDefencePoints(expectedValues) {
    return expectedValues && expectedValues.expDef;
}

/**
 * Returns the expected victories given expected values
 * @param expectedValues
 * @returns {number}
 */
export function getExpectedVictories(expectedValues) {
    return expectedValues && expectedValues.expWinRate && expectedValues.expWinRate / 100;
}

/**
 * Converts a list of expected values to a map from vehicle id to expected values.
 * @param values
 * @returns {object}
 */
function expectedValuesToMap(values) {
    const expectedValuesById = {};
    for (const entry of values) {
        expectedValuesById[entry.IDNum] = entry;
    }
    return expectedValuesById;
}
