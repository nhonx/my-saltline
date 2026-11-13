export type QualityTier = 'test' | 'low' | 'medium' | 'high' | 'ultra';

export interface QualityPreset {
  name: QualityTier;
  scale: number;
  msaa: number;
  shadow: number;
  tex: number;
  volSteps: number;
  ao: boolean;
  planar: number;
  bloom: boolean;
  motionBlur: boolean;
  rain: number;
}

export const QUALITY_PRESETS: Record<QualityTier, QualityPreset> = {
  test: {
    name: 'test',
    scale: 1,
    msaa: 0,
    shadow: 1024,
    tex: 256,
    volSteps: 10,
    ao: true,
    planar: 0.5,
    bloom: true,
    motionBlur: false,
    rain: 0.4,
  },
  low: {
    name: 'low',
    scale: 0.7,
    msaa: 0,
    shadow: 2048,
    tex: 512,
    volSteps: 12,
    ao: false,
    planar: 0,
    bloom: true,
    motionBlur: false,
    rain: 0.5,
  },
  medium: {
    name: 'medium',
    scale: 0.85,
    msaa: 2,
    shadow: 2048,
    tex: 1024,
    volSteps: 16,
    ao: true,
    planar: 0.5,
    bloom: true,
    motionBlur: false,
    rain: 0.8,
  },
  high: {
    name: 'high',
    scale: 1,
    msaa: 4,
    shadow: 4096,
    tex: 1024,
    volSteps: 24,
    ao: true,
    planar: 0.5,
    bloom: true,
    motionBlur: true,
    rain: 1,
  },
  ultra: {
    name: 'ultra',
    scale: 1,
    msaa: 4,
    shadow: 4096,
    tex: 2048,
    volSteps: 40,
    ao: true,
    planar: 1,
    bloom: true,
    motionBlur: true,
    rain: 1,
  },
};

/** Detect an appropriate quality preset from URL override, device type, or WebGL renderer string. */
export function detectQuality(override?: string): QualityPreset {
  if (override && override in QUALITY_PRESETS) {
    return { ...QUALITY_PRESETS[override as QualityTier] };
  }
  if (
    /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 900)
  ) {
    return { ...QUALITY_PRESETS.low };
  }
  let rendererStr = '';
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      rendererStr = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      const lose = gl.getExtension('WEBGL_lose_context');
      lose && lose.loseContext();
    }
  } catch {
    // ignore WebGL probe failures
  }
  const isWeakGpu =
    /SwiftShader|llvmpipe|Software|Mali|Adreno|PowerVR/i.test(rendererStr) ||
    (/Intel/i.test(rendererStr) && !/Arc/i.test(rendererStr));
  return { ...(isWeakGpu ? QUALITY_PRESETS.medium : QUALITY_PRESETS.high) };
}

