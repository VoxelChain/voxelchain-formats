import {DEFAULT_OPTIONS_POST_PROCESSING_STATE, IPostProcessingState} from ".";
import {align, getBufferMagic} from "./utils";
import {compileVXFile, IVXFile, parseVXFile, VX_MAGIC} from "./vx";
import {compileVXMAFile, IVXMA, parseVXMAFile} from "./vxma";
import {compileVXMOFile, IVXMO, parseVXMOFile} from "./vxmo";

/**
 * The magic bytes of a vxwo file
 */
export const VXWO_MAGIC = `${VX_MAGIC}WO`;

/**
 * Indicates if the provided buffer is a vxwo file
 * @param buffer - The buffer to check
 */
export function isVXWOFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === VXWO_MAGIC;
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
   * The material count
   */
  materialCount: number;
  /**
   * The material animation count
   */
  materialAnimationCount: number;
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
  handMaterialIds: Uint32Array;
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
  materialCount: 256,
  materialAnimationCount: 8,
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
  //  Material count
  const materialCount = view.getUint16(byteOffset, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
  //  Material animation count
  const materialAnimationCount = view.getUint8(byteOffset); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
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
  // Post-processing saturation
  const ppSaturation = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
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
  // Post-processing sky intensity
  const ppSkyIntensity = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
  // Post-processing day time
  const ppDayTime = view.getFloat32(byteOffset, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
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
  const handMaterialIds = new Uint32Array(8);
  for (let ii = 0; ii < 8; ++ii) {
    handMaterialIds[ii] = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  }
  // Hand material index
  const handMaterialIndex = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
  // Previous hand material index
  const previousHandMaterialIndex = view.getUint32(byteOffset, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
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
    saturation: ppSaturation,
    chromaticAberration: ppChromaticAberration,
    sunIntensity: ppSunIntensity,
    sunColor: ppSunColor,
    fogIntensity: ppFogIntensity,
    skyColor: ppSkyColor,
    skyIntensity: ppSkyIntensity,
    dayTime: ppDayTime,
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
    materialCount,
    materialAnimationCount,
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
    //  Material count
    byteLength += Uint16Array.BYTES_PER_ELEMENT;
    //  Material animation count
    byteLength += Uint8Array.BYTES_PER_ELEMENT;
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
    //  Post-processing saturation
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing chromatic aberration
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sun intensity
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sun color
    byteLength += 3 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing fog intensity
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing sky intensity
    byteLength += Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing day time
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
    byteLength += 8 * Uint32Array.BYTES_PER_ELEMENT;
    //  Hand material index
    byteLength += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Previous hand material index
    byteLength += 1 * Uint32Array.BYTES_PER_ELEMENT;
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
    //  Material count
    view.setUint16(byteOffset, world.materialCount, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
    //  Material animation count
    view.setUint8(byteOffset, world.materialAnimationCount); byteOffset += 1 * Uint8Array.BYTES_PER_ELEMENT;
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
    //  Post-processing saturation
    view.setFloat32(byteOffset, ppData.saturation, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
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
    //  Post-processing sky intensity
    view.setFloat32(byteOffset, ppData.skyIntensity, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
    //  Post-processing day time
    view.setFloat32(byteOffset, ppData.dayTime, true); byteOffset += 1 * Float32Array.BYTES_PER_ELEMENT;
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
      if (handMaterialIds !== null) view.setUint32(byteOffset, handMaterialIds[ii], true);
      byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    }
    //  Hand material index
    view.setUint32(byteOffset, handMaterialIndex, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
    //  Previous hand material index
    view.setUint32(byteOffset, previousHandMaterialIndex, true); byteOffset += 1 * Uint32Array.BYTES_PER_ELEMENT;
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
