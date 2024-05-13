"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Pad = exports.partialSha = exports.shaHash = exports.generatePartialSHA = exports.padUint8ArrayWithZeros = exports.findIndexInUint8Array = void 0;
const CryptoJS = __importStar(require("crypto"));
const binary_format_1 = require("./binary-format");
const fast_sha256_1 = require("./lib/fast-sha256");
function findIndexInUint8Array(array, selector) {
    let i = 0;
    let j = 0;
    while (i < array.length) {
        if (array[i] === selector[j]) {
            j++;
            if (j === selector.length) {
                return i - j + 1;
            }
        }
        else {
            j = 0;
        }
        i++;
    }
    return -1;
}
exports.findIndexInUint8Array = findIndexInUint8Array;
function padUint8ArrayWithZeros(array, length) {
    while (array.length < length) {
        // eslint-disable-next-line no-param-reassign
        array = (0, binary_format_1.mergeUInt8Arrays)(array, (0, binary_format_1.int8toBytes)(0));
    }
    return array;
}
exports.padUint8ArrayWithZeros = padUint8ArrayWithZeros;
function generatePartialSHA({ body, bodyLength, selectorString, // String to split the body
maxRemainingBodyLength, // Maximum allowed length of the body after the selector
 }) {
    let selectorIndex = 0;
    // TODO: See if this (no preselector) could be handled at the circuit level
    if (selectorString) {
        const selector = new TextEncoder().encode(selectorString);
        selectorIndex = findIndexInUint8Array(body, selector);
        if (selectorIndex === -1) {
            throw new Error('Provider SHA precompute selector not found in the body');
        }
    }
    const shaCutoffIndex = Math.floor(selectorIndex / 64) * 64;
    const precomputeText = body.slice(0, shaCutoffIndex);
    let bodyRemaining = body.slice(shaCutoffIndex);
    const bodyRemainingLength = bodyLength - precomputeText.length;
    if (bodyRemainingLength > maxRemainingBodyLength) {
        throw new Error(`Remaining body ${bodyRemainingLength} after the selector is longer than max (${maxRemainingBodyLength})`);
    }
    if (bodyRemaining.length % 64 !== 0) {
        throw new Error('Remaining body was not padded correctly with int64s');
    }
    bodyRemaining = padUint8ArrayWithZeros(bodyRemaining, maxRemainingBodyLength);
    const precomputedSha = partialSha(precomputeText, shaCutoffIndex);
    return {
        precomputedSha,
        bodyRemaining,
        bodyRemainingLength,
    };
}
exports.generatePartialSHA = generatePartialSHA;
function shaHash(str) {
    return CryptoJS.createHash('sha256').update(str).digest();
}
exports.shaHash = shaHash;
function partialSha(msg, msgLen) {
    const shaGadget = new fast_sha256_1.Hash();
    return shaGadget.update(msg, msgLen).cacheState();
}
exports.partialSha = partialSha;
// Puts an end selector, a bunch of 0s, then the length, then fill the rest with 0s.
function sha256Pad(message, maxShaBytes) {
    const msgLen = message.length * 8; // bytes to bits
    const msgLenBytes = (0, binary_format_1.int64toBytes)(msgLen);
    let res = (0, binary_format_1.mergeUInt8Arrays)(message, (0, binary_format_1.int8toBytes)(2 ** 7)); // Add the 1 on the end, length 505
    // while ((prehash_prepad_m.length * 8 + length_in_bytes.length * 8) % 512 !== 0) {
    while ((res.length * 8 + msgLenBytes.length * 8) % 512 !== 0) {
        res = (0, binary_format_1.mergeUInt8Arrays)(res, (0, binary_format_1.int8toBytes)(0));
    }
    res = (0, binary_format_1.mergeUInt8Arrays)(res, msgLenBytes);
    (0, binary_format_1.assert)((res.length * 8) % 512 === 0, 'Padding did not complete properly!');
    const messageLen = res.length;
    while (res.length < maxShaBytes) {
        res = (0, binary_format_1.mergeUInt8Arrays)(res, (0, binary_format_1.int64toBytes)(0));
    }
    (0, binary_format_1.assert)(res.length === maxShaBytes, `Padding to max length did not complete properly! Your padded message is ${res.length} long but max is ${maxShaBytes}!`);
    return [res, messageLen];
}
exports.sha256Pad = sha256Pad;
