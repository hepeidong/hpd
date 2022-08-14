const fs = require('fs');

//字符串转ArrayBuffer
function stringToArrayBuffer(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if (c >= 0x010000 && c <= 0x10FFFF) {
            bytes.push(((c >> 18) & 0x07) | 0xF0);
            bytes.push(((c >> 12) & 0x3F) | 0x80);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000800 && c <= 0x00FFFF) {
            bytes.push(((c >> 12) & 0x0F) | 0xE0);
            bytes.push(((c >> 6) & 0x3F) | 0x80);
            bytes.push((c & 0x3F) | 0x80);
        } else if (c >= 0x000080 && c <= 0x0007FF) {
            bytes.push(((c >> 6) & 0x1F) | 0xC0);
            bytes.push((c & 0x3F) | 0x80);
        } else {
            bytes.push(c & 0xFF);
        }
    }
    
    const array = new Int8Array(bytes.length);
    for (var i = 0; i <= bytes.length; i++) {
        array[i] = bytes[i];
    }
    
    return array.buffer;
}
//ArrayBuffer转字符串
function arrayBufferToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

function writeSync(filePath, buff) {
    let buffer = new ArrayBuffer(buff.byteLength);
    let dataView = new DataView(buffer);
    fs.writeFileSync(filePath, dataView, 'utf-8');
}

module.exports.stringToArrayBuffer = stringToArrayBuffer;
module.exports.arrayBufferToString = arrayBufferToString;
module.exports.writeSync = writeSync;