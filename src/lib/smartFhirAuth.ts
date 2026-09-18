/**
 * SMART-on-FHIR App Launch (v2) & OAuth2 PKCE Engine
 * Implements HL7 SMART App Launch specification for hospital EHR interoperability (Epic, Cerner, SmartHealthIT)
 */

export interface SmartTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  patient: string;
  id_token?: string;
  fhirUser?: string;
  serverUrl: string;
  connectedAt: string;
}

export interface SmartLaunchConfig {
  clientId: string;
  issuerUrl: string;
  redirectUri: string;
  scope?: string;
  launchToken?: string;
}

const SMART_SESSION_KEY = 'medicare_smart_fhir_session';
const DEFAULT_FHIR_SERVER = 'https://launch.smarthealthit.org/v/r4/fhir';
const DEFAULT_CLIENT_ID = 'mediexplain-smart-client-app';
const DEFAULT_SCOPES = 'launch/patient patient/Patient.read patient/Observation.read patient/MedicationRequest.read openid fhirUser';

/**
 * Generates a high-entropy PKCE code verifier string.
 */
function generateCodeVerifier(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let verifier = '';
  const randomValues = new Uint8Array(64);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < randomValues.length; i++) {
      verifier += chars[randomValues[i] % chars.length];
    }
  } else {
    for (let i = 0; i < 64; i++) {
      verifier += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  return verifier;
}

/**
 * Computes SHA-256 code challenge for PKCE.
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    // Synchronous fallback hash for non-browser / test environments
    let hash = 0;
    for (let i = 0; i < verifier.length; i++) {
      hash = (hash << 5) - hash + verifier.charCodeAt(i);
      hash |= 0;
    }
    return 'sim-challenge-' + Math.abs(hash);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(digest);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generates an OAuth2 SMART-on-FHIR authorization launch URL.
 */
export async function generateSmartLaunchUrl(
  config?: Partial<SmartLaunchConfig>
): Promise<{ authUrl: string; codeVerifier: string; state: string }> {
  const issuerUrl = config?.issuerUrl || DEFAULT_FHIR_SERVER;
  const clientId = config?.clientId || DEFAULT_CLIENT_ID;
  const redirectUri =
    config?.redirectUri ||
    (typeof window !== 'undefined' ? `${window.location.origin}/settings` : 'http://localhost:3000/settings');
  const scope = config?.scope || DEFAULT_SCOPES;
  const launchToken = config?.launchToken;

  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = 'smart-state-' + Math.random().toString(36).substring(2, 10);

  const authEndpoint = `${issuerUrl.replace(/\/fhir$/, '')}/authorize`;

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
    aud: issuerUrl,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  if (launchToken) {
    params.set('launch', launchToken);
  }

  return {
    authUrl: `${authEndpoint}?${params.toString()}`,
    codeVerifier,
    state,
  };
}

/**
 * Simulates exchanging an authorization code for an active FHIR Access Token and Patient context.
 */
export async function exchangeSmartAuthCode(
  code: string,
  serverUrl = DEFAULT_FHIR_SERVER
): Promise<SmartTokenResponse> {
  const simulatedToken: SmartTokenResponse = {
    access_token: 'smart-fhir-token-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
    token_type: 'Bearer',
    expires_in: 3600,
    scope: DEFAULT_SCOPES,
    patient: 'smart-pat-' + (code ? code.substring(0, 6) : '89201'),
    fhirUser: 'https://smarthealthit.org/practitioner/pract-991',
    serverUrl,
    connectedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SMART_SESSION_KEY, JSON.stringify(simulatedToken));
  }

  return simulatedToken;
}

/**
 * Returns the currently active SMART-on-FHIR session, if connected.
 */
export function getStoredSmartSession(): SmartTokenResponse | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SMART_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Checks if a SMART-on-FHIR EMR link is currently active.
 */
export function isSmartConnected(): boolean {
  return getStoredSmartSession() !== null;
}

/**
 * Clears the active SMART-on-FHIR session.
 */
export function clearSmartSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SMART_SESSION_KEY);
  } catch {}
}
