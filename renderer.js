import {lookupWn8Color} from './colors.js';

export function renderTitle(winRate) {
    return `WN8: ${renderWn8(winRate)}`;
}

export function renderContent(wn8, showDisconnectedHint, showErrorFetchingExpectedValuesHint) {
    const wn8Color = lookupWn8Color(wn8)
    return `
        <style>
            body {
                color: ${useWhiteText(wn8Color) ? 'white' : 'black'};
                background-color: ${renderColor(wn8Color)};
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
            
            .error-fetching-hint {
                display: ${showErrorFetchingExpectedValuesHint ? 'block' : 'none'};
            }
        </style>
        <div class="container">
            <div class="label">WN8</div>
            <div class="win-rate">${renderWn8(wn8)}</div>
            <div class="disconnected-hint">
                Disconnected.<br>
                Could not connect to the battle results server.<br>
                Make sure that WoT is running and that the battle results server mod is installed correctly.<br>
                Refresh this page to reconnect.
            </div>
            <div class="error-fetching-hint">
                Could not fetch the WN8 expected values.<br>
                Refresh this page to retry.
            </div>
        </div>
    `;
}

export function renderFavicon(winRate) {
    const winRateColor = lookupWn8Color(winRate);

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

function renderWn8(wn8) {
    return isNaN(wn8) ? 'N/A' : `${wn8.toFixed(0)}`;
}

function renderColor(rgb) {
    return `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;
}

function useWhiteText(color) {
    const brightness = (color.red * 299 + color.green * 587 + color.blue * 114) / 1000;
    return brightness < 125;
}
