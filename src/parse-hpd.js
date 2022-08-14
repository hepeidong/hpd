const fs = require('fs');
const path = require('path');

const reg_type_name_sentence_pattern = /type\s*(\w+)/g;
const reg_type_name = /[^type]\s*(.*)/;
const reg_receive_word = /[^\s]*/g;


const keyword = {
    include: 'include',
    type: 'type',
    int: 'int',
    float: 'float',
    string: 'string',
    boolean: 'boolean'
}

function readHpdFile(filePath) {
    const fileStr = fs.readFileSync(filePath).toString();
    parseTypeName(fileStr);
    parseFileStr(fileStr);
}

function isKeyword(word) {
    for (const key in keyword) {
        if (keyword[key] === word) {
            return true;
        }
    }
    return false;
}

/**
 * 存在关键字
 * @param {String[]} words 
 */
function hasKeyword(words) {
    let index = 0;
    for (let i = 0, len = words.length; i < len; ++i) {
        const word = words[i];
        if (word.length > 0) {
            index++;
            if (index == 1) {
                return isKeyword(word);
            }
            else return false;
        }
    }
    return false;
}

/**
 * 存在有效单词，即存在非空字符
 * @param {String[]} words 
 */
function hasWord(words) {
    for (let i = 0, len = words.length; i < len; ++i) {
        const word = words[i];
        if (word.length > 0) {
            return word;
        }
    }
    return '';
}

/**
 * 组装句式
 * @param {String[]} words 
 */
function assemblingSentences(words) {
    let sentences = '';
    for (let i = 0, len = words.length; i < len; ++i) {
        const word = words[i];
        if (word.length > 0) {
            sentences += word + '\t';
        }
    }
    return sentences;
}

/**
 * 解析文件字符数据
 * @param {String} fileStr 
 */
function parseFileStr(fileStr) {
    let str = '';
    let hasKW = false;//存在关键字
    let leftCurlyBracketCount = 0;
    let rightCurlyBracketCount  = 0;
    for (let i = 0, len = fileStr.length; i < len; ++i) {
        str += fileStr[i];
        const char = str.charAt(str.length - 1);
        if (char === '{') {
            leftCurlyBracketCount++;
        }
        else if (char === '}') {
            rightCurlyBracketCount++;
        }
        else if (char === '\n' && hasKW) {
            //一句完整的句式
            //开始分析语义
            const sentences = assemblingSentences(str.match(reg_receive_word));
            console.log(sentences);
            //重置
            hasKW = false;
            str = '';
        }
        else if (!hasKW) {
            const words = str.match(reg_receive_word);
            if (hasKeyword(words)) {
                if (char === '\n') {
                    //开始分析语义
                    const sentences = assemblingSentences(words);
                    console.log(sentences);
                    //重置
                    hasKW = false;
                    str = '';
                }
                else {
                    hasKW = true;
                }
            }
            else if (char === '\n' && !hasKW) {
                const word = hasWord(words);
                if (word.length > 0) {
                    //这是一个结构体组后面的}花括号，表示这个结构体的结束标记
                    if (word === '}') {
                        if (leftCurlyBracketCount > rightCurlyBracketCount) {
                            const err = `缺少}`;
                            throw new Error(err);
                        }
                        else if (leftCurlyBracketCount < rightCurlyBracketCount) {
                            const err = `缺少{`;
                            throw new Error(err);
                        }
                        else {
                            leftCurlyBracketCount = 0;
                            rightCurlyBracketCount = 0;
                            //重置
                            hasKW = false;
                            str = '';
                        }
                    }
                    else {
                        const err = `${word}单词前面缺少关键字`;
                        throw new Error(err);
                    }
                }
            }
        }
    }
}

/**
 * 
 * @param {String} fileStr 
 */
function parseTypeName(fileStr) {
    const allType = fileStr.match(reg_type_name_sentence_pattern);
    const result = [];
    for (let i = 0, len = allType.length; i < len; ++i) {
        const str = allType[i];
        const typeName = str.match(reg_type_name)[1];
        result.push(typeName);
    }
    
    return result;
}

function parse() {
    readHpdFile(path.join(process.cwd(), 'test.hpd'));
}

module.exports.parse = parse;