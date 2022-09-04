# voxelchain-formats

A collection of tools to work with the [VoxelChain](https://voxelchain.app/) file formats

### Documentation:
The documentation is auto-generated and can be found [here](https://voxelchain.github.io/voxelchain-formats/docs).

### Installation:
Package installation:
````
npm install voxelchain-formats
````

### Example:
````ts
import * as VoxelChainFormats from "voxelchain-formats";

// Load and parse binary .vxwo file
fetch("world.vxwo").then(resp => resp.arrayBuffer()).then(buffer => {
  const binary = new Uint8Array(buffer);
  // Decompress the binary data
  const decompressed = VoxelChainFormats.decompressGZIP(binary);
  // Parse the binary data
  const vxwo = VoxelChainFormats.parseVXWOFile(decompressed);
  console.log("World data:", vxwo);
});

````
