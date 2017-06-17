/**
 * index
 * Created by lenovo on 2017/6/1.
 */
var ffi = require('ffi');

var mydll2 = ffi.Library('./cpp/mydll2.dll', {
  'Add': ['int', ['int', 'int']]
});

var result = mydll2.Add(1, 2);

console.log(result);

