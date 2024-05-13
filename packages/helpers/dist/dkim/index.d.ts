export interface DKIMVerificationResult {
    publicKey: bigint;
    signature: bigint;
    headers: Buffer;
    body: Buffer;
    bodyHash: string;
    signingDomain: string;
    selector: string;
    algo: string;
    format: string;
    modulusLength: number;
    appliedSanitization?: string;
}
/**
 *
 * @param email Entire email data as a string or buffer
 * @param domain Domain to verify DKIM signature for. If not provided, the domain is extracted from the `From` header
 * @param enableSanitization If true, email will be applied with various sanitization to try and pass DKIM verification
 * @returns
 */
export declare function verifyDKIMSignature(email: Buffer | string, domain?: string, enableSanitization?: boolean): Promise<DKIMVerificationResult>;
