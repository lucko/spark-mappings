# spark-mappings

The 'compiled' mappings are in `/dist/`.

The code in `/protogen/` is used to generate (smaller/more efficient) protobuf binary data from the input JSON. The protobuf files use the `.wasm` extension, although they are not web-assembly files, to trick GitHub Pages into serving them compressed.
