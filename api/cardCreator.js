

function MakeWinLoseCard(userData) {


    // Green for win, red for lose.
    let color = userData.win ? "#008000" : "#8B0000";

    return (
    `<svg height="100" width="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <style>
        #border{
            fill: transparent;
            stroke-width: 7;
            stroke-opacity: 0.5;
            stroke: #D3D3D3;
        }
        #borderLine{
            fill: transparent;
            stroke-width: 7;
            stroke: ${color};
            animation: drawBoarder 1s 0s ease-in-out forwards;
        }
        
        @keyframes drawBoarder{
            from{
            stroke-dasharray: 0 800;
            }
            to{
            stroke-dasharray: 800;
            }
        }
        @keyframes fadeToColor{
            from{
            fill: #A9A9A9;
            }
            to{
            fill: ${color}
            }
        }
        @keyframes fadeIn{
            from{
            opacity: 0;
            }
            to{
            opacity: 1;
            }
        }
        
        #icon{
            fill: #A9A9A9;
            animation: fadeToColor 1s 0s linear forwards
        }
        #icon-box{
            transform: translate(10px, 12.5%) scale(1.5,1.5);
        }
        #top-text{
            animation: fadeIn 0.5s 0.25s linear both,
            fadeToColor 1s 0.5s linear forwards;
        }
        #mid-text{
            animation: fadeIn 0.5s 0.5s linear both,
            fadeToColor 1s 0.5s linear forwards;
        }
        #bot-text{
            animation: fadeIn 0.5s 0.75s linear both,
            fadeToColor 1s 0.5s linear forwards;
        }
        text{
            font-family: Helvetica;
            letter-spacing: 1px;
            font-size: 15px;
            font-weight: bold;
            fill: #A9A9A9;
        }
        
        </style>
        @import url('https://fonts.googleapis.com/css?family=Lato');
        <rect id="border" width="300" height="100"/>
        <rect id="borderLine" width="300" height="100"/>
        <g id="icon-box">
        <svg id="icon" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 0 0-.8 1.6L13 8.332v33.336L9.2 45.4A1 1 0 0 0 10 47h29c.304 0 .591-.138.781-.375l5-5A1.002 1.002 0 0 0 44 40H23V4a1 1 0 0 0-1-1H11zm14 4v2c9.925 0 18 8.075 18 18 0 4.144-1.421 7.954-3.783 11h2.469A19.877 19.877 0 0 0 45 27c0-11.028-8.972-20-20-20zm0 4v27h11.59C39.316 35.13 41 31.262 41 27c0-8.822-7.178-16-16-16zm-14 1.74c-3.456 3.394-5.693 8.025-5.97 13.172a20.3 20.3 0 0 0 .047 2.84c.425 4.88 2.616 9.26 5.923 12.508v-2.973A17.9 17.9 0 0 1 7 27a17.9 17.9 0 0 1 4-11.287V12.74zm0 6.531A15.894 15.894 0 0 0 9 27c0 2.802.729 5.436 2 7.729V19.27z"/></svg>
        </g>
        <g transform="translate(100,35)">
        <text id="top-text" x="0" y="00">${userData.name.toUpperCase()}</text>
        <text id="mid-text" x="0" y="22">${userData.win ? "WON" : "LOST"} LAST GAME </text>
        <text id="bot-text" x="0" y="44">GOING ${userData.kills}/${userData.deaths}/${userData.assists}</text>
        </g>
    
    </svg>
    
    `);
}

function MakeErrorCard(line1, line2, line3){

    return (
        `<svg height="100" width="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <style>
            #border{
                fill: transparent;
                stroke-width: 7;
                stroke-opacity: 0.5;
                stroke: #D3D3D3;
            }
            
            @keyframes drawBoarder{
                from{
                stroke-dasharray: 0 800;
                }
                to{
                stroke-dasharray: 800;
                }
            }
            @keyframes fadeIn{
                from{
                opacity: 0;
                }
                to{
                opacity: 1;
                }
            }
            
            #icon{
                fill: #A9A9A9;
            }
            #icon-box{
                transform: translate(10px, 12.5%) scale(1.5,1.5);
            }
            #top-text{
                animation: fadeIn 0.5s 0.25s linear both;
            }
            #mid-text{
                animation: fadeIn 0.5s 0.5s linear both;
            }
            #bot-text{
                animation: fadeIn 0.5s 0.75s linear both;
            }
            text{
                font-family: Helvetica;
                letter-spacing: 1px;
                font-size: 15px;
                font-weight: bold;
                fill: #A9A9A9;
            }
            
            </style>
            @import url('https://fonts.googleapis.com/css?family=Lato');
            <rect id="border" width="300" height="100"/>
            <g id="icon-box">
            <svg id="icon" xmlns="http://www.w3.org/2000/svg"><path d="M11 3a1 1 0 0 0-.8 1.6L13 8.332v33.336L9.2 45.4A1 1 0 0 0 10 47h29c.304 0 .591-.138.781-.375l5-5A1.002 1.002 0 0 0 44 40H23V4a1 1 0 0 0-1-1H11zm14 4v2c9.925 0 18 8.075 18 18 0 4.144-1.421 7.954-3.783 11h2.469A19.877 19.877 0 0 0 45 27c0-11.028-8.972-20-20-20zm0 4v27h11.59C39.316 35.13 41 31.262 41 27c0-8.822-7.178-16-16-16zm-14 1.74c-3.456 3.394-5.693 8.025-5.97 13.172a20.3 20.3 0 0 0 .047 2.84c.425 4.88 2.616 9.26 5.923 12.508v-2.973A17.9 17.9 0 0 1 7 27a17.9 17.9 0 0 1 4-11.287V12.74zm0 6.531A15.894 15.894 0 0 0 9 27c0 2.802.729 5.436 2 7.729V19.27z"/></svg>
            </g>
            <g transform="translate(100,35)">
            <text id="top-text" x="0" y="00">${line1}</text>
            <text id="mid-text" x="0" y="22">${line2}</text>
            <text id="bot-text" x="0" y="44">${line3}</text>
            </g>
        
        </svg>
        
        `);
}

exports.MakeWinLoseCard = MakeWinLoseCard;
exports.MakeErrorCard  = MakeErrorCard;