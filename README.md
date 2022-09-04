# voxelchain-formats

A collection of tools to work with the [VoxelChain](https://voxelchain.app/) file formats

### Documentation:
The documentation is auto-generated and can be found [here](https://voxelchain.github.io/voxelchain-formats/).

### Installation:
Package installation:
````
npm install voxelchain-formats
````

### Example:
````ts
import * as VoxelChainFormats from "voxelchain-formats";

// Load a .vxwo binary
fetch("world.vxwo").then(resp => resp.arrayBuffer()).then(buffer => {
  // Create an uint8 view into the buffer
  const binary = new Uint8Array(buffer);
  // Decompress the binary data
  const decompressed = VoxelChainFormats.decompressGZIP(binary);
  // Parse the binary data
  const parsed = VoxelChainFormats.parseVXWOFile(decompressed);
  console.log("Parsed world:", parsed);
  // Compile the parsed world back into binary
  const compiled = VoxelChainFormats.compileVXWOFile(parsed);
  // Compress the binary data
  const compressed = VoxelChainFormats.compressGZIP(binary);
  console.log("Re-compiled world:", compressed);
});

````
