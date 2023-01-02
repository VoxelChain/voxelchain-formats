// @ts-ignore
import {gzip, ungzip} from "pako";

const TEXT_ENCODER_UTF8 = new TextEncoder();
const TEXT_DECODER_UTF8 = new TextDecoder("utf-8");
const TEXT_DECODER_UTF16 = new TextDecoder("utf-16");

/**
 * The parsed mesh data of a wavefront object file
 */
export interface IWavefrontObject {
  vertices: Float32Array;
  normals: Float32Array;
  uvs: Float32Array;
  indices: Uint32Array;
}

/**
 * The parsed data of a binvox file
 */
export interface IBinVoxFile {
  data: Uint8Array;
  resolution: number;
  scale: Float32Array;
  translation: Float32Array;
}

/**
 * Representation of a 2D environment image
 */
export interface IEnvironmentImage {
  data: Float32Array;
  width: number;
  height: number;
}

/**
 * Representation of a 2D image
 */
export interface IBinaryImage {
  data: Uint8Array;
  width: number;
  height: number;
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
 * @param width - The width of the voxel coordinates to convert
 * @param height - The height of the voxel coordinates to convert
 * @param depth - The depth of the voxel coordinates to convert
 */
export function voxelPositionToIndex(x: number, y: number, z: number, width: number, height: number, depth: number): number {
  return (z * width * height) + (y * width) + x;
}

/**
 * Converts the provided 1D index into the relative voxel-space 3D position
 * @param index - The 1D voxel index to convert
 * @param width - The width of the voxel index to convert
 * @param height - The height of the voxel index to convert
 * @param depth - The depth of the voxel index to convert
 */
export function indexToVoxelPosition(index: number, width: number, height: number, depth: number): Uint32Array {
  return new Uint32Array([
    Math.floor(index % width),
    Math.floor((index / width) % height),
    Math.floor(index / (width * height))
  ]);
}

/**
 * Clamps a value between the provided boundings
 * @param value - The value to clamp between min/max
 * @param min - The minimum clamp boundings
 * @param max - The maximum clamp boundings
 */
export function clamp(value: number, min: number, max: number): number {
  const t = value < min ? min : value;
  return t > max ? max : t;
}

/**
 * Mixes two values together based on the provided factor
 * @param a - The first value to mix
 * @param b - The second value to mix
 * @param f - The mixing factor
 */
export function mix(a: number, b: number, f: number): number {
  return (a * (1.0 - f)) + (b * f);
}

/**
 * Applies zoom to the provided scale factor
 * @param s - A scale factor
 */
export function zoomScale(s: number): number {
  return (s >= 0 ? s + 1 : s < 0 ? -(s) + 1 : s + 1);
}

/**
 * Indicates if the provided value is power of two
 * @param value - The value to check
 */
export function isPowerOf2(value: number): boolean {
  return (value & (value - 1)) === 0;
}

/**
 * Calculates the next power-of-two value of the provided value
 * @param value - The value to calculate for
 */
export function nextPOT(value: number): number {
  let p = 2;
  while (value >>= 1) p <<= 1;
  return p;
}

/**
 * Creates a string-based bit representation of the provided number
 * @param base - The number to convert
 * @param states - The number of states
 */
export function bitString(base: number, states: number): string {
  return [...Array(states)].map((_, i) => (base >> i) & 1).reverse().join("");
}

/**
 * Converts the provided 8-bit rgba into a 32-bit uint
 * @param rgba - The rgba to convert
 */
export function rgba8ToUint32(rgba: Uint8Array): number {
  return (
    ((rgba[0] & 0xFF) << 24) +
    ((rgba[1] & 0xFF) << 16) +
    ((rgba[2] & 0xFF) << 8) +
    ((rgba[3] & 0xFF) << 0)
  );
}

/**
 * Returns the amount of active bits of the provided value
 * @param value - The value to process
 */
export function popcount(value: number): number {
  let n = value;
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return ((n + (n >> 4) & 0xF0F0F0F) * 0x1010101) >> 24;
}

/**
 * Extracts the 8-bit red component of the provided 32-bit uint
 * @param value - The 32-bit uint to extract from
 */
export function uint32GetR8(value: number): number {
  return (value >> 24) & 0xFF;
}

/**
 * Extracts the 8-bit green component of the provided 32-bit uint
 * @param value - The 32-bit uint to extract from
 */
export function uint32GetG8(value: number): number {
  return (value >> 16) & 0xFF;
}

/**
 * Extracts the 8-bit blue component of the provided 32-bit uint
 * @param value - The 32-bit uint to extract from
 */
export function uint32GetB8(value: number): number {
  return (value >> 8) & 0xFF;
}

/**
 * Extracts the 8-bit alpha component of the provided 32-bit uint
 * @param value - The 32-bit uint to extract from
 */
export function uint32GetA8(value: number): number {
  return (value >> 0) & 0xFF;
}

/**
 * Converts the provided 32-bit uint into it's 8-bit rgba equivalent
 * @param uint32 - The 32-bit uint to convert
 */
export function uint32ToRGBA8(value: number): Uint8Array {
  return new Uint8Array([
    uint32GetR8(value),
    uint32GetG8(value),
    uint32GetB8(value),
    uint32GetA8(value)
  ]);
}

/**
 * Converts the provided value from degree into radian
 * @param value - The degree value to convert
 */
export function degreeToRadian(value: number): number {
  return value * Math.PI / 180;
}

/**
 * Converts the provided value from radian into degree
 * @param value - The radian value to convert
 */
export function radianToDegree(value: number): number {
  return value * 180 / Math.PI;
}

/**
 * Generates a halton sequence
 */
export function haltonSequence(index: number, radix: number): number {
  let result = 0.0;
  let fraction = 1.0 / radix;
  while (index > 0) {
    result = result + ((index % radix) * fraction);
    index = (index / radix) | 0;
    fraction = fraction / radix;
  }
  return result;
}

/**
 * Encode the provided utf-8 string into a buffer
 * @param string - The utf-8 string to encode
 */
export function encodeUTF8(text: string): Uint8Array {
  return TEXT_ENCODER_UTF8.encode(text);
}

/**
 * Decode the provided buffer into a utf-8 string
 * @param buffer - The buffer to decode
 * @param length - An optional maximum length
 */
export function decodeUTF8(buffer: Uint8Array, length: number = -1): string {
  return TEXT_DECODER_UTF8.decode(length !== -1 ? buffer.subarray(0, length) : buffer);
}

/**
 * Decode the provided buffer into a utf-16 string
 * @param buffer - The buffer to decode
 * @param length - An optional maximum length
 */
export function decodeUTF16(buffer: Uint8Array, length: number = -1): string {
  return TEXT_DECODER_UTF16.decode(length !== -1 ? buffer.subarray(0, length) : buffer);
}

/**
 * Decode the provided buffer into a utf-8 string until the given stop character was found
 * @param buffer - The buffer to decode
 * @param offset - Offset into the buffer to decode
 * @param stopCharacter - Decode until the stop character was found
 */
export function decodeUTF8Until(buffer: Uint8Array, offset: number, stopCharacter: string): string {
  const data = [];
  const viewU8 = new Uint8Array(buffer);
  const stopCharacterCode = stopCharacter.charCodeAt(0x0);
  for (let ii = 0; true; ++ii) {
    const cc = viewU8[offset + ii];
    if (cc === stopCharacterCode) break;
    data.push(String.fromCharCode(cc));
  }
  return data.join("");
}

/**
 * Convert the provided buffer into a base64 representation
 * @param buffer - The binary buffer to convert
 */
export function binaryToBase64(buffer: ArrayBuffer): string {
  let str = "";
  const viewU8 = new Uint8Array(buffer);
  for (let ii = 0; ii < viewU8.length; ++ii) {
    str += String.fromCharCode(viewU8[ii]);
  }
  return btoa(str);
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

/**
 * Convert the provided base64 data into a binary representation
 * @param data - The base64 data to convert
 */
export function base64ToBinary(data: string): Uint8Array {
  const str = atob(data);
  const buffer = new Uint8Array(str.length);
  for (let ii = 0; ii < str.length; ++ii) buffer[ii] = str.charCodeAt(ii);
  return buffer;
}

/**
 * Converts the provided base64 image data into a binary object
 * @param data - The base64 encoded image data to convert
 */
export function base64ToImage(data: IBinaryImage): Promise<any> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = (): void => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      resolve({
        data: new Uint8Array(imgData.data.buffer),
        width: img.width,
        height: img.height,
      });
    };
    img.src = `data:image/png;base64,${data}`;
  });
}

