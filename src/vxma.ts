import {getBufferMagic} from "./utils";
import {compileVXFile, IVXFile, parseVXFile, VX_MAGIC} from "./vx";
import {compileVXMMFile, IVXMM, parseVXMMFile} from "./vxmm";
import {compileVXMOFile, IVXMO, parseVXMOFile} from "./vxmo";

/**
 * The magic bytes of a vxma file
 */
export const VXMA_MAGIC = `${VX_MAGIC}MA`;

/**
 * Indicates if the provided buffer is a vxma file
 * @param buffer - The buffer to check
 */
export function isVXMAFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === VXMA_MAGIC;
}

/**
 * Represents a voxelchain material
 */
export interface IVXMA {
  /**
   * The id (0-1024) of the material
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
  const id = view.getUint16(byteOffset, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
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
    byteLength += 1 * Uint16Array.BYTES_PER_ELEMENT;
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
    view.setUint16(byteOffset, material.id, true); byteOffset += 1 * Uint16Array.BYTES_PER_ELEMENT;
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
