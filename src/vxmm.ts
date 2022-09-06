import {getBufferMagic} from "./utils";
import {compileVXFile, IVXFile, parseVXFile, VX_MAGIC} from "./vx";

/**
 * The magic bytes of a vxmm file
 */
export const VXMM_MAGIC = `${VX_MAGIC}MM`;

/**
 * Indicates if the provided buffer is a vxmm file
 * @param buffer - The buffer to check
 */
export function isVXMMFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === VXMM_MAGIC;
}

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
