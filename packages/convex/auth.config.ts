/**
 * Authentication Configuration
 *
 * Configures Convex to accept JWT tokens from Supergent marketplace.
 * Supergent acts as the identity provider for all marketplace apps.
 *
 * JWT Structure:
 * - Issuer (iss): https://basic-ladybug-921.convex.site
 * - Audience (aud): tenant:task-manager-814502
 * - Subject (sub): Per-app opaque user ID (e.g., "app_tenant_a_7f3e9c2b")
 *
 * Security:
 * - JWTs are signed by Supergent using RS256 (RSA asymmetric signing)
 * - Public key fetched from https://basic-ladybug-921.convex.site/.well-known/jwks.json
 * - Per-app user IDs prevent cross-app user correlation
 * - 15-minute token expiry with automatic refresh
 *
 * Note: Using customJwt type to avoid OpenID discovery conflicts with Better Auth.
 * Values are hardcoded at generation time because Convex does static analysis of
 * auth.config.ts and requires any process.env references to exist in the Convex
 * deployment's environment variables (not shell environment).
 */

export default {
  providers: [
    {
      // Use customJwt type to specify JWKS URL directly (bypasses OpenID discovery)
      type: "customJwt",

      // JWT issuer (must match JWT "iss" claim exactly)
      issuer: "https://basic-ladybug-921.convex.site",

      // Tenant-scoped audience (must match JWT "aud" claim exactly)
      applicationID: "tenant:task-manager-814502",

      // JWKS URL for public key fetch
      jwks: "https://basic-ladybug-921.convex.site/.well-known/jwks.json",

      // Signing algorithm
      algorithm: "RS256",
    },
  ],
};