/**
 * Parse the provided wavefront file
 * @param txt - The wavefront file data
 */
export function parseWavefrontFile(txt: string): IWavefrontObject {
  const vertexData: [number, number, number][] = [[0.0, 0.0, 0.0]];
  const normalData: [number, number, number][] = [[0.0, 0.0, 0.0]];
  const uvData: [number, number][] = [[0.0, 0.0]];
  const vertexIndices: [number, number, number][] = [];
  const normalIndices: [number, number, number][] = [];
  const uvIndices: [number, number, number][] = [];
  // Parse data
  const lines = txt.split("\n");
  for (let ii = 0; ii < lines.length; ++ii) {
    const line = lines[ii].trim().replace(/ +(?= )/g, ``).split(` `);
    const keyword = line[0].trim();
    // Vertex
    if (keyword === `v`) {
      const x = parseFloat(line[1]);
      const y = parseFloat(line[2]);
      const z = parseFloat(line[3]);
      vertexData.push([
        !Number.isNaN(x) ? x: 0.0,
        !Number.isNaN(y) ? y: 0.0,
        !Number.isNaN(z) ? z: 0.0
      ]);
    }
    // Normal
    else if (keyword === `vn`) {
      const x = parseFloat(line[1]);
      const y = parseFloat(line[2]);
      const z = parseFloat(line[3]);
      normalData.push([
        !Number.isNaN(x) ? x: 0.0,
        !Number.isNaN(y) ? y: 0.0,
        !Number.isNaN(z) ? z: 0.0
      ]);
    }
    // Texture coordinate
    else if (keyword === `vt`) {
      const u = parseFloat(line[1]);
      const v = parseFloat(line[2]);
      uvData.push([
        !Number.isNaN(u) ? u: 0.0,
        !Number.isNaN(v) ? v: 0.0
      ]);
    }
    // Face
    else if (keyword === `f`) {
      const vIndices: number[] = [];
      const nIndices: number[] = [];
      const tIndices: number[] = [];
      // Grab each vertex
      for (let v = 1; v <= (line.length - 1); v++) {
        const indices = line[v].split("/");
        // Parse indices in vertex//uv//normal order
        vIndices.push(parseInt(indices[0]) | 0);
        nIndices.push(parseInt(indices[2]) | 0);
        tIndices.push(parseInt(indices[1]) | 0);
      }
      // Quad face
      if (vIndices.length === 4) {
        vertexIndices.push([vIndices[0], vIndices[1], vIndices[2]]);
        vertexIndices.push([vIndices[2], vIndices[3], vIndices[0]]);
        normalIndices.push([nIndices[0], nIndices[1], nIndices[2]]);
        normalIndices.push([nIndices[2], nIndices[3], nIndices[0]]);
        uvIndices.push([tIndices[0], tIndices[1], tIndices[2]]);
        uvIndices.push([tIndices[2], tIndices[3], tIndices[0]]);
      }
      // Triangle face
      else if (vIndices.length == 3) {
        vertexIndices.push([vIndices[0], vIndices[1], vIndices[2]]);
        normalIndices.push([nIndices[0], nIndices[1], nIndices[2]]);
        uvIndices.push([tIndices[0], tIndices[1], tIndices[2]]);
      }
    }
  }

  const vertices = new Float32Array(vertexIndices.length * 3 * 3);
  const normals = new Float32Array(normalIndices.length * 3 * 3);
  const uvs = new Float32Array(uvIndices.length * 3 * 2);
  const indices = new Uint32Array(vertexIndices.length * 3);
  // Loop through triangles
  for (let ii = 0; ii < vertexIndices.length; ++ii) {
    // Resolve triangle indices
    const vertexIndex = vertexIndices[ii];
    const normalIndex = normalIndices[ii];
    const uvIndex = uvIndices[ii];
    // Fill vertices
    vertices[(ii * 3 * 3) + 0] = vertexData[vertexIndex[0]][0];
    vertices[(ii * 3 * 3) + 1] = vertexData[vertexIndex[0]][1];
    vertices[(ii * 3 * 3) + 2] = vertexData[vertexIndex[0]][2];
    vertices[(ii * 3 * 3) + 3] = vertexData[vertexIndex[1]][0];
    vertices[(ii * 3 * 3) + 4] = vertexData[vertexIndex[1]][1];
    vertices[(ii * 3 * 3) + 5] = vertexData[vertexIndex[1]][2];
    vertices[(ii * 3 * 3) + 6] = vertexData[vertexIndex[2]][0];
    vertices[(ii * 3 * 3) + 7] = vertexData[vertexIndex[2]][1];
    vertices[(ii * 3 * 3) + 8] = vertexData[vertexIndex[2]][2];
    // Fill normals
    normals[(ii * 3 * 3) + 0] = normalData[normalIndex[0]][0];
    normals[(ii * 3 * 3) + 1] = normalData[normalIndex[0]][1];
    normals[(ii * 3 * 3) + 2] = normalData[normalIndex[0]][2];
    normals[(ii * 3 * 3) + 3] = normalData[normalIndex[1]][0];
    normals[(ii * 3 * 3) + 4] = normalData[normalIndex[1]][1];
    normals[(ii * 3 * 3) + 5] = normalData[normalIndex[1]][2];
    normals[(ii * 3 * 3) + 6] = normalData[normalIndex[2]][0];
    normals[(ii * 3 * 3) + 7] = normalData[normalIndex[2]][1];
    normals[(ii * 3 * 3) + 8] = normalData[normalIndex[2]][2];
    // Fill uvs
    uvs[(ii * 3 * 2) + 0] = uvData[uvIndex[0]][0];
    uvs[(ii * 3 * 2) + 1] = uvData[uvIndex[0]][1];
    uvs[(ii * 3 * 2) + 2] = uvData[uvIndex[1]][0];
    uvs[(ii * 3 * 2) + 3] = uvData[uvIndex[1]][1];
    uvs[(ii * 3 * 2) + 4] = uvData[uvIndex[2]][0];
    uvs[(ii * 3 * 2) + 5] = uvData[uvIndex[2]][1];
    // Fill indices
    indices[(ii * 3) + 0] = (ii * 3) + 0;
    indices[(ii * 3) + 1] = (ii * 3) + 1;
    indices[(ii * 3) + 2] = (ii * 3) + 2;
  }

  return {vertices, normals, uvs, indices};
}

