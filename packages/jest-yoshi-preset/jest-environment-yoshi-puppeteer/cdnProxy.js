const startRewriteForwardProxy = require('yoshi-helpers/build/rewrite-forward-proxy');
const { getProjectCDNBasePath } = require('yoshi-helpers/utils');
const { servers, experimentalBuildHtml } = require('yoshi-config');

let closeProxy;

module.exports.start = async function start(port) {
  closeProxy = await startRewriteForwardProxy({
    search: getProjectCDNBasePath(experimentalBuildHtml),
    rewrite: servers.cdn.url,
    port,
  });
};

module.exports.stop = async function stop() {
  closeProxy && (await closeProxy());
};
