import { getSigningHeaderLines, parseDkimHeaders, parseHeaders } from "./tools";
import { MessageParser } from "./message-parser";
export type SignatureType = "DKIM" | "ARC" | "AS";
export type ParsedHeaders = ReturnType<typeof parseHeaders>;
export type Parsed = ParsedHeaders["parsed"][0];
export type ParseDkimHeaders = ReturnType<typeof parseDkimHeaders>;
export type SigningHeaderLines = ReturnType<typeof getSigningHeaderLines>;
export interface Options {
    signatureHeaderLine: string;
    signingDomain?: string;
    selector?: string;
    algorithm?: string;
    canonicalization: string;
    bodyHash?: string;
    signTime?: string | number | Date;
    signature?: string;
    instance: string | boolean;
    bodyHashedBytes?: string;
}
export declare class DkimVerifier extends MessageParser {
    envelopeFrom: string | boolean;
    headerFrom: string[];
    results: {
        [key: string]: any;
    }[];
    private options;
    private resolver;
    private minBitLength;
    private signatureHeaders;
    private bodyHashes;
    private arc;
    private seal;
    private sealBodyHashKey;
    constructor(options: Record<string, any>);
    messageHeaders(headers: ParsedHeaders): Promise<void>;
    nextChunk(chunk: Buffer): Promise<void>;
    finalChunk(): Promise<void>;
}
