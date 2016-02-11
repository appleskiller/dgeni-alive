var _ = require('lodash');

/**
 * @dgProcessor generateErrorsGroupArea
 * @description
 * Provides representation for the error and updates error data to match newly created module
 * If matching module is found, no new module is created
 */
module.exports = function generateErrorsGroupArea(log, aliasMap, moduleMap, createDocMessage) {
  return {
    $runAfter: ['moduleDocsProcessor'],
    $runBefore: ['generateComponentGroupsProcessor'],
    $process: function(docs) {
      // walk through the modules, take all error references and provide errors area
      moduleMap.forEach(function(module) {
        docs.push(_(module.components)
          .groupBy('docType')
          .thru(function(groups) {
            if (groups.error) {
              module.components = module.components.filter(function(component) {
                return 'error' !== component.docType;
              });
            }
            return {
              id: module.id + '.error',
              docType: 'module',
              groupType: 'error',
              moduleName: module.name,
              module: module.name,
              moduleDoc: {},
              area: 'error',
              name: module.name,
              components: groups.error
            };
          }).value());
      });
    }
  };
};
