/**
 * Created by prausa on 3/2/2017.
 */
var Q = require('q');

function sync(){
  var defer = Q.defer();
  console.log('Doing Sync Work');
  defer.resolve('Data-1 From Sync function');
  return defer.promise;
}
function async (err, data) {
  var defer = Q.defer();
  setTimeout(function(){
    console.log('Doing Async Work');
    return defer.resolve('Data-2 From Async function with data=',data,"  Error=",err);
  },2000);
  return defer.promise;
}

sync().then(async).then(function (err, data) {
  console.log("Final data=",data,"  and Error=",err);
})
.catch(function (err) {
  console.log("Error occurred",err);
});
