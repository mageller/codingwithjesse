exports.query = function() {
  return new Promise(function(resolve, reject) {
    resolve([{value: '5'}]);
  });
};

exports.init = function(config) {

}