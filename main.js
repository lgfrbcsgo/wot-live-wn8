/**
 * The address of the battle results websocket server.
 * @type {string}
 */
const SERVER_ADDRESS = 'ws://localhost:15455';


// ============================================================================
// STATE
// ============================================================================

/**
 * The amount of damage dealt within the current session.
 * @type {number}
 */
let damageDealt = 0;

/**
 * The expected amount of damage dealt within the current session.
 * @type {number}
 */
let expectedDamageDealt = 0;

/**
 * The amount of spots within the current session.
 * @type {number}
 */
let spots = 0;

/**
 * The expected amount of spots within the current session.
 * @type {number}
 */
let expectedSpots = 0;

/**
 * The amount of frags within the current session.
 * @type {number}
 */
let frags = 0;

/**
 * The expected amount of frags within the current session.
 * @type {number}
 */
let expectedFrags = 0;

/**
 * The amount of base defence point within the current session.
 * @type {number}
 */
let defencePoints = 0;

/**
 * The expected amount of base defence point within the current session.
 * @type {number}
 */
let expectedDefencePoints = 0;

/**
 * The count of victories within the current session.
 * @type {number}
 */
let victories = 0;

/**
 * The expected count of victories within the current session.
 * @type {number}
 */
let expectedVictories = 0;

/**
 * Boolean flag whether we must show a hint that we're disconnected from the websocket server.
 * @type {boolean}
 */
let showDisconnectedHint = false;

/**
 * Boolean flag whether we must show a hint that we could not fetch the expected values.
 * @type {boolean}
 */
let showErrorFetchingExpectedValuesHint = false;


// ============================================================================
// INIT
// ============================================================================

render();

/**
 * Websocket connection to the battle results server.
 * @type {WebSocket}
 */
const ws = new WebSocket(SERVER_ADDRESS);

ws.addEventListener('open', onOpen);
ws.addEventListener('message', onMessage);
ws.addEventListener('close', onDisconnect);
ws.addEventListener('error', onDisconnect);


// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Called once the websocket connection has been established.
 * Calls `get_battle_results` and `subscribe` methods through JSON RPC to receive all previous battle results
 * and to subscribe to all new ones.
 */
function onOpen() {
    ws.send(JSON.stringify([
        {
            jsonrpc: '2.0',
            method: 'get_battle_results',
            id: 1,
        },
        {
            jsonrpc: '2.0',
            method: 'subscribe',
            id: 2,
        }
    ]));
}

/**
 * Called for every message which we receive through the websocket connection.
 * Parses the event data as JSON, and then proceeds with handling the JSON RPC messages.
 * @param event {MessageEvent}
 */
function onMessage(event) {
    const parsed = JSON.parse(event.data);
    if (Array.isArray(parsed)) {
        // received a response to our batch request
        for (const message of parsed) {
            onJsonRpcMessage(message);
        }
    } else {
        onJsonRpcMessage(parsed);
    }
}

/**
 * Called for every JSON RPC message we receive.
 * Reads battle results from the message and proceeds with handling them.
 * @param message {object}
 */
function onJsonRpcMessage(message) {
    if (message.method === 'subscription') {
        // received a `subscription` notification
        const battleResult = message.params.battleResult;
        onBattleResult(battleResult);
    } else if (message.result && message.id === 1) {
        // received response to our `get_battle_results` call
        for (const battleResult of message.result.battleResults) {
            onBattleResult(battleResult);
        }
    } else if (message.error) {
        // received an error
        console.error('Error:', message.error);
    }
}

import {isRandomBattle} from './battle-result.js';
import {fetchExpectedValuesCached} from './expected-values.js';

/**
 * Called for every battle result which we receive from the server.
 * Checks whether the result is a random battle, waits for the expected values to be loaded,
 * then updates the state and renders.
 * @param battleResult {object}
 */
function onBattleResult(battleResult) {
    if (isRandomBattle(battleResult)) {
        fetchExpectedValuesCached()
            .then(expectedValues => onRandomBattleResult(battleResult, expectedValues))
            .catch(onErrorFetchingExpectedValues);
    }
}

