import {getBufferMagic} from "./utils";

/**
 * The magic bytes of a xraw file
 */
export const XRAW_MAGIC = "XRAW";

/**
 * Indicates if the provided buffer is a xraw file
 * @param buffer - The buffer to check
 */
export function isXRAWFile(buffer: Uint8Array): boolean {
  return getBufferMagic(buffer) === XRAW_MAGIC;
}

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
 * Parse the provided xraw file
 * @param buffer - The xraw file data
 * @param useAlphaPalette - Optionally store the palette index into the alpha-channel
 */
export function parseXRawFile(buffer: Uint8Array, useAlphaPalette: boolean = false): IXRawFile {
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
        const dstIndex = (yy * width * depth) + (zz * width) + xx;
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
        output[(dstIndex * 4) + 3] = useAlphaPalette ? paletteIndex : paletteColorA;
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
