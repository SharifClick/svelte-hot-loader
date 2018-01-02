const loaderUtils = require('loader-utils');

function loadHmr(file) {
  return `
        var component = require(${file});
        var hotify = require('svelte-hot-loader/lib/hotify');

        var extendedComponent = component;

        /* hot reload */
        if (module.hot) {
          extendedComponent = hotify.register(${file}, component.default);
          module.hot.accept(${file}, function() {
            setTimeout(function(){
              var newComponent = require(${file});
              hotify.reload(${file}, newComponent.default);
            }, 1)
          });
        }


        module.exports = extendedComponent;
    `;

}


module.exports = function load() {
};
module.exports.pitch = function pitch(remainingRequest) {
  const file = loaderUtils.stringifyRequest(this, '!!' + remainingRequest);
  const isProduction = this.minimize || process.env.NODE_ENV === 'production';

  if (this.cacheable) {
    this.cacheable();
  }

  if (isProduction) {
    return `module.exports = require(${file});`;
  }

  return loadHmr(file);
};