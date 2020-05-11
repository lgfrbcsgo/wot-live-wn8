import {lookupWinRateColor} from './colors.js';

export function renderTitle(winRate) {
    return `Win rate: ${renderWinRate(winRate)}`;
}

export function renderContent(winRate, showDisconnectedHint) {
    const winRateColor = lookupWinRateColor(winRate)
    return `
        <style>
            body {
                color: ${useWhiteText(winRateColor) ? 'white' : 'black'};
                background-color: ${renderColor(winRateColor)};
            }

            .container {
                box-sizing: border-box;
                padding: 1rem;
                width: 100%;
                text-align: center;
                position: fixed;
                top: 50%;
                left: 0;
                transform: translateY(-50%);
                font-family: Arial, Helvetica, sans-serif;
            }

            .label {
                font-size: 2.5rem;
            }

            .win-rate {
                font-size: 8rem;
            }

            .disconnected-hint {
                display: ${showDisconnectedHint ? 'block' : 'none'};
            }
        </style>
        <div class="container">
            <div class="label">Win rate</div>
            <div class="win-rate">${renderWinRate(winRate)}</div>
            <div class="disconnected-hint">
                Disconnected.<br>
                Could not connect to the battle results server.<br>
                Make sure that WoT is running and that the battle results server mod is installed correctly.<br>
                Refresh this page to reconnect.
            </div>
        </div>
    `;
}

export function renderFavicon(winRate) {
    const winRateColor = lookupWinRateColor(winRate);

    const canvas = document.createElement('canvas');
    canvas.height = 16;
    canvas.width = 16;

    const ctx = canvas.getContext("2d");
    ctx.fillStyle = renderColor(winRateColor);
    ctx.beginPath();
    ctx.rect(0, 0, 16, 16);
    ctx.fill();

    return canvas.toDataURL();
}

function renderWinRate(winRate) {
    return isNaN(winRate) ? 'N/A' : `${(winRate * 100).toFixed(0)}%`;
}

function renderColor(rgb) {
    return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
}

function useWhiteText(color) {
    const brightness = (color.red * 299 + color.green * 587 + color.blue * 114) / 1000;
    return brightness < 125;
}
