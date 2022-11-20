// @ts-ignore
import {inflate} from "pako";

const SECTOR_SIZE = 4096;

const UTF8_DECODER = new TextDecoder("utf-8");

interface IReadState {
  byteOffset: number;
}

export enum MCA_TAG {
  TAG_END,
  TAG_BYTE,
  TAG_SHORT,
  TAG_INT,
  TAG_LONG,
  TAG_FLOAT,
  TAG_DOUBLE,
  TAG_BYTE_ARRAY,
  TAG_STRING,
  TAG_LIST,
  TAG_COMPOUND,
  TAG_INT_ARRAY,
  TAG_LONG_ARRAY,
}

export interface IMCATag {
  tag: MCA_TAG;
  name: string;
  value: any;
}

function parseTag(buffer: Uint8Array, state: IReadState, nextTag?: number): IMCATag {
  const reader = new DataView(buffer.buffer);
  let tag = 0;
  let name = "";
  // Tag
  if (nextTag === undefined) {
    tag = reader.getUint8(state.byteOffset);
    state.byteOffset += Uint8Array.BYTES_PER_ELEMENT;
  }
  // Name
  if (nextTag === undefined) {
    name = "";
    if (tag !== MCA_TAG.TAG_END) {
      const length = reader.getUint16(state.byteOffset); state.byteOffset += Uint16Array.BYTES_PER_ELEMENT;
      name = UTF8_DECODER.decode(buffer.subarray(state.byteOffset, state.byteOffset + length)).toUpperCase();
      state.byteOffset += length * Uint8Array.BYTES_PER_ELEMENT;
    }
  }
  const data: IMCATag = {
    tag: nextTag || tag,
    name: name,
    value: null,
  };
  // Read value
  let value = null;
  switch (data.tag) {
    case MCA_TAG.TAG_END: {
      value = null;
    } break;
    case MCA_TAG.TAG_BYTE: {
      value = reader.getInt8(state.byteOffset); state.byteOffset += Int8Array.BYTES_PER_ELEMENT;
    } break;
    case MCA_TAG.TAG_SHORT: {
      value = reader.getInt16(state.byteOffset); state.byteOffset += Int16Array.BYTES_PER_ELEMENT;
    } break;
    case MCA_TAG.TAG_INT: {
      value = reader.getInt32(state.byteOffset); state.byteOffset += Int32Array.BYTES_PER_ELEMENT;
    } break;
    case MCA_TAG.TAG_LONG: {
      value = reader.getBigInt64(state.byteOffset, true); state.byteOffset += BigInt64Array.BYTES_PER_ELEMENT;
    } break;
    case MCA_TAG.TAG_FLOAT: {
      value = reader.getFloat32(state.byteOffset); state.byteOffset += Float32Array.BYTES_PER_ELEMENT;
    } break;
    case MCA_TAG.TAG_DOUBLE: {
      value = reader.getFloat64(state.byteOffset); state.byteOffset += Float64Array.BYTES_PER_ELEMENT;
    } break;
    case MCA_TAG.TAG_BYTE_ARRAY: {
      value = [];
      const length = reader.getInt32(state.byteOffset); state.byteOffset += Int32Array.BYTES_PER_ELEMENT;
      for (let ii = 0; ii < length; ++ii) {
        const v = reader.getInt8(state.byteOffset); state.byteOffset += Int8Array.BYTES_PER_ELEMENT;
        value.push(v);
      }
    } break;
    case MCA_TAG.TAG_STRING: {
      value = "";
      const length = reader.getUint16(state.byteOffset); state.byteOffset += Uint16Array.BYTES_PER_ELEMENT;
      value = UTF8_DECODER.decode(buffer.subarray(state.byteOffset, state.byteOffset + length));
      state.byteOffset += length * Uint8Array.BYTES_PER_ELEMENT;
    } break;
    case MCA_TAG.TAG_LIST: {
      value = [];
      const nextTag = reader.getUint8(state.byteOffset); state.byteOffset += Uint8Array.BYTES_PER_ELEMENT;
      const length = reader.getUint32(state.byteOffset); state.byteOffset += Uint32Array.BYTES_PER_ELEMENT;
      for (let ii = 0; ii < length; ++ii) {
        const next = parseTag(buffer, state, nextTag);
        value.push(next);
      }
    } break;
    case MCA_TAG.TAG_COMPOUND: {
      value = [];
      let compound = null;
      while (true) {
        compound = parseTag(buffer, state);
        value.push(compound);
        if (compound.tag === MCA_TAG.TAG_END) break;
      }
    } break;
    case MCA_TAG.TAG_INT_ARRAY: {
      const length = reader.getInt32(state.byteOffset); state.byteOffset += Int32Array.BYTES_PER_ELEMENT;
      value = new Int32Array(length);
      for (let ii = 0; ii < length; ++ii) {
        value[ii] = reader.getInt32(state.byteOffset); state.byteOffset += Int32Array.BYTES_PER_ELEMENT;
      }
    } break;
    case MCA_TAG.TAG_LONG_ARRAY: {
      //const length = reader.getInt32(state.byteOffset); state.byteOffset += Int32Array.BYTES_PER_ELEMENT;
      //value = new Int32Array(length * 2);
      //for (let ii = 0; ii < length * 2; ++ii) {
      //  value[ii] = reader.getInt32(state.byteOffset); state.byteOffset += Int32Array.BYTES_PER_ELEMENT;
      //}
      const length = reader.getInt32(state.byteOffset); state.byteOffset += Int32Array.BYTES_PER_ELEMENT;
      value = new BigInt64Array(length);
      for (let ii = 0; ii < length; ++ii) {
        value[ii] = reader.getBigInt64(state.byteOffset); state.byteOffset += BigInt64Array.BYTES_PER_ELEMENT;
      }
    } break;
  }
  data.value = value;
  return data;
}

/**
 * Represents a parsed .mca file
 */
export interface IMCAFile {
  data: Uint16Array;
  width: number;
  height: number;
  depth: number;
}

/**
 * Parse the provided mca file
 * @param buffer - The mca file data
 */
export function parseMCAFile(buffer: Uint8Array): any {
  const nbts = [];
  const reader = new DataView(buffer.buffer);
  for (let ii = 0; ii < SECTOR_SIZE; ii += 4) {
    const slice = new Uint8Array([0, buffer[ii + 0], buffer[ii + 1], buffer[ii + 2]]);
    const offset = new DataView(slice.buffer).getUint32(0x0) * SECTOR_SIZE;
    const count = reader.getUint8(ii + 3) * SECTOR_SIZE;
    let byteOffset = offset;
    const length = reader.getUint32(byteOffset); byteOffset += Uint32Array.BYTES_PER_ELEMENT;
    const compressionType = reader.getUint8(byteOffset); byteOffset += Uint8Array.BYTES_PER_ELEMENT;
    const compressed = buffer.subarray(byteOffset, byteOffset + length - 1);
    let uncompressed = null;
    switch (compressionType) {
      case 0: {
        uncompressed = compressed;
      } break;
      case 1: case 2: {
        try {
          uncompressed = inflate(compressed);
        } catch (e) {
          uncompressed = compressed;
        }
      } break;
    }
    const data = parseTag(uncompressed, {byteOffset: 0x0});
    nbts.push(data);
  }
  return nbts as any;
}
