# Data

An open-source action game for Windows and macOS.

[Download Data](https://indrolend.com)

## License

[AGPL-3.0](LICENSE). Fork it, change it, and run your own server.

Some runtime media is not included in this repository. See
[Runtime assets](ASSETS_REQUIRED.md).

## Build

```sh
cmake -S native-desktop -B build/desktop-release -DCMAKE_BUILD_TYPE=Release
cmake --build build/desktop-release --config Release --parallel
ctest --test-dir build/desktop-release -C Release --output-on-failure
```