import {
    getVehicleId,
    getVehicle,
    getDamageDealt,
    getSpots,
    getFrags,
    getDefencePoints,
    isVictory,
} from './battle-result.js';
import {
    getExpectedValues,
    getExpectedDamageDealt,
    getExpectedSpots,
    getExpectedFrags,
    getExpectedDefencePoints,
    getExpectedVictories
} from './expected-values.js';

/**
 * Called for every random battle result which we receive.
 * Only called after the expected values have been loaded.
 * @param battleResult {object}
 * @param expectedValuesMap {object}
 */
function onRandomBattleResult(battleResult, expectedValuesMap) {
    const vehicleId = getVehicleId(battleResult);
    const vehicle = getVehicle(battleResult, vehicleId);
    const expectedValues = getExpectedValues(expectedValuesMap, vehicleId);

    if (!vehicle || !expectedValues) {
        return;  // no or unknown vehicle
    }

    damageDealt += getDamageDealt(vehicle);
    expectedDamageDealt += getExpectedDamageDealt(expectedValues);

    spots += getSpots(vehicle);
    expectedSpots += getExpectedSpots(expectedValues);

    frags += getFrags(vehicle);
    expectedFrags += getExpectedFrags(expectedValues);

    defencePoints += getDefencePoints(vehicle);
    expectedDefencePoints += getExpectedDefencePoints(expectedValues);

    victories += isVictory(battleResult) ? 1 : 0;
    expectedVictories += getExpectedVictories(expectedValues);

    render();
}

/**
 * Called when we couldn't fetch the expected values.
 * Set the flag to show a hint to the user and rerender.
 */
function onErrorFetchingExpectedValues() {
    showErrorFetchingExpectedValuesHint = true;
    render();
}

/**
 * Called when we couldn't connect to the server, or when the connection was closed.
 * Set the flag to show a hint to the user that we are disconnected from the server and rerender.
 */
function onDisconnect() {
    showDisconnectedHint = true;
    render();
}


// ============================================================================
// RENDERING
// ============================================================================

/**
 * Helper function for normalizing stats according to WN8 spec.
 * See https://wiki.wargaming.net/en/Player_Ratings_(WoT)#Step_2
 * @param rSTAT
 * @param constant
 * @returns {number}
 */
function normalizeValue(rSTAT, constant) {
    return (rSTAT - constant) / (1 - constant);
}

/**
 * Calculates WN8 based on the current state.
 * See https://wiki.wargaming.net/en/Player_Ratings_(WoT)#The_Steps_of_WN8_-_The_Formula
 * @returns {number}
 */
function calculateWn8() {
    const rDAMAGE = damageDealt / expectedDamageDealt;
    const rSPOT = spots / expectedSpots;
    const rFRAG = frags / expectedFrags;
    const rDEF = defencePoints / expectedDefencePoints;
    const rWIN = victories / expectedVictories;

    const rWINc = Math.max(0, normalizeValue(rWIN, 0.71));
    const rDAMAGEc = Math.max(0, normalizeValue(rDAMAGE, 0.22));
    const rFRAGc = Math.max(0, Math.min(rDAMAGEc + 0.2, normalizeValue(rFRAG, 0.12)));
    const rSPOTc = Math.max(0, Math.min(rDAMAGEc + 0.1, normalizeValue(rSPOT, 0.38)));
    const rDEFc = Math.max(0, Math.min(rDAMAGEc + 0.1, normalizeValue(rDEF, 0.1)));

    return 980 * rDAMAGEc
        + 210 * rDAMAGEc * rFRAGc
        + 155 * rFRAGc * rSPOTc
        + 75 * rDEFc * rFRAGc
        + 145 * Math.min(1.8, rWINc);
}

import {renderTitle, renderContent, renderFavicon} from './renderer.js';

/**
 * Updates the page based on the current state.
 */
function render() {
    const wn8 = calculateWn8();
    document.title = renderTitle(wn8);
    document.body.innerHTML = renderContent(wn8, showDisconnectedHint, showErrorFetchingExpectedValuesHint);
    document.querySelector('#favicon').href = renderFavicon(wn8);
}
