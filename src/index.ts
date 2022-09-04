/* javascript-obfuscator:disable */
// @ts-ignore
import {gzip, ungzip} from "pako";
/* javascript-obfuscator:enable */

/**
 * The magic bytes of a vx file
 */
export const VX_MAGIC = `VX`;
/**
 * The magic bytes of a vxwo file
 */
export const VXWO_MAGIC = `${VX_MAGIC}WO`;
/**
 * The magic bytes of a vxmo file
 */
export const VXMO_MAGIC = `${VX_MAGIC}MO`;
/**
 * The magic bytes of a vxma file
 */
export const VXMA_MAGIC = `${VX_MAGIC}MA`;
/**
 * The magic bytes of a vxmm file
 */
export const VXMM_MAGIC = `${VX_MAGIC}MM`;
/**
 * The magic bytes of a xraw file
 */
export const XRAW_MAGIC = "XRAW";

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
}

/**
 * The default options used when constructing a post processing state
 */
export const DEFAULT_OPTIONS_POST_PROCESSING_STATE: Required<IPostProcessingState> = Object.freeze({
  margins: 0,
  exposure: 24,
  filmGrain: 10,
  vignette: 10,
  chromaticAberration: 3,
  sunColor: [185, 185, 200],
  sunIntensity: 40,
  skyColor: [80, 160, 255],
  fogIntensity: 14,
  bloomIntensity: 0,
  volumetricLight: false,
  FXAA: true,
  particles: false,
  aperture: 0,
  backfaceGridIntensity: 0.25,
  autoFocusSpeed: 50,
});

/**
 * Represents a voxelchain file compilation result
 */
export interface IVXFileCompilationResult {
  /**
   * The compiled vx file data
   */
  data: Uint8Array;
  /**
   * The byte length of the vx file
   */
  byteLength: number;
}

/**
 * Represents a voxelchain file decompilation result
 */
export interface IVXFileDecompilationResult {
  /**
   * The decompiled vx file
   */
  file: IVXFile;
  /**
   * The byte length of the vx file
   */
  byteLength: number;
}

/**
 * Represents a voxelchain file
 */
export interface IVXFile {
  /**
   * The version of the file
   */
  version: number[];
  /**
   * An optional name of the file
   */
  name?: string;
  /**
   * An optional preview of the file
   */
  preview?: Uint8Array;
}

/**
 * Represents a voxelchain world
 */
export interface IVXWO {
  /**
   * The resolution of the main-grid
   */
  resolution: number[];
  /**
   * The resolution of the sub-grid
   */
  subResolution: number;
  /**
   * The size of the sub-voxel atlas
   */
  subAtlasSize: number;
  /**
   * The simulation block size of the main-grid
   */
  blockSize: number;
  /**
   * The simulation tick rate per second
   */
  tickRate: number;
  /**
   * The current simulation tick
   */
  tick: number;
  /**
   * The IO pin state
   */
  ioPinState: boolean;
  /**
   * Camera rotation
   */
  cameraRotation: Float32Array;
  /**
   * Camera translation
   */
  cameraTranslation: Float32Array;
  /**
   * The module of the world
   */
  module: IVXMO;
  /**
   * The materials of the world
   */
  materials: IVXMA[];
  /**
   * The raw simulation cell data
   */
  cellData: Uint32Array[];
  /**
   * The raw simulation flow data
   */
  flowData: Uint32Array[];
  /**
   * The post processing state of the world
   */
  postProcessingState: IPostProcessingState;
  /**
   * The material id array in the hand
   */
  handMaterialIds: Uint8Array;
  /**
   * The current index into the hand material id array
   */
  handMaterialIndex: number;
  /**
   * The previous hand material index
   */
  previousHandMaterialIndex: number;
}

/**
 * The default options used when constructing a vxc world
 */
export const DEFAULT_OPTIONS_IVXWO: Required<IVXWO> = Object.freeze({
  resolution: [0, 0, 0],
  subResolution: 0,
  subAtlasSize: 8,
  blockSize: 0,
  tickRate: 0,
  tick: 0,
  ioPinState: false,
  cameraRotation: null,
  cameraTranslation: null,
  module: null,
  materials: null,
  cellData: null,
  flowData: null,
  postProcessingState: null,
  handMaterialIds: null,
  handMaterialIndex: 0,
  previousHandMaterialIndex: 0,
});

/**
 * Represents a voxelchain world file
 */
export interface IVXWOFile extends IVXFile {
  /**
   * The world
   */
  world: IVXWO;
}

/**
 * The default options used when constructing a vxwo file
 */
export const DEFAULT_OPTIONS_IVXWO_FILE: Required<IVXWOFile> = Object.freeze({
  version: [0, 0, 0, 0],
  name: null,
  preview: null,
  world: null,
});

/**
 * Represents a voxelchain module
 */
export interface IVXMO {
  /**
   * The input pin data of the module
   */
  input: Uint32Array;
  /**
   * The input state remapping data of the module
   */
  inputRemap: Uint8Array;
  /**
   * The output pin data of the module
   */
  output: Uint32Array;
  /**
   * The output state remapping data of the module
   */
  outputRemap: Uint8Array;
  /**
   * The binary decision diagram of the module
   */
  bdd: Uint32Array[];
}

/**
 * The default options used when constructing a vxc module
 */
export const DEFAULT_OPTIONS_IVXMO: Required<IVXMO> = Object.freeze({
  input: null,
  inputRemap: null,
  output: null,
  outputRemap: null,
  code: null,
  bdd: null,
});

/**
 * Represents a voxelchain module file
 */
export interface IVXMOFile extends IVXFile {
  /**
   * The module
   */
  module: IVXMO;
}

/**
 * The default options used when constructing a vxmo file
 */
export const DEFAULT_OPTIONS_IVXMO_FILE: Required<IVXMOFile> = Object.freeze({
  version: [0, 0, 0, 0],
  name: null,
  preview: null,
  module: null,
});

/**
 * Represents a voxelchain material model
 */
export interface IVXMM {
  /**
   * The resolution of the model
   */
  resolution: number;
  /**
   * The data of the model
   */
  data: Uint8Array;
  /**
   * The icon of the model
   */
  icon: Uint8Array;
}

/**
 * The default options used when constructing a vxc model
 */
export const DEFAULT_OPTIONS_IVXMM: Required<IVXMM> = Object.freeze({
  data: null,
  icon: null,
  resolution: 0,
});

