var fs = require('fs')
  , path = require('path');

function getHeadRef(dir){
  var head = path.join(dir, '.git', 'HEAD');
  var content = fs.readFileSync(head).toString();
  return content.split(':')[1].trim();
}

function getBranchRef(dir, branch){
  var head = path.join(dir, '.git/refs/heads', branch);
  return fs.existsSync(head) ? 'refs/heads/' + branch : undefined;
}

function readRef(dir, ref){
  var head = path.join(dir, '.git', ref);
  var content = fs.readFileSync(head).toString();
  return content.substr(0, 8);
}

module.exports = function(dir, branch){
  try{
    var ref = branch === undefined ? getHeadRef(dir) : getBranchRef(dir, branch);
    if(ref === undefined) return "";
    return readRef(dir, ref);
  }catch(e){
    return undefined;
  }
}
