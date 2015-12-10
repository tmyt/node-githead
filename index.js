var fs = require('fs')
  , path = require('path');

function GitHead(dir){
  this.baseDir = dir;
  try{
    fs.statSync(path.join(dir, '.git'));
    this.isBareRepo = false;
  }catch(err){
    this.isBareRepo = true;
  }
}

GitHead.prototype.toRepoPath = function(path){
  return (this.isBareRepo ? '' : '.git/') + path;
}

GitHead.prototype.getHeadRef = function(){
  var head = path.join(this.baseDir, this.toRepoPath('HEAD'));
  var content = fs.readFileSync(head).toString();
  return content.split(':')[1].trim();
}

GitHead.prototype.getBranchRef = function(branch){
  var head = path.join(this.baseDir, this.toRepoPath('refs/heads'), branch);
  return fs.existsSync(head) ? 'refs/heads/' + branch : undefined;
}

GitHead.prototype.readRef = function(ref){
  var head = path.join(this.baseDir, this.toRepoPath(ref));
  var content = fs.readFileSync(head).toString();
  return content.substr(0, 8);
}

module.exports = function(dir, branch){
//  try{
    var head = new GitHead(dir);
    var ref = branch === undefined ? head.getHeadRef() : head.getBranchRef(branch);
    if(ref === undefined) return "";
    return head.readRef(ref);
//  }catch(e){
    return undefined;
//  }
}
