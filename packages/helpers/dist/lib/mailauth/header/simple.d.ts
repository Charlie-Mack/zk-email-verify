import type { Options, SignatureType, SigningHeaderLines } from '../dkim-verifier';
export declare const simpleHeaders: (type: SignatureType, signingHeaderLines: SigningHeaderLines, options: Options) => {
    canonicalizedHeader: Buffer;
    signatureHeaderLine: string;
    dkimHeaderOpts: boolean | Record<string, any>;
};
