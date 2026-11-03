const normalizeTrustedOrigins = (origins: string[]): string[] => {
  return origins.map(origin => {
    const url = new URL(origin);

    const isHttpProtocol =
      url.protocol === 'http:' || url.protocol === 'https:';

    const isValidOrigin =
      isHttpProtocol &&
      url.origin !== 'null' &&
      url.origin === origin;

    if (!isValidOrigin) {
      throw new Error(
        `Invalid trusted API origin: "${origin}". ` +
        'Expected a valid HTTP or HTTPS origin without path, query or fragment.',
      );
    }

    return url.origin;
  });
};

export const API_CONFIG = {
  trustedOrigins: normalizeTrustedOrigins([]),
};