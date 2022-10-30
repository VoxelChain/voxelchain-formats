// @ts-ignore
import {gzip, ungzip} from "pako";

/**
 * Align the provided number by the given alignment
 * @param value - The value to align
 * @param alignment - The alignment to apply
 */
export function align(value: number, alignment: number): number {
  return Math.ceil(value / alignment) * alignment;
}

/**
 * Extracts from a bitfield
 * @param base - The number to extract from
 * @param offset - The offset to extract at
 * @param length - The length of the number to extract
 */
export function bitfieldExtract(base: number, offset: number, length: number): number {
  const mask = (1 << length) - 1;
  return ((base >> offset) & mask) >>> 0;
}

/**
 * Inserts into a bitfield
 * @param base - The number to insert into
 * @param insert - The number to insert
 * @param offset - The offset to insert at
 * @param length - The length of the inserted number to insert
 */
export function bitfieldInsert(base: number, insert: number, offset: number, length: number): number {
  const mask = ~(~(0xFFFFFFFF << length) << offset);
  base = base & mask;
  return (base | (insert << offset)) >>> 0;
}

/**
 * Converts the provided 3D voxel-space coordinates into a 1D index
 * @param x - The voxel-space x-axis coordinate to convert
 * @param y - The voxel-space y-axis coordinate to convert
 * @param z - The voxel-space z-axis coordinate to convert
 * @param resolution - The resolution of the voxel coordinates to convert
 */
export function voxelPositionToIndex(x: number, y: number, z: number, resolution: number): number {
  return (z * resolution * resolution) + (y * resolution) + x;
}

/**
 * Converts the provided 1D index into the relative voxel-space 3D position
 * @param index - The 1D voxel index to convert
 * @param resolution - The resolution of the voxel index to convert
 */
export function indexToVoxelPosition(index: number, resolution: number): Uint32Array {
  return new Uint32Array([
    Math.floor(index % resolution),
    Math.floor((index / resolution) % resolution),
    Math.floor(index / (resolution * resolution))
  ]);
}

/**
 * Extracts the magic bytes from the provided buffer
 * @param buffer - The buffer to extract the magic from
 * @param byteOffset - Optional byte offset to start at
 */
export function getBufferMagic(buffer: Uint8Array, byteOffset: number = 0x0): string {
  const viewU8 = new Uint8Array(buffer.buffer);
  const magic = new TextDecoder("utf-8").decode(viewU8.subarray(byteOffset, byteOffset + 0x4));
  return magic;
}

/**
 * Compress the provided buffer with gzip
 * @param buffer - The buffer to compress
 */
export function compressGZIP(buffer: Uint8Array): Uint8Array {
  return gzip(buffer);
}

/**
 * Decompressed the provided gzip compressed buffer
 * @param buffer - The buffer to decompress
 */
export function decompressGZIP(buffer: Uint8Array): Uint8Array {
  return ungzip(buffer);
}