/**
 * Parse the provided binvox file
 * @param buffer - The binvox file data
 */
export function parseBinaryVoxelFile(buffer: ArrayBuffer): IBinVoxFile {
  let offset = 0x0;
  const reader = new DataView(buffer);
  const viewU8 = new Uint8Array(buffer);

  const magic = decodeUTF8(viewU8.subarray(offset, offset + 0x8)); offset += 0x8;
  if (magic !== `#binvox `) {
    throw new Error(`Invalid signature, expected '#binvox' but got '${magic}'`);
  }

  const version = parseInt(decodeUTF8(viewU8.subarray(offset, offset + 0x1))); offset += 0x1;
  if (version !== 1) {
    throw new Error(`Invalid version, expected '1' but got '${version}'`);
  }
  offset++; // Skip new line

  // Parse keyword dim
  const kDim = decodeUTF8Until(viewU8, offset, `\n`);
  if (kDim.substr(0, 3) !== `dim`) {
    throw new Error(`Invalid keyword, expected 'dim' but got '${kDim.substr(0, 3)}'`);
  }
  offset += kDim.length;
  offset++; // Skip new line

  // Parse keyword normalization translation
  const kTranslate = decodeUTF8Until(viewU8, offset, `\n`);
  if (kTranslate.substr(0, 9) !== `translate`) {
    throw new Error(`Invalid keyword, expected 'translate' but got '${kTranslate.substr(0, 9)}'`);
  }
  offset += kTranslate.length;
  offset++; // Skip new line

  // Parse keyword normalization scale
  const kScale = decodeUTF8Until(viewU8, offset, `\n`);
  if (kScale.substr(0, 5) !== `scale`) {
    throw new Error(`Invalid keyword, expected 'scale' but got '${kScale.substr(0, 5)}'`);
  }
  offset += kScale.length;
  offset++; // Skip new line

  // Parse keyword data section
  const kData = decodeUTF8(viewU8.subarray(offset, offset + 0x4));
  if (kData !== `data`) {
    throw new Error(`Invalid keyword, expected 'data' but got '${kData}'`);
  }
  offset += kData.length;
  offset++; // Skip new line

  // Parse resolution
  const [depth, width, height] = kDim.substr(4).split(" ").map(d => parseInt(d));
  const resolution = Math.floor((depth + width + height) / 3);

  // Make sure resolutions match
  if (depth !== width || depth !== height || width !== height) {
    throw new RangeError(`Invalid resolution, boundings must be equal but got '${depth}', '${width}', '${height}'`);
  }

  // Parse translation
  const translation = kTranslate.substr(10).split(" ").map(t => parseFloat(t));
  // Parse scaling
  const scaling = parseFloat(kScale.substr(6));

  const voxels = new Uint8Array(resolution * resolution * resolution * 4);

  // Parse voxel data
  let index = 0;
  while (offset !== viewU8.byteLength) {
    const value = reader.getUint8(offset); offset++;
    const count = reader.getUint8(offset); offset++;
    // Deflatten voxel data
    if (value === 1) {
      for (let ii = 0; ii < count; ++ii) {
        const x = Math.floor(index / (resolution * resolution));
        const y = Math.floor(((index - x) * resolution * resolution) / resolution);
        const z = Math.floor(((index - x) * resolution * resolution) - (y * resolution));
        const writeIndex = (y * width * height) + (z * width) + x;
        const writeIndex4 = writeIndex * 4;
        voxels[writeIndex4 + 0] = 0xFF;
        voxels[writeIndex4 + 1] = 0x0;
        voxels[writeIndex4 + 2] = 0xFF;
        voxels[writeIndex4 + 3] = 0xFF;
        index++;
      }
    } else {
      index += count;
    }
  }

  return {
    data: voxels,
    resolution: resolution,
    scale: new Float32Array([scaling, scaling, scaling]),
    translation: new Float32Array(translation)
  };
}

