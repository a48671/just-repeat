import type { AudioPathResolver, IntegrationErrorCode } from '../../domain/contracts';

type IntegrationException = Error & {
  code: IntegrationErrorCode;
  context?: {
    setId?: string;
    phraseId?: string;
    sourcePath?: string;
  };
};

function createIntegrationException(
  code: IntegrationErrorCode,
  message: string,
  context?: IntegrationException['context'],
): IntegrationException {
  return Object.assign(new Error(message), { code, context });
}

export class StaticAudioPathResolver implements AudioPathResolver {
  constructor(private readonly audioModuleMap: Record<string, string>) {}

  resolveAudioSrc(inputAudioPath: string): string | null {
    const normalizedPath = this.normalizeInputPath(inputAudioPath);
    const moduleKey = `../../../${normalizedPath}`;
    const resolvedAssetUrl = this.audioModuleMap[moduleKey];

    if (!resolvedAssetUrl) {
      return null;
    }

    return resolvedAssetUrl;
  }

  private normalizeInputPath(inputAudioPath: string): string {
    if (inputAudioPath.startsWith('audios/')) {
      return `audio/${inputAudioPath.slice('audios/'.length)}`;
    }

    if (inputAudioPath.startsWith('audio/')) {
      return inputAudioPath;
    }

    throw createIntegrationException('INVALID_PHRASE_SCHEMA', `Unsupported audio path prefix: ${inputAudioPath}`, {
      sourcePath: inputAudioPath,
    });
  }
}
