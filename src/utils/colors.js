const colors = {
    'BOLD'          : ['\x1B[1m',  '\x1B[22m'],
    'ITALIC'        : ['\x1B[3m',  '\x1B[23m'],
    'UNDERLINE'     : ['\x1B[4m',  '\x1B[24m'],
    'INVERSE'       : ['\x1B[7m',  '\x1B[27m'],
    'STRIKETHROUGH' : ['\x1B[9m',  '\x1B[29m'],
    'WHITE'         : ['\x1B[37m', '\x1B[39m'],
    'GREY'          : ['\x1B[90m', '\x1B[39m'],
    'BLACK'         : ['\x1B[30m', '\x1B[39m'],
    'BLUE'          : ['\x1B[34m', '\x1B[39m'],
    'CYAN'          : ['\x1B[36m', '\x1B[39m'],
    'GREEN'         : ['\x1B[32m', '\x1B[39m'],
    'MAGENTA'       : ['\x1B[35m', '\x1B[39m'],
    'RED'           : ['\x1B[31m', '\x1B[39m'],
    'YELLOW'        : ['\x1B[33m', '\x1B[39m'],
    'WHITEBG'       : ['\x1B[47m', '\x1B[49m'],
    'GREYBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
    'BLACKBG'       : ['\x1B[40m', '\x1B[49m'],
    'BLUEBG'        : ['\x1B[44m', '\x1B[49m'],
    'CYANBG'        : ['\x1B[46m', '\x1B[49m'],
    'GREENBG'       : ['\x1B[42m', '\x1B[49m'],
    'MAGENTABG'     : ['\x1B[45m', '\x1B[49m'],
    'REDBG'         : ['\x1B[41m', '\x1B[49m'],
    'YELLOWBG'      : ['\x1B[43m', '\x1B[49m']
}

for (const key in colors) {
    colors[key] = colors[key].join('%s');
}

export default colors;