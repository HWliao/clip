var ref = require('ref');
var ffi = require('ffi');
var iconv = require('iconv-lite');
console.log('x' + 1);
var kernel32 = new ffi.Library('kernel32', {
  GlobalSize: ['ulong', ['ulong']],
  GlobalLock: ['pointer', ['ulong']],
  GlobalUnlock: ['int8', ['ulong']],
  GlobalAlloc: ['ulong', ['uint', 'ulong']],
});
console.log('x' + 2);
var user32 = new ffi.Library('user32', {
  OpenClipboard: ['int8', ['ulong']],
  CloseClipboard: ['int8', []],
  EmptyClipboard: ['int8', []],
  SetClipboardData: ['ulong', ['uint', 'ulong']],
  GetClipboardData: ['ulong', ['uint']],
  EnumClipboardFormats: ['uint', ['uint']],
  CountClipboardFormats: ['int', []],
  GetClipboardFormatNameA: ['int', ['uint', ref.types.CString, 'int']],
  RegisterClipboardFormatA: ['uint', ['string']],
  //AddClipboardFormatListener:    ['int8',  { hwnd: 'ulong' }],
  //RemoveClipboardFormatListener: ['int8',  { hwnd: 'ulong' }],
  //SetClipboardViewer:            ['ulong', { hWndNewViewer: 'ulong' }],
  //ChangeClipboardChain:          ['int8',  { hWndRemove: 'ulong', hWndNewNext: 'ulong'}]
});
console.log('x' + 3);
var shell32 = new ffi.Library('Shell32', {
  DragQueryFileA: ['uint', ['pointer', 'uint', ref.types.CString, 'uint']]
});

console.log('x' + 4);
// 内存属性
// GMEM_FIXED
// 分配一块固定的内存区域，不允许系统移动，这时返回值是一个指针。
// GMEM_MOVEABLE
// 分配一块可移动的内存区域，实际上内存块在物理内存中是不可移动的，这里的可移动指的是在应用程序的默认逻辑堆内可以移动。返回值是内存对象的句柄。可以通过调研GlobalLock()函数将一个句柄转化为一个指针，这个标志不能喝GMEM_FIXED 同时使用
// GMEM_ZEROINT
// 初始化内存对象为全0，如果不用这个标志，内存对象将为不确定的内容
// GHND
// GMEM_MOVEABLE和GMEM_ZEROINT块标志联合使用，即可移动同时初始化为0
// GPTR
// GMEM_FIXED和GMEM_ZEROINT标志联合使用，即不可移动同时初始化为0
var GMEM = {
  FIXED: 0x0000,
  MOVEABLE: 0x0002,
  ZEROINIT: 0x0040,
};
// 标准剪贴簿数据格式
// Windows支持不同的预先定义剪贴簿格式， 这些格式在WINUSER.H定义成以CF为前缀的标识符。
// 三种能够储存在剪贴簿上的文字数据型态:
// CF_TEXT        以NULL结尾的ANSI字符集字符串。它在每行末尾包含一个carriage  return和linefeed字符，这是最简单的剪贴簿数据格式。
// CF_OEMTEXT     含有文字数据（与CF_TEXT类似）的内存块。但是它使用的是OEM字符集。
// CF_UNICODETEXT 含有Unicode文字的内存块。与CF_TEXT类似，它在每一行的末尾包含一个carriage  return和linefeed字符，以及一个NULL字符（两个0字节）以表示数据结束。CF_UNICODETEXT只支援Windows NT。
// 两种附加的剪贴簿格式、但是它们不需要以NULL结尾，因为格式已经定义了数据的结尾。
// CF_SYLK        包含Microsoft 「符号连结」数据格式的整体内存块。这种格式用在Microsoft的Multiplan、Chart和Excel程序之间交换数据，它是一种ASCII码格式。
// CF_DIF         包含数据交换格式(DIF)之数据的整体内存块。用于把数据送到VisiCalc电子表格程序中。这也是一种ASCII码格式
// 下面三种剪贴簿格式与位图有关。所谓位图就是数据位的矩形数组
// CF_BITMAP      与设备相关的位图格式。位图是通过位图句柄传送给剪贴簿的。
// CF_DIB         定义一个设备无关位图的内存块。
// CF_PALETTE     调色盘句柄。
// 下面是两个metafile格式、metafile就是一个以二进制格式储存的画图命令集
// CF_METAFILEPICT  以旧的metafile格式存放的「图片」 。
// CF_ENHMETAFILE   增强型metafile（32位Windows支持的）句柄。
// 最后介绍几个混合型的剪贴簿格式：
// CF_PENDATA与Windows的笔式输入扩充功能联合使用。
// CF_WAVE声音（波形）文件。
// CF_RIFF使用资源交换文件格式（Resource Interchange File Format）的多媒体数据。
// CF_HDROP与拖放服务相关的文件列表。
var CF = {
  TEXT: 1,
  BITMAP: 2,
  METAFILEPICT: 3,
  SYLK: 4,
  DIF: 5,
  TIFF: 6,
  OEMTEXT: 7,
  DIB: 8,
  PALETTE: 9,
  PENDATA: 10,
  RIFF: 11,
  WAVE: 12,
  UNICODETEXT: 13,
  ENHMETAFILE: 14,
  HDROP: 15,
  LOCALE: 16,
  DIBV5: 17,
  MAX: 18,
  OWNERDISPLAY: 0x0080,
  DSPTEXT: 0x0081,
  DSPBITMAP: 0x0082,
  DSPMETAFILEPICT: 0x0083,
  DSPENHMETAFILE: 0x008E,
  PRIVATEFIRST: 0x0200,
  PRIVATELAST: 0x02FF,
  GDIOBJFIRST: 0x0300,
  GDIOBJLAST: 0x03FF,
};