/**
 * Represents a voxelchain model file
 */
export interface IVXMMFile extends IVXFile {
  /**
   * The model
   */
  model: IVXMM;
}

/**
 * The default options used when constructing a vxmm file
 */
export const DEFAULT_OPTIONS_IVXMM_FILE: Required<IVXMMFile> = Object.freeze({
  version: [0, 0, 0, 0],
  name: null,
  preview: null,
  model: null,
});

/**
 * Represents a voxelchain material
 */
export interface IVXMA {
  /**
   * The id (0-255) of the material
   */
  id: number;
  /**
   * The (0-15) density of the material
   */
  density: number;
  /**
   * The conductivity (0-15) of the material
   */
  conductivity: number;
  /**
   * The 53-bit id of the referenced world
   */
  worldId: number;
  /**
   * The 256-bit hash of the referenced world
   */
  worldHash: Uint8Array;
  /**
   * A static module copy of the referenced world
   */
  worldModule: IVXMO;
  /**
   * The models of the material
   */
  models: IVXMM[];
}

/**
 * The default options used when constructing a vxc material
 */
export const DEFAULT_OPTIONS_IVXMA: Required<IVXMA> = Object.freeze({
  id: 0,
  density: 0,
  conductivity: 0,
  worldId: 0,
  worldHash: null,
  worldModule: null,
  models: null,
});

/**
 * Represents a voxelchain material file
 */
export interface IVXMAFile extends IVXFile {
  /**
   * The material
   */
  material: IVXMA;
}

/**
 * The default options used when constructing a vxma file
 */
export const DEFAULT_OPTIONS_IVXMA_FILE: Required<IVXMAFile> = Object.freeze({
  version: [0, 0, 0, 0],
  name: null,
  preview: null,
  material: null,
});

/**
 * Represents a parsed .xraw file
 */
export interface IXRawFile {
  data: Uint8Array;
  width: number;
  height: number;
  depth: number;
}

/**
 * Align the provided number by the given alignment
 * @param value - The value to align
 * @param alignment - The alignment to apply
 */
export function align(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}

/**
 * Extracts the magic bytes from the provided buffer
 * @param buffer - The buffer to extract the magic from
 */
export function getBufferMagic(buffer: Uint8Array): string {
  const viewU8 = new Uint8Array(buffer.buffer);
  const magic = new TextDecoder("utf-8").decode(viewU8.subarray(0x0, 0x4));
  return magic;
}

/**
 * Compress the provided buffer with gzip
 * @param buffer - The buffer to compress
 */
export function compressGZIP(buffer: Uint8Array): Uint8Array {
  /* javascript-obfuscator:disable */
  return gzip(buffer);
  /* javascript-obfuscator:enable */
}

/**
 * Decompressed the provided gzip compressed buffer
 * @param buffer - The buffer to decompress
 */
export function decompressGZIP(buffer: Uint8Array): Uint8Array {
  return ungzip(buffer);
}

/**
 * Indicates if the provided buffer is a vx file
 * @param buffer - The buffer to check
 */
export function isVXFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer).substring(0, 2) === VX_MAGIC;
}

/**
 * Indicates if the provided buffer is a vxwo file
 * @param buffer - The buffer to check
 */
export function isVXWOFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === VXWO_MAGIC;
}

/**
 * Indicates if the provided buffer is a vxmo file
 * @param buffer - The buffer to check
 */
export function isVXMOFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === VXMO_MAGIC;
}

/**
 * Indicates if the provided buffer is a vxma file
 * @param buffer - The buffer to check
 */
export function isVXMAFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === VXMA_MAGIC;
}

/**
 * Indicates if the provided buffer is a vxmm file
 * @param buffer - The buffer to check
 */
export function isVXMMFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === VXMM_MAGIC;
}

/**
 * Indicates if the provided buffer is a xraw file
 * @param buffer - The buffer to check
 */
export function isXRAWFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === XRAW_MAGIC;
}

/**
 * Parse the provided vx file
 * @param buffer - The vx file buffer
 * @param magic - The file magic to expect
 */
export function parseVXFile(buffer: Uint8Array, magic: string): IVXFileDecompilationResult {
  let byteOffset = 0x0;
  const view = new DataView(buffer.buffer);
  // ## Magic ##
  if (!isVXFile(buffer)) {
    throw new Error(`Invalid magic, expected '${VX_MAGIC}' but got '${getBufferMagic(buffer).substring(0, 2)}'`);
  }
  // ## Magic ##
  if (getBufferMagic(buffer) !== magic) {
    throw new Error(`Invalid magic, expected '${magic}' but got '${getBufferMagic(buffer)}'`);
  }
  // Pad by magic bytes
  byteOffset += 4 * Uint8Array.BYTES_PER_ELEMENT;
  // ## Version ##
  const version = [0, 0, 0, 0];
  version[0] = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  version[1] = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  version[2] = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  version[3] = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  // ## Name ##
  //  Name length
  const nameLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Name data
  const nameList: string[] = [];
  for (let ii = 0; ii < nameLength; ++ii) {
    nameList.push(String.fromCharCode(view.getUint8(byteOffset))); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  }
  const name = nameList.join("");
  // ## Preview ##
  //  Preview length
  const previewLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Preview data
  const preview = new Uint8Array(buffer.buffer, byteOffset, previewLength);
  byteOffset += preview.byteLength * Uint8Array.BYTES_PER_ELEMENT;
  const file: IVXFile = {
    version,
    name: name.length > 0 ? name : null,
    preview: preview.length > 0 ? preview : null,
  };
  const result: IVXFileDecompilationResult = {
    file,
    byteLength: byteOffset,
  };
  return result;
}

/**
 * Compile the provided vx file
 * @param file - The vx file to compile
 * @param magic - The file magic to write
 */
