import {getBufferMagic} from "./utils";

/**
 * The magic bytes of a vx file
 */
export const VX_MAGIC = `VX`;

/**
 * Indicates if the provided buffer is a vx file
 * @param buffer - The buffer to check
 */
export function isVXFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer).substring(0, 2) === VX_MAGIC;
}

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
