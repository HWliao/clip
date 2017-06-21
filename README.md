# clip
ffi 操作win32剪贴板

see https://github.com/Benvie/node-clipboard

windows cpp 2 dll:
http://blog.csdn.net/qianchenglenger/article/details/21599235
vs c/c++ build tool 2015

nwbuild
````
nw-gyp configure --target=0.14.7 --arch=ia32 --msvs_version=2015 --dist-url=http://127.0.0.1/nw --silly

nw-gyp build --target=0.14.7 --arch=ia32 --silly
````