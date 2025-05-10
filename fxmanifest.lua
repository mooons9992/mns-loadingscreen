fx_version 'cerulean'
game 'gta5'
author 'Mooons'
description 'MNS Loading Screen'
version '1.0.0'
lua54 'yes'

files {
    'html/index.html',
    'html/style.css',
    'html/mouse.js',
    'html/script.js',
    'html/assets/**/*.mp4',
    'html/assets/**/*.mp3'
}

loadscreen 'html/index.html'
loadscreen_cursor 'yes'
loadscreen_manual_shutdown 'yes'

client_script 'client.lua'

escrow_ignore {
    'client.lua'
}