/**
 * Parse the provided HDR file
 * @param input - The HDR file data buffer
 */
export function parseHDRFile(input: Uint8Array): IEnvironmentImage {
  const RX_DIMENSIONS = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/;

  let width = 0;
  let height = 0;

  let pos = 0;
  let line = null;
  let match = null;
  // Parse data
  while (true) {
    const chunkSize = 128;
    const lineLimit = 1024;
    let p = pos;
    let i = -1;
    let len = 0;
    let s = "";
    let chunk = String.fromCharCode.apply(null, Array.from(new Uint16Array(input.subarray(p, p + chunkSize))));
    while (0 > (i = chunk.indexOf(`\n`)) && len < lineLimit && p < input.byteLength) {
      s += chunk;
      len += chunk.length;
      p += chunkSize;
      chunk += String.fromCharCode.apply(null, Array.from(new Uint16Array(input.subarray(p, p + chunkSize))));
    }
    if (-1 < i) {
      pos += len + i + 1;
      line = s + chunk.slice(0, i);
    } else {
      break;
    }
    // Ignore comments
    if (`#` === line.charAt(0)) {
      continue;
    }
    // Parse image dimensions
    if (match = RX_DIMENSIONS.exec(line)) {
      height = parseInt(match[1], 10);
      width = parseInt(match[2], 10);
    }
  }

  let decompressed = null;
  const compressed = input.subarray(pos);
  // No decompression required
  if (
    (width < 8 || width > 0x7fff) ||
    (compressed[0] !== 2 || compressed[1] !== 2 || compressed[2] & 0x80)
  ) {
    decompressed = new Uint8Array(compressed);
  }
  // RLE decompression
  else {
    decompressed = new Uint8Array(4 * width * height);

    const rgbeStart = new Uint8Array(4);
    const scanlineBuffer = new Uint8Array(4 * width);

    let pos = 0;
    let baseOffset = 0;
    let scanlineCount = height;
    while (scanlineCount > 0 && pos < compressed.byteLength) {
      rgbeStart[0] = compressed[pos++];
      rgbeStart[1] = compressed[pos++];
      rgbeStart[2] = compressed[pos++];
      rgbeStart[3] = compressed[pos++];

      let ptr = 0;
      let count = 0;
      while (ptr < (4 * width) && pos < compressed.byteLength) {
        count = compressed[pos++];
        if (count > 128) {
          count -= 128;
          const byteValue = compressed[pos++];
          for (let ii = 0; ii < count; ++ii) {
            scanlineBuffer[ptr++] = byteValue;
          }
        } else {
          scanlineBuffer.set(compressed.subarray(pos, pos + count), ptr);
          ptr += count;
          pos += count;
        }
      }

      for (let ii = 0; ii < width; ++ii) {
        let offset = 0;
        decompressed[baseOffset] = scanlineBuffer[ii + offset];
        offset += width;
        decompressed[baseOffset + 1] = scanlineBuffer[ii + offset];
        offset += width;
        decompressed[baseOffset + 2] = scanlineBuffer[ii + offset];
        offset += width;
        decompressed[baseOffset + 3] = scanlineBuffer[ii + offset];
        baseOffset += 4;
      }

      scanlineCount--;
    }
  }

  // Convert from 8-bit RGBE into 32-bit float RGBA
  const numElements = (decompressed.length / 4) * 4;
  const output = new Float32Array(numElements);
  for (let ii = 0; ii < numElements; ii++) {
    const srcIndex = (ii * 4);
    const dstIndex = (ii * 4);
    const scale = Math.pow(2.0, decompressed[srcIndex + 3] - 128.0) / 255.0;
    output[dstIndex + 0] = decompressed[srcIndex + 0] * scale;
    output[dstIndex + 1] = decompressed[srcIndex + 1] * scale;
    output[dstIndex + 2] = decompressed[srcIndex + 2] * scale;
    output[dstIndex + 3] = 1.0;
  }

  return {data: output, width, height};
}
