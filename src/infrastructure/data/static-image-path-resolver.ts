type IntegrationException = Error & {
  code: 'INVALID_PHRASE_SCHEMA';
  context?: {
    setId?: string;
    phraseId?: string;
    sourcePath?: string;
  };
};

function createIntegrationException(
  code: 'INVALID_PHRASE_SCHEMA',
  message: string,
  context?: IntegrationException['context'],
): IntegrationException {
  return Object.assign(new Error(message), { code, context });
}

export class StaticImagePathResolver {
  constructor(private readonly imageModuleMap: Record<string, string>) {}

  resolveImageSrc(inputImagePath: string | undefined): string | null {
    if (!inputImagePath) {
      return null;
    }

    const normalizedPath = this.normalizeInputPath(inputImagePath);
    const moduleKey = `../../../${normalizedPath}`;
    const resolvedAssetUrl = this.imageModuleMap[moduleKey];

    if (!resolvedAssetUrl) {
      return null;
    }

    return resolvedAssetUrl;
  }

  private normalizeInputPath(inputImagePath: string): string {
    if (inputImagePath.startsWith('images/')) {
      return inputImagePath;
    }

    throw createIntegrationException('INVALID_PHRASE_SCHEMA', `Unsupported image path prefix: ${inputImagePath}`, {
      sourcePath: inputImagePath,
    });
  }
}