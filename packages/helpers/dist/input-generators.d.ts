import { DKIMVerificationResult } from './dkim';
type CircuitInput = {
    emailHeader: string[];
    emailHeaderLength: string;
    pubkey: string[];
    signature: string[];
    emailBody?: string[];
    emailBodyLength?: string;
    precomputedSHA?: string[];
    bodyHashIndex?: string;
};
type InputGenerationArgs = {
    ignoreBodyHashCheck?: boolean;
    shaPrecomputeSelector?: string;
    maxHeadersLength?: number;
    maxBodyLength?: number;
};
/**
 *
 * @description Generate circuit inputs for the EmailVerifier circuit from raw email content
 * @param rawEmail Full email content as a buffer or string
 * @param params Arguments to control the input generation
 * @returns Circuit inputs for the EmailVerifier circuit
 */
export declare function generateEmailVerifierInputs(rawEmail: Buffer | string, params?: InputGenerationArgs): Promise<CircuitInput>;
/**
 *
 * @description Generate circuit inputs for the EmailVerifier circuit from DKIMVerification result
 * @param dkimResult DKIMVerificationResult containing email data and verification result
 * @param params Arguments to control the input generation
 * @returns Circuit inputs for the EmailVerifier circuit
 */
export declare function generateEmailVerifierInputsFromDKIMResult(dkimResult: DKIMVerificationResult, params?: InputGenerationArgs): CircuitInput;
export {};