export function compileVXFile(file: IVXFile, magic: string): IVXFileCompilationResult {
  let byteOffset = 0x0;
  let byteLength = 0x0;
  const {name, preview} = file;
  // Find total byte length
  {
    // ## Magic ##
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    // ## Version ##
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    // ## Name ##
    //  Name length
    byteLength += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Name data
    byteLength += (name ? name.length : 0) * Uint8Array.BYTES_PER_ELEMENT;
    // ## Preview ##
    //  Preview length
    byteLength += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Preview data
    byteLength += (preview ? preview.length : 0) * Uint8Array.BYTES_PER_ELEMENT;
  }
  const buffer = new Uint8Array(byteLength);
  const view = new DataView(buffer.buffer);
  // Compile into buffer
  {
    // ## Magic ##
    view.setUint8(byteOffset, magic.charCodeAt(0)); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    view.setUint8(byteOffset, magic.charCodeAt(1)); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    view.setUint8(byteOffset, magic.charCodeAt(2)); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    view.setUint8(byteOffset, magic.charCodeAt(3)); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    // ## Version ##
    view.setUint8(byteOffset, file.version[0] & 0xFF); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    view.setUint8(byteOffset, file.version[1] & 0xFF); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    view.setUint8(byteOffset, file.version[2] & 0xFF); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    view.setUint8(byteOffset, file.version[3] & 0xFF); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    // # Name ##
    //  Name length
    view.setUint32(byteOffset, (name ? name.length : 0), true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Name data
    if (name) {
      for (let ii = 0; ii < name.length; ++ii) {
        view.setUint8(byteOffset, (name.charCodeAt(ii)) & 0x7F); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
      }
    }
    // # Preview ##
    //  Preview length
    view.setUint32(byteOffset, (preview ? preview.length : 0), true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Preview data
    if (preview) {
      // Memcpy preview data
      new Uint8Array(view.buffer).set(preview, byteOffset);
      byteOffset += preview.byteLength;
    }
  }
  const result: IVXFileCompilationResult = {
    data: buffer,
    byteLength: byteOffset
  };
  return result;
}

/**
 * Parse the provided vxwo file
 * @param buffer - The vxwo file buffer
 */
export function parseVXWOFile(buffer: Uint8Array): IVXWOFile {
  let byteOffset = 0x0;
  const view = new DataView(buffer.buffer);
  // ## File header ##
  const header = parseVXFile(buffer, VXWO_MAGIC);
  byteOffset += header.byteLength;
  // ## Header ##
  //  Main-grid resolution
  const resolution = [0, 0, 0];
  resolution[0] = view.getUint16(byteOffset, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
  resolution[1] = view.getUint16(byteOffset, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
  resolution[2] = view.getUint16(byteOffset, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
  //  Sub-grid resolution
  const subResolution = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  Sub-atlas size
  const subAtlasSize = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  Main-grid block size
  const blockSize = view.getUint16(byteOffset, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
  //  Simulation tickRate
  const tickRate = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  Simulation tick
  const tick = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  IO pin state
  const ioPinState = view.getUint8(byteOffset) ? true : false; byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  Camera rotation
  const cameraRotation = new Float32Array(2);
  cameraRotation[0] = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  cameraRotation[1] = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  //  Camera translation
  const cameraTranslation = new Float32Array(3);
  cameraTranslation[0] = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  cameraTranslation[1] = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  cameraTranslation[2] = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing margins
  const ppMargins = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing exposure
  const ppExposure = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing film grain
  const ppFilmGrain = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing vignette
  const ppVignette = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing chromatic aberration
  const ppChromaticAberration = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing sun intensity
  const ppSunIntensity = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing sun color
  const ppSunColor0 = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  const ppSunColor1 = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  const ppSunColor2 = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  const ppSunColor = [ppSunColor0, ppSunColor1, ppSunColor2];
  // Post-processing fog intensity
  const ppFogIntensity = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing sky color
  const ppSkyColor0 = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  const ppSkyColor1 = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  const ppSkyColor2 = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  const ppSkyColor = [ppSkyColor0, ppSkyColor1, ppSkyColor2];
  // Post-processing bloom intensity
  const ppBloomIntensity = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing volumetric light
  const ppVolumetricLight = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  // Post-processing FXAA
  const ppFXAA = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  // Post-processing particles
  const ppParticles = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  // Post-processing aperture
  const ppAperture = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing backface grid intensity
  const ppBackfaceGridIntensity = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing auto focus speed
  const ppAutoFocusSpeed = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Hand material ids
  const handMaterialIds = new Uint8Array(8);
  for (let ii = 0; ii < 8; ++ii) {
    handMaterialIds[ii] = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  }
  // Hand material index
  const handMaterialIndex = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  // Previous hand material index
  const previousHandMaterialIndex = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  Module data offset
  const moduleByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Module data length
  const moduleByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Material data count
  const materialDataCount = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Material data offsets & lengths
  const materialByteLocations: [number, number][] = [];
  //  Material data offsets & lengths
  for (let ii = 0; ii < materialDataCount; ++ii) {
    //  Material data offsets
    const materialByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Material data lengths
    const materialByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    materialByteLocations.push([materialByteOffset, materialByteLength]);
  }
  //  Cell data offset
  const cellByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Cell data length
  const cellByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Flow data offset
  const flowByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Flow data length
  const flowByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  // ## Module data ##
  const moduleData = new Uint8Array(buffer.buffer, moduleByteOffset, moduleByteLength / Uint8Array.BYTES_PER_ELEMENT);
  const module = moduleData.length > 0 ? parseVXMOFile(new Uint8Array(moduleData)).module : null;
  // ## Material data ##
  const materialData: IVXMA[] = [];
  for (let ii = 0; ii < materialDataCount; ++ii) {
    const [byteOffset, byteLength] = materialByteLocations[ii];
    const material = parseVXMAFile(new Uint8Array(
      new Uint8Array(buffer.buffer, byteOffset, byteLength / Uint8Array.BYTES_PER_ELEMENT)
    )); // Create copy of material data to retain byte offset
    materialData.push(material.material);
  }
  // ## Cell data ##
  const cellByteHalfLength = cellByteLength >> 1;
  const cellData0 = new Uint32Array(buffer.buffer, cellByteOffset + (cellByteHalfLength * 0), cellByteHalfLength / Uint32Array.BYTES_PER_ELEMENT);
  const cellData1 = new Uint32Array(buffer.buffer, cellByteOffset + (cellByteHalfLength * 1), cellByteHalfLength / Uint32Array.BYTES_PER_ELEMENT);
  // ## Flow data ##
  const flowByteHalfLength = flowByteLength >> 1;
  const flowData0 = new Uint32Array(buffer.buffer, flowByteOffset + (flowByteHalfLength * 0), flowByteHalfLength / Uint32Array.BYTES_PER_ELEMENT);
  const flowData1 = new Uint32Array(buffer.buffer, flowByteOffset + (flowByteHalfLength * 1), flowByteHalfLength / Uint32Array.BYTES_PER_ELEMENT);
  const pp: IPostProcessingState = {
    margins: ppMargins,
    exposure: ppExposure,
    filmGrain: ppFilmGrain,
    vignette: ppVignette,
    chromaticAberration: ppChromaticAberration,
    sunIntensity: ppSunIntensity,
    sunColor: ppSunColor,
    fogIntensity: ppFogIntensity,
    skyColor: ppSkyColor,
    bloomIntensity: ppBloomIntensity,
    volumetricLight: !!ppVolumetricLight,
    FXAA: !!ppFXAA,
    particles: !!ppParticles,
    aperture: ppAperture,
    backfaceGridIntensity: ppBackfaceGridIntensity,
    autoFocusSpeed: ppAutoFocusSpeed,
  };
  const world: IVXWO = {
    resolution,
    subResolution,
    subAtlasSize,
    blockSize,
    tickRate,
    tick,
    ioPinState,
    cameraRotation,
    cameraTranslation,
    module: module,
    materials: materialData,
    cellData: [cellData0, cellData1],
    flowData: [flowData0, flowData1],
    postProcessingState: pp,
    handMaterialIds,
    handMaterialIndex,
    previousHandMaterialIndex,
  };
  const file: IVXWOFile = {
    version: header.file.version,
    preview: header.file.preview,
    world: world,
  };
  return file;
}

/**
 * Compile the provided vxwo file
 * @param file - The vxwo file to compile
 */
export function compileVXWOFile(file: IVXWOFile): Uint8Array {
  const {world} = file;
  let byteOffset = 0x0;
  let byteLength = 0x0;
  let cellByteOffset = 0x0;
  let flowByteOffset = 0x0;
  let moduleByteOffset = 0x0;
  const header = compileVXFile(file, VXWO_MAGIC);
  const moduleData = world.module ? compileVXMOFile({
    version: file.version,
    module: world.module,
  }) : new Uint8Array(0);
  const materialByteOffsets = [];
  const cellData = world.cellData;
  const flowData = world.flowData;
  const materialData = world.materials.map(material => compileVXMAFile({
    version: file.version,
    material: material,
  }));
  const ppData = Object.assign({}, DEFAULT_OPTIONS_POST_PROCESSING_STATE, world.postProcessingState);
  const {handMaterialIds, handMaterialIndex, previousHandMaterialIndex} = world;
  // Find total byte length
  {
    // ## File header ##
    byteLength += header.byteLength;
    // ## Header ##
    //  Main-grid resolution
    byteLength += Uint16Array.BYTES_PER_ELEMENT;
    byteLength += Uint16Array.BYTES_PER_ELEMENT;
    byteLength += Uint16Array.BYTES_PER_ELEMENT;
    //  Sub-grid resolution
    byteLength += Uint8Array.BYTES_PER_ELEMENT;
    //  Sub-atlas size
    byteLength += Uint8Array.BYTES_PER_ELEMENT;
    //  Main-grid block size
    byteLength += Uint16Array.BYTES_PER_ELEMENT;
    //  Simulation tickRate
    byteLength += Uint8Array.BYTES_PER_ELEMENT;
    //  Simulation tick
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  IO pin state
    byteLength += Uint8Array.BYTES_PER_ELEMENT;
    //  Camera rotation
    byteLength += 2 * Float32Array.BYTES_PER_ELEMENT;
    //  Camera translation
    byteLength += 3 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing margins
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing exposure
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing film grain
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing vignette
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing chromatic aberration
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sun intensity
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sun color
    byteLength += 3 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing fog intensity
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sky color
    byteLength += 3 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing bloom intensity
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing volumetric light
    byteLength += Uint8Array.BYTES_PER_ELEMENT;
    //  Post-processing FXAA
    byteLength += Uint8Array.BYTES_PER_ELEMENT;
    //  Post-processing particles
    byteLength += Uint8Array.BYTES_PER_ELEMENT;
    //  Post-processing aperture
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing backface grid intensity
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing autofocus speed
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Hand material ids
    byteLength += 8 * Uint8Array.BYTES_PER_ELEMENT;
    //  Hand material index
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Previous hand material index
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Module data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Module data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Material data count
    byteLength += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Material data offsets
    byteLength += materialData.length * Uint32Array.BYTES_PER_ELEMENT;
    //  Material data lengths
    byteLength += materialData.length * Uint32Array.BYTES_PER_ELEMENT;
    //  Cell data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Cell data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Flow data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Flow data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    // ## Module data ##
    moduleByteOffset = byteLength;
    byteLength += moduleData.byteLength;
    // ## Material data ##
    for (let ii = 0; ii < materialData.length; ++ii) {
      materialByteOffsets.push(byteLength);
      byteLength += materialData[ii].byteLength;
    }
    byteLength = align(byteLength, Uint32Array.BYTES_PER_ELEMENT);
    // ## Cell data ##
    cellByteOffset = byteLength;
    if (cellData !== null) byteLength += cellData[0].byteLength * 2;
    // ## Flow data ##
    flowByteOffset = byteLength;
    if (flowData !== null) byteLength += flowData[0].byteLength * 2;
  }
  const buffer = new Uint8Array(byteLength);
  const view = new DataView(buffer.buffer);
  // Compile into buffer
  {
    // ## File Header ##
    buffer.set(header.data, byteOffset); byteOffset += header.byteLength;
    // ## Header ##
    //  Main-grid resolution
    view.setUint16(byteOffset, world.resolution[0], true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
    view.setUint16(byteOffset, world.resolution[1], true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
    view.setUint16(byteOffset, world.resolution[2], true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
    //  Sub-grid resolution
    view.setUint8(byteOffset, world.subResolution); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Sub-atlas size
    view.setUint8(byteOffset, world.subAtlasSize); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Main-grid block size
    view.setUint16(byteOffset, world.blockSize, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
    //  Simulation tickRate
    view.setUint8(byteOffset, world.tickRate); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Simulation tick
    view.setUint32(byteOffset, world.tick, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  IO pin state
    view.setUint8(byteOffset, world.ioPinState ? 1 : 0); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Camera rotation
    if (world.cameraRotation) {
      view.setFloat32(byteOffset, world.cameraRotation[0], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
      view.setFloat32(byteOffset, world.cameraRotation[1], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    } else {
      byteOffset += 2 * Float32Array.BYTES_PER_ELEMENT;
    }
    //  Camera translation
    if (world.cameraTranslation) {
      view.setFloat32(byteOffset, world.cameraTranslation[0], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
      view.setFloat32(byteOffset, world.cameraTranslation[1], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
      view.setFloat32(byteOffset, world.cameraTranslation[2], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    } else {
      byteOffset += 3 * Float32Array.BYTES_PER_ELEMENT;
    }
    // Post-processing margins
    view.setFloat32(byteOffset, ppData.margins, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing exposure
    view.setFloat32(byteOffset, ppData.exposure, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing film grain
    view.setFloat32(byteOffset, ppData.filmGrain, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing vignette
    view.setFloat32(byteOffset, ppData.vignette, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing chromatic aberration
    view.setFloat32(byteOffset, ppData.chromaticAberration, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sun intensity
    view.setFloat32(byteOffset, ppData.sunIntensity, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sun color
    view.setFloat32(byteOffset, ppData.sunColor[0], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    view.setFloat32(byteOffset, ppData.sunColor[1], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    view.setFloat32(byteOffset, ppData.sunColor[2], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing fog intensity
    view.setFloat32(byteOffset, ppData.fogIntensity, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sky color
    view.setFloat32(byteOffset, ppData.skyColor[0], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    view.setFloat32(byteOffset, ppData.skyColor[1], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    view.setFloat32(byteOffset, ppData.skyColor[2], true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing bloom intensity
    view.setFloat32(byteOffset, ppData.bloomIntensity, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing volumetric light
    view.setUint8(byteOffset, ppData.volumetricLight ? 1 : 0); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Post-processing FXAA
    view.setUint8(byteOffset, ppData.FXAA ? 1 : 0); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Post-processing particles
    view.setUint8(byteOffset, ppData.particles ? 1 : 0); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Post-processing aperture
    view.setFloat32(byteOffset, ppData.aperture, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing backface grid intensity
    view.setFloat32(byteOffset, ppData.backfaceGridIntensity, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing auto focus speed
    view.setFloat32(byteOffset, ppData.autoFocusSpeed, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Hand material ids
    for (let ii = 0; ii < 8; ++ii) {
      if (handMaterialIds !== null) view.setUint8(byteOffset, handMaterialIds[ii]);
      byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    }
    //  Hand material index
    view.setUint8(byteOffset, handMaterialIndex); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Previous hand material index
    view.setUint8(byteOffset, previousHandMaterialIndex); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Module data offset
    view.setUint32(byteOffset, moduleByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Module data length
    view.setUint32(byteOffset, moduleData.byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Material data count
    view.setUint32(byteOffset, materialData.length, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Material data offsets & lengths
    for (let ii = 0; ii < materialData.length; ++ii) {
      //  Material data offsets
      view.setUint32(byteOffset, materialByteOffsets[ii], true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
      //  Material data lengths
      view.setUint32(byteOffset, materialData[ii].byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    }
    //  Cell data offset
    view.setUint32(byteOffset, cellByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Cell data length
    view.setUint32(byteOffset, (cellData !== null ? (cellData[0].byteLength * 2) : 0), true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Flow data offset
    view.setUint32(byteOffset, flowByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Flow data length
    view.setUint32(byteOffset, (flowData !== null ? (flowData[0].byteLength * 2) : 0), true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    // ## Module data ##
    buffer.set(new Uint8Array(moduleData.buffer, moduleData.byteOffset, moduleData.byteLength), byteOffset);
    byteOffset += moduleData.byteLength;
    // ## Material data ##
    for (let ii = 0; ii < materialData.length; ++ii) {
      const data = materialData[ii];
      buffer.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), byteOffset);
      byteOffset += data.byteLength;
    }
    byteOffset = align(byteOffset, Uint32Array.BYTES_PER_ELEMENT);
    // ## Cell data ##
    if (cellData !== null) {
      buffer.set(new Uint8Array(cellData[0].buffer, cellData[0].byteOffset, cellData[0].byteLength), byteOffset);
      byteOffset += cellData[0].byteLength;
      buffer.set(new Uint8Array(cellData[1].buffer, cellData[1].byteOffset, cellData[1].byteLength), byteOffset);
      byteOffset += cellData[1].byteLength;
    }
    // ## Flow data ##
    if (flowData !== null) {
      buffer.set(new Uint8Array(flowData[0].buffer, flowData[0].byteOffset, flowData[0].byteLength), byteOffset);
      byteOffset += flowData[0].byteLength;
      buffer.set(new Uint8Array(flowData[1].buffer, flowData[1].byteOffset, flowData[1].byteLength), byteOffset);
      byteOffset += flowData[1].byteLength;
    }
  }
  return buffer;
}

/**
 * Parse the provided vxmo file
 * @param buffer - The vxmo file buffer
 */
export function parseVXMOFile(buffer: Uint8Array): IVXMOFile {
  // Abort if buffer is empty
  if (buffer.byteLength === 0) return null;
  let byteOffset = 0x0;
  const view = new DataView(buffer.buffer);
  // ## File header ##
  const header = parseVXFile(buffer, VXMO_MAGIC);
  byteOffset += header.byteLength;
  // ## Header ##
  //  Input data offset
  const inputByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Input data length
  const inputByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Output data offset
  const outputByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Output data length
  const outputByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Input remap data offset
  const inputRemapByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Input remap data length
  const inputRemapByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Output remap data offset
  const outputRemapByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Output remap data length
  const outputRemapByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  BDD data count
  const bddDataCount = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  BDD data offsets & lengths
  const bddByteLocations: [number, number][] = [];
  //  BDD data offsets & lengths
  for (let ii = 0; ii < bddDataCount; ++ii) {
    //  BDD data offsets
    const bddByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  BDD data lengths
    const bddByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    bddByteLocations.push([bddByteOffset, bddByteLength]);
  }
  // ## Input data ##
  const inputData = new Uint32Array(buffer.buffer, inputByteOffset, inputByteLength / Uint32Array.BYTES_PER_ELEMENT);
  // ## Output data ##
  const outputData = new Uint32Array(buffer.buffer, outputByteOffset, outputByteLength / Uint32Array.BYTES_PER_ELEMENT);
  // ## Input remap data ##
  const inputRemapData = new Uint8Array(buffer.buffer, inputRemapByteOffset, inputRemapByteLength / Uint8Array.BYTES_PER_ELEMENT);
  // ## Output remap data ##
  const outputRemapData = new Uint8Array(buffer.buffer, outputRemapByteOffset, outputRemapByteLength / Uint8Array.BYTES_PER_ELEMENT);
  // ## BDD data ##
  const bddData: Uint32Array[] = [];
  for (let ii = 0; ii < bddDataCount; ++ii) {
    const [byteOffset, byteLength] = bddByteLocations[ii];
    bddData.push(new Uint32Array(buffer.buffer, byteOffset, byteLength / Uint32Array.BYTES_PER_ELEMENT));
  }
  const module: IVXMO = {
    input: inputData,
    inputRemap: inputRemapData,
    output: outputData,
    outputRemap: outputRemapData,
    bdd: bddData,
  };
  const file: IVXMOFile = {
    version: header.file.version,
    preview: header.file.preview,
    module: module,
  };
  return file;
}

/**
 * Compile the provided vxmo file
 * @param file - The vxmo file to compile
 */
export function compileVXMOFile(file: IVXMOFile): Uint8Array {
  const {module} = file;
  let byteOffset = 0x0;
  let byteLength = 0x0;
  let inputByteOffset = 0x0;
  let outputByteOffset = 0x0;
  let inputRemapByteOffset = 0x0;
  let outputRemapByteOffset = 0x0;
  const header = compileVXFile(file, VXMO_MAGIC);
  const bddByteOffsets = [];
  const inputData = module.input;
  const outputData = module.output;
  const inputRemapData = module.inputRemap;
  const outputRemapData = module.outputRemap;
  const bddData = module.bdd;
  // Find total byte length
  {
    // ## File header ##
    byteLength += header.byteLength;
    // ## Header ##
    //  Input data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Input data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Output data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Output data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Input remap data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Input remap data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Output remap data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Output remap data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  BDD data count
    byteLength += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  BDD data offsets
    byteLength += bddData.length * Uint32Array.BYTES_PER_ELEMENT;
    //  BDD data lengths
    byteLength += bddData.length * Uint32Array.BYTES_PER_ELEMENT;
    // ## Input data ##
    byteLength = align(byteLength, Uint32Array.BYTES_PER_ELEMENT);
    inputByteOffset = byteLength;
    byteLength += inputData.byteLength;
    // ## Output data ##
    byteLength = align(byteLength, Uint32Array.BYTES_PER_ELEMENT);
    outputByteOffset = byteLength;
    byteLength += outputData.byteLength;
    // ## Input remap data ##
    inputRemapByteOffset = byteLength;
    byteLength += inputRemapData.byteLength;
    // ## Output Remap data ##
    outputRemapByteOffset = byteLength;
    byteLength += outputRemapData.byteLength;
    // ## BDD data ##
    byteLength = align(byteLength, Uint32Array.BYTES_PER_ELEMENT);
    for (let ii = 0; ii < bddData.length; ++ii) {
      bddByteOffsets.push(byteLength);
      byteLength += bddData[ii].byteLength;
    }
  }
  const buffer = new Uint8Array(byteLength);
  const view = new DataView(buffer.buffer);
  // Compile into buffer
  {
    // ## File Header ##
    buffer.set(header.data, byteOffset); byteOffset += header.byteLength;
    // ## Header ##
    //  Input data offset
    view.setUint32(byteOffset, inputByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Input data length
    view.setUint32(byteOffset, inputData.byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Output data offset
    view.setUint32(byteOffset, outputByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Output data length
    view.setUint32(byteOffset, outputData.byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Input remap data offset
    view.setUint32(byteOffset, inputRemapByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Input remap data length
    view.setUint32(byteOffset, inputRemapData.byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Output remap data offset
    view.setUint32(byteOffset, outputRemapByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Output remap data length
    view.setUint32(byteOffset, outputRemapData.byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  BDD data count
    view.setUint32(byteOffset, bddData.length, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  BDD data offsets & lengths
    for (let ii = 0; ii < bddData.length; ++ii) {
      //  BDD data offsets
      view.setUint32(byteOffset, bddByteOffsets[ii], true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
      //  BDD data lengths
      view.setUint32(byteOffset, bddData[ii].byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    }
    // ## Input data ##
    byteOffset = align(byteOffset, Uint32Array.BYTES_PER_ELEMENT);
    buffer.set(new Uint8Array(inputData.buffer, inputData.byteOffset, inputData.byteLength), byteOffset);
    byteOffset += inputData.byteLength;
    // ## Output data ##
    byteOffset = align(byteOffset, Uint32Array.BYTES_PER_ELEMENT);
    buffer.set(new Uint8Array(outputData.buffer, outputData.byteOffset, outputData.byteLength), byteOffset);
    byteOffset += outputData.byteLength;
    // ## Input remap data ##
    buffer.set(new Uint8Array(inputRemapData.buffer, inputRemapData.byteOffset, inputRemapData.byteLength), byteOffset);
    byteOffset += inputRemapData.byteLength;
    // ## Output remap data ##
    buffer.set(new Uint8Array(outputRemapData.buffer, outputRemapData.byteOffset, outputRemapData.byteLength), byteOffset);
    byteOffset += outputRemapData.byteLength;
    // ## BDD data ##
    byteOffset = align(byteOffset, Uint32Array.BYTES_PER_ELEMENT);
    for (let ii = 0; ii < bddData.length; ++ii) {
      const data = bddData[ii];
      buffer.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), byteOffset);
      byteOffset += data.byteLength;
    }
  }
  return buffer;
}

/**
 * Parse the provided vxma file
 * @param buffer - The vxma file buffer
 */
export function parseVXMAFile(buffer: Uint8Array): IVXMAFile {
  let byteOffset = 0x0;
  const view = new DataView(buffer.buffer);
  // ## File header ##
  const header = parseVXFile(buffer, VXMA_MAGIC);
  byteOffset += header.byteLength;
  // ## Header ##
  //  Id
  const id = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  Density
  const density = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  Conductivity
  const conductivity = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  World id
  const worldId = Number(view.getBigUint64(byteOffset, true) % BigInt(Number.MAX_SAFE_INTEGER)); byteOffset += BigUint64Array.BYTES_PER_ELEMENT;
  //  World hash
  const worldHash = new Uint8Array(0x20);
  for (let ii = 0; ii < 0x20; ++ii) {
    worldHash[ii] = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  }
  //  World module data offset
  const worldModuleByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  World module data length
  const worldModuleByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Model data count
  const modelDataCount = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Model data offsets & lengths
  const modelByteLocations: [number, number][] = [];
  //  Model data offsets & lengths
  for (let ii = 0; ii < modelDataCount; ++ii) {
    //  Model data offsets
    const modelByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Model data lengths
    const modelByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    modelByteLocations.push([modelByteOffset, modelByteLength]);
  }
  // ## World module data ##
  const worldModuleData = new Uint8Array(buffer.buffer, worldModuleByteOffset, worldModuleByteLength / Uint8Array.BYTES_PER_ELEMENT);
  const worldModule = parseVXMOFile(new Uint8Array(worldModuleData)); // Create copy of module data to retain byte offset
  // ## Model data ##
  const modelData: IVXMM[] = [];
  for (let ii = 0; ii < modelDataCount; ++ii) {
    const [byteOffset, byteLength] = modelByteLocations[ii];
    const model = parseVXMMFile(new Uint8Array(
      new Uint8Array(buffer.buffer, byteOffset, byteLength / Uint8Array.BYTES_PER_ELEMENT)
    )); // Create copy of material data to retain byte offset
    modelData.push(model.model);
  }
  const material: IVXMA = {
    id: id,
    density: density,
    conductivity: conductivity,
    models: modelData,
    worldId: worldId,
    worldHash: worldHash,
    worldModule: worldModule ? worldModule.module : null,
  };
  const file: IVXMAFile = {
    version: header.file.version,
    preview: header.file.preview,
    material: material,
  };
  return file;
}

/**
 * Compile the provided vxma file
 * @param file - The vxma file to compile
 */
export function compileVXMAFile(file: IVXMAFile): Uint8Array {
  const {material} = file;
  let byteOffset = 0x0;
  let byteLength = 0x0;
  const header = compileVXFile(file, VXMA_MAGIC);
  let worldModuleByteOffset = 0x0;
  const worldModuleData = material.worldModule ? compileVXMOFile({
    version: file.version,
    module: material.worldModule,
  }) : new Uint8Array(0);
  const modelByteOffsets = [];
  const modelData = (material.models || []).map(model => compileVXMMFile({
    version: file.version,
    model: model,
  }));
  // Find total byte length
  {
    // ## File header ##
    byteLength += header.byteLength;
    // ## Header ##
    //  Id
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Density
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Conductivity
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  World id
    byteLength += 1 * BigUint64Array.BYTES_PER_ELEMENT;
    //  World hash
    byteLength += 0x20 * Uint8Array.BYTES_PER_ELEMENT;
    //  World module data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  World module data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Model data count
    byteLength += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Model data offsets
    byteLength += modelData.length * Uint32Array.BYTES_PER_ELEMENT;
    //  Model data lengths
    byteLength += modelData.length * Uint32Array.BYTES_PER_ELEMENT;
    // ## World module data ##
    worldModuleByteOffset = byteLength;
    byteLength += worldModuleData.byteLength;
    // ## Model data ##
    for (let ii = 0; ii < modelData.length; ++ii) {
      modelByteOffsets.push(byteLength);
      byteLength += modelData[ii].byteLength;
    }
  }
  const buffer = new Uint8Array(byteLength);
  const view = new DataView(buffer.buffer);
  // Compile into buffer
  {
    // ## File Header ##
    buffer.set(header.data, byteOffset); byteOffset += header.byteLength;
    // ## Header ##
    //  Id
    view.setUint8(byteOffset, material.id); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Density
    view.setUint8(byteOffset, material.density); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Conductivity
    view.setUint8(byteOffset, material.conductivity); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  World id
    view.setBigUint64(byteOffset, BigInt(material.worldId), true); byteOffset += 1 * BigUint64Array.BYTES_PER_ELEMENT;
    //  World hash
    for (let ii = 0; ii < 0x20; ++ii) {
      view.setUint32(byteOffset, material.worldHash ? material.worldHash[ii] : 0, true); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    }
    //  World module data offset
    view.setUint32(byteOffset, worldModuleByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  World module data length
    view.setUint32(byteOffset, worldModuleData.byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Model data count
    view.setUint32(byteOffset, modelData.length, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Model data offsets & lengths
    for (let ii = 0; ii < modelData.length; ++ii) {
      //  Model data offsets
      view.setUint32(byteOffset, modelByteOffsets[ii], true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
      //  Model data lengths
      view.setUint32(byteOffset, modelData[ii].byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    }
    // ## World module data ##
    buffer.set(new Uint8Array(worldModuleData.buffer, worldModuleData.byteOffset, worldModuleData.byteLength), byteOffset);
    byteOffset += worldModuleData.byteLength;
    // ## Model data ##
    for (let ii = 0; ii < modelData.length; ++ii) {
      const data = modelData[ii];
      buffer.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), byteOffset);
      byteOffset += data.byteLength;
    }
  }
  return buffer;
}

/**
 * Parse the provided vxmm file
 * @param buffer - The vxmm file buffer
 */
export function parseVXMMFile(buffer: Uint8Array): IVXMMFile {
  // Abort if buffer is empty
  if (buffer.byteLength === 0) return null;
  let byteOffset = 0x0;
  // ## Magic ##
  const view = new DataView(buffer.buffer);
  // ## File header ##
  const header = parseVXFile(buffer, VXMM_MAGIC);
  byteOffset += header.byteLength;
  // ## Header ##
  //  Resolution
  const resolution = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
  //  Data offset
  const dataByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Data length
  const dataByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Icon offset
  const iconByteOffset = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  //  Icon length
  const iconByteLength = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  // ## Data ##
  const data = new Uint8Array(buffer.buffer, dataByteOffset, dataByteLength / Uint8Array.BYTES_PER_ELEMENT);
  // ## Icon ##
  const icon = new Uint8Array(buffer.buffer, iconByteOffset, iconByteLength / Uint8Array.BYTES_PER_ELEMENT);
  const model: IVXMM = {
    resolution,
    data: data,
    icon: icon,
  };
  const file: IVXMMFile = {
    version: header.file.version,
    preview: header.file.preview,
    model: model,
  };
  return file;
}

/**
 * Compile the provided vxmm file
 * @param file - The vxmm file to compile
 */
export function compileVXMMFile(file: IVXMMFile): Uint8Array {
  const {model} = file;
  let byteOffset = 0x0;
  let byteLength = 0x0;
  let dataByteOffset = 0x0;
  let iconByteOffset = 0x0;
  const header = compileVXFile(file, VXMM_MAGIC);
  const resolution = model.resolution;
  const data = model.data || new Uint8Array(0);
  const icon = model.icon || new Uint8Array(0);
  // Find total byte length
  {
    // ## File header ##
    byteLength += header.byteLength;
    // ## Header ##
    //  Resolution
    byteLength += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Data offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Data length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Icon offset
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    //  Icon length
    byteLength += Uint32Array.BYTES_PER_ELEMENT;
    // ## Data ##
    dataByteOffset = byteLength;
    byteLength += data.byteLength;
    // ## Icon ##
    iconByteOffset = byteLength;
    byteLength += icon.byteLength;
  }
  const buffer = new Uint8Array(byteLength);
  const view = new DataView(buffer.buffer);
  // Compile into buffer
  {
    // ## File Header ##
    buffer.set(header.data, byteOffset); byteOffset += header.byteLength;
    // ## Header ##
    //  Resolution
    view.setUint8(byteOffset, resolution); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
    //  Data offset
    view.setUint32(byteOffset, dataByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Data length
    view.setUint32(byteOffset, data.byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Icon offset
    view.setUint32(byteOffset, iconByteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Icon length
    view.setUint32(byteOffset, icon.byteLength, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    // ## Data ##
    buffer.set(new Uint8Array(data.buffer, data.byteOffset, data.byteLength), byteOffset);
    byteOffset += data.byteLength;
    // ## Icon ##
    buffer.set(new Uint8Array(icon.buffer, icon.byteOffset, icon.byteLength), byteOffset);
    byteOffset += icon.byteLength;
  }
  return buffer;
}

/**
 * Parse the provided xraw file
 * @param buffer - The xraw file data
 */
export function parseXRawFile(buffer: Uint8Array): IXRawFile {
  let byteOffset = 0x0;
  const reader = new DataView(buffer.buffer);
  // ## Magic ##
  if (!isXRAWFile(buffer)) {
    throw new Error(`Invalid magic, expected '${XRAW_MAGIC}' but got '${getBufferMagic(buffer)}'`);
  }
  byteOffset += 0x4;
  // Read color data information
  const colorChannelType = reader.getUint8(byteOffset); byteOffset += Uint8Array.BYTES_PER_ELEMENT;
  const colorChannelCount = reader.getUint8(byteOffset); byteOffset += Uint8Array.BYTES_PER_ELEMENT;
  const colorChannelBits = reader.getUint8(byteOffset); byteOffset += Uint8Array.BYTES_PER_ELEMENT;
  const colorChannelBitsPerIndex = reader.getUint8(byteOffset); byteOffset += Uint8Array.BYTES_PER_ELEMENT;
  // Validate color data information
  if (colorChannelType !== 0) throw new Error(`Invalid color channel type, expected '0' but got '${colorChannelType}'`);
  if (colorChannelCount !== 4) throw new Error(`Invalid color channel count, expected '4' but got '${colorChannelCount}'`);
  if (colorChannelBits !== 8) throw new Error(`Invalid color channel bits, expected '8' but got '${colorChannelBits}'`);
  if (colorChannelBitsPerIndex !== 8) throw new Error(`Invalid color channel bits per index, expected '8' but got '${colorChannelBitsPerIndex}'`);
  // Read volume size
  const width = reader.getUint32(byteOffset, true); byteOffset += Uint32Array.BYTES_PER_ELEMENT;
  const height = reader.getUint32(byteOffset, true); byteOffset += Uint32Array.BYTES_PER_ELEMENT;
  const depth = reader.getUint32(byteOffset, true); byteOffset += Uint32Array.BYTES_PER_ELEMENT;
  // Read palette data information
  const paletteColorCount = reader.getUint32(byteOffset, true); byteOffset += Uint32Array.BYTES_PER_ELEMENT;
  // Validate palette data information
  if (paletteColorCount !== 256) throw new Error(`Invalid palette color count, expected '256' but got '${paletteColorCount}'`);
  // Find buffer read offsets
  const voxelDataOffset = byteOffset;
  const paletteDataOffset = byteOffset + (width * height * depth);
  // Buffer to store the voxel palette data inside
  const voxels = new Uint8Array(width * height * depth);
  // Read voxel buffer
  for (let zz = 0; zz < depth; ++zz) {
    for (let yy = 0; yy < height; ++yy) {
      for (let xx = 0; xx < width; ++xx) {
        const srcIndex = (zz * width) + (yy * width * depth) + xx;
        const dstIndex = (xx * width * height) + (yy * width) + zz;
        voxels[dstIndex] = reader.getUint8(voxelDataOffset + srcIndex);
      }
    }
  }
  // Read palette buffer
  const palette = new Uint8Array(paletteColorCount * 4);
  for (let ii = 0; ii < paletteColorCount * 4; ++ii) {
    // Write palette color into output buffer
    palette[ii] = reader.getUint8(paletteDataOffset + ii);
  }
  // Fill voxel output buffer
  const output = new Uint8Array(width * height * depth * 4);
  for (let zz = 0; zz < depth; ++zz) {
    for (let yy = 0; yy < height; ++yy) {
      for (let xx = 0; xx < width; ++xx) {
        const srcIndex = (zz * width * height) + (yy * width) + xx;
        //const dstIndex = (zz * width * height) + ((height - 1 - yy) * width) + xx;
        const dstIndex = (zz * width * height) + (yy * width) + xx;
        const paletteIndex = voxels[srcIndex];
        const paletteColorR = palette[(paletteIndex * 4) + 0];
        const paletteColorG = palette[(paletteIndex * 4) + 1];
        const paletteColorB = palette[(paletteIndex * 4) + 2];
        const paletteColorA = palette[(paletteIndex * 4) + 3];
        output[(dstIndex * 4) + 0] = paletteColorR;
        output[(dstIndex * 4) + 1] = paletteColorG;
        output[(dstIndex * 4) + 2] = paletteColorB;
        output[(dstIndex * 4) + 3] = paletteColorA;
        //output[(voxelIndex * 1) + 0] = paletteIndex;
      }
    }
  }
  // Return result
  return {
    data: output,
    width: width,
    height: height,
    depth: depth,
  };
}
