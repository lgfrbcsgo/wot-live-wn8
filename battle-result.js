/**
 * The numeric battle type of a random battle.
 * @type {number}
 */
const RANDOM_BATTLE = 1;

/**
 * Determines whether the battle result is a random battle of not.
 * @param battleResult {object}
 * @returns {boolean}
 */
export function isRandomBattle(battleResult) {
    const battleType = getBattleType(battleResult);
    return battleType === RANDOM_BATTLE;
}

/**
 * Determines whether the battle result was a victory or a loss/draw.
 * @param battleResult {object}
 * @returns {boolean}
 */
export function isVictory(battleResult) {
    return getTeam(battleResult) === getWinnerTeam(battleResult);
}

/**
 * Returns the id of the player's vehicle
 * @param battleResult {object}
 * @returns {string}
 */
export function getVehicleId(battleResult) {
    const personal = battleResult && battleResult.personal;
    return Object.keys(personal).find(key => key !== 'avatar');
}

/**
 * Returns the stats of the player's vehicle given its id.
 * @param battleResult {object}
 * @param vehicleId {string}
 * @returns {object}
 */
export function getVehicle(battleResult, vehicleId) {
    return battleResult && battleResult.personal && battleResult.personal[vehicleId];
}

/**
 * Returns the damage dealt given the stats of a vehicle.
 * @param vehicle {object}
 * @returns {number}
 */
export function getDamageDealt(vehicle) {
    return vehicle && vehicle.damageDealt;
}

/**
 * Returns the spots given the stats of a vehicle.
 * @param vehicle {object}
 * @returns {number}
 */
export function getSpots(vehicle) {
    return vehicle && vehicle.spotted;
}

/**
 * Returns the frags given the stats of a vehicle.
 * @param vehicle {object}
 * @returns {number}
 */
export function getFrags(vehicle) {
    return vehicle && vehicle.kills;
}

/**
 * Returns the base defence points given the stats of a vehicle.
 * @param vehicle {object}
 * @returns {number}
 */
export function getDefencePoints(vehicle) {
    return vehicle && vehicle.droppedCapturePoints;
}

/**
 * Returns the numeric battle type of a battle result
 * @param battleResult {object}
 * @returns {number}
 */
function getBattleType(battleResult) {
    return battleResult && battleResult.common && battleResult.common.bonusType;
}


/**
 * Returns the number of the winner team from the battle result.
 * @param battleResult {object}
 * @returns {number}
 */
function getWinnerTeam(battleResult) {
    return battleResult && battleResult.common && battleResult.common.winnerTeam;
}

/**
 * Returns the number of the player's team from the battle result.
 * @param battleResult {object}
 * @returns {number}
 */
function getTeam(battleResult) {
    return battleResult && battleResult.personal && battleResult.personal.avatar && battleResult.personal.avatar.team;
}

