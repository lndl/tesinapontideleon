var NotarizedFiles = artifacts.require("NotarizedFiles");

module.exports = function(deployer) {
  deployer.deploy(NotarizedFiles);
};