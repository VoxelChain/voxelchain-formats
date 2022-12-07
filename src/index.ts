export * from "./const";
export * from "./utils";

export * from "./vx";
export * from "./vxma";
export * from "./vxmm";
export * from "./vxmo";
export * from "./vxwo";
export * from "./xraw";
export * from "./vox";
export * from "./mca";

/**
 * Interface representing a post processing state
 */
export interface IPostProcessingState {
  /**
   * Cinematic margins factor
   */
  margins?: number;
  /**
   * Exposure factor
   */
  exposure?: number;
  /**
   * Film grain factor
   */
  filmGrain?: number;
  /**
   * Vignette factor
   */
  vignette?: number;
  /**
   * Day time factor
   */
  dayTime?: number;
  /**
   * Saturation factor
   */
  saturation?: number;
  /**
   * Chromatic aberration factor
   */
  chromaticAberration?: number;
  /**
   * Sun intensity factor
   */
  sunIntensity?: number;
  /**
   * Sun color values
   */
  sunColor?: number[];
  /**
   * Fog intensity factor
   */
  fogIntensity?: number;
  /**
   * Sky intensity factor
   */
  skyIntensity?: number;
  /**
   * Sky color values
   */
  skyColor?: number[];
  /**
   * Bloom intensity factor
   */
  bloomIntensity?: number;
  /**
   * Volumetric light state
   */
  volumetricLight?: boolean;
  /**
   * FXAA state
   */
  FXAA?: boolean;
  /**
   * Particles state
   */
  particles?: boolean;
  /**
   * Aperture
   */
  aperture?: number;
  /**
   * Backface grid intensity
   */
  backfaceGridIntensity?: number;
  /**
   * Camera auto focus speed
   */
  autoFocusSpeed?: number;
  /**
   * Sharpen intensity
   */
  sharpenIntensity?: number;
}

/**
 * The default options used when constructing a post processing state
 */
export const DEFAULT_OPTIONS_POST_PROCESSING_STATE: Required<IPostProcessingState> = Object.freeze({
  margins: 0,
  exposure: 48,
  filmGrain: 10,
  vignette: 10,
  saturation: 100,
  chromaticAberration: 3,
  sunColor: [185, 185, 200],
  sunIntensity: 40,
  skyColor: [80, 160, 255],
  skyIntensity: 10,
  dayTime: 60,
  fogIntensity: 14,
  bloomIntensity: 0,
  volumetricLight: false,
  FXAA: true,
  particles: false,
  aperture: 0,
  backfaceGridIntensity: 0.25,
  autoFocusSpeed: 50,
  sharpenIntensity: 10,
});