exports.read = function () {
  var oint = user32.OpenClipboard(ref.NULL);
  console.log(oint);
  if (oint) {
    var obj = user32.GetClipboardData(CF.TEXT);
    var CString = kernel32.GlobalLock(obj);
    kernel32.GlobalUnlock(obj);
    console.log(ref.readCString(CString, 0));
  } else {
    console.log(6);
    console.log(oint);
  }
  user32.CloseClipboard();
};
exports.count = function () {
  console.log(user32.CountClipboardFormats());
};
exports.enu = function () {
  var format = 0;
  var collected = [];
  collected.next = function () {
    format = user32.EnumClipboardFormats(format) || null;
    if (format) collected.push(format);
    else collected.next = function depleted() {
    };
    return format;
  };
  var oint = user32.OpenClipboard(ref.types.NULL);
  while (collected.next()) {

  }
  user32.CloseClipboard();
  console.log(collected);
};
exports.readAll = function () {
  var format = 0;
  var collected = [];
  var values = [];
  var sizes = [];
  collected.next = function () {
    format = user32.EnumClipboardFormats(format) || null;
    if (format) collected.push(format.toString(16));
    else collected.next = function depleted() {
    };
    return format;
  };
  var x = 0;
  user32.OpenClipboard(ref.NULL);
  while (x = collected.next()) {
    var v = user32.GetClipboardData(x);
    sizes.push(v);
    var vv = kernel32.GlobalLock(v);
//    if (ref.isNull(vv)) {
//      values.push(null);
//    } else {
    values.push(vv);
//    }
//    sizes.push(kernel32.GlobalSize(v));
    kernel32.GlobalUnlock(v);
  }
  user32.CloseClipboard();
  console.log(collected);
  console.log(values);
  console.log(sizes);
  return values;
};
exports.readFormatNames = function () {
  var format = 0;
  var collected = [];
  var names = [];
  var values = [];
  collected.next = function () {
    format = user32.EnumClipboardFormats(format) || null;
    if (format) collected.push(format);
    else collected.next = function depleted() {
    };
    return format;
  };
  var x = 0;
  user32.OpenClipboard(ref.NULL);
  while (x = collected.next()) {
    var tmp = Buffer.alloc(512);
    tmp.type = ref.types.CString;
    var i = user32.GetClipboardFormatNameA(x, tmp, 512);
    names.push(tmp);
    console.log(tmp.readCString());
    var globalHandle = user32.GetClipboardData(x);
    var buf = kernel32.GlobalLock(globalHandle);
    if (x === CF.HDROP) {
      var out = Buffer.alloc(512);
      out.type = ref.types.CString;
      console.log('----->');
      var filesLength = shell32.DragQueryFileA(buf, 0xFFFFFFFF, out, 512);
      console.log('total files :%d', filesLength);
      for (var j = 0; j <= filesLength; j++) {
        var charNums = shell32.DragQueryFileA(buf, j, ref.types.NULL, 0);
        console.log('the %d filename size:%d', j, charNums);
        var fileNameP = Buffer.alloc(charNums);
        fileNameP.type = ref.types.CString;
        shell32.DragQueryFileA(buf, j, fileNameP, charNums);
        var characterBuffer = ref.reinterpretUntilZeros(fileNameP, 1);
        console.log('the %d filename:%s', j, iconv.decode(characterBuffer, 'GBK'));
      }
      console.log('----->');
    }
    values.push(buf);
    kernel32.GlobalUnlock(globalHandle);

  }
  user32.CloseClipboard();
  console.log(collected);
  console.log(names);
  return values;
};