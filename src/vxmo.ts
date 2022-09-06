import {align, getBufferMagic} from "./utils";
import {compileVXFile, IVXFile, parseVXFile, VX_MAGIC} from "./vx";

/**
 * The magic bytes of a vxmo file
 */
export const VXMO_MAGIC = `${VX_MAGIC}MO`;

/**
 * Indicates if the provided buffer is a vxmo file
 * @param buffer - The buffer to check
 */
export function isVXMOFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === VXMO_MAGIC;
}

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
