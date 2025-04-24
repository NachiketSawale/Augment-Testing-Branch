/**
 * Created by zov on 12/23/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).factory('ppsCommonLoggingEntityTypeProcessorFactory', factory);
    factory.$inject = ['ppsCommonLoggingConstant', 'platformSchemaService'];
    function factory(ppsCommonLoggingConstant, platformSchemaService) {
        var cache = {};

        function createProcessor(schemaOption) {

            var scheme = platformSchemaService.getSchemaFromCache(schemaOption);
            var propNames = Object.getOwnPropertyNames(scheme.properties);
            var namesWithType = propNames.filter(function (pName) {
                return pName.toLowerCase().indexOf('typefk') > -1;
            });
            if(scheme.schema.endsWith('.EngTask2ClerkDto')){
               namesWithType = propNames.filter(function (pName) {
                  return pName.toLowerCase().indexOf('clerkrolefk') > -1;
               });
            }

	        return {
                processItem: function (item) {
                    if (item && !item.getType) {
                        item.getType = function () {
                            return namesWithType.length === 1 ? item[namesWithType[0]] : undefined;
                        };
                    }
                }
            };
        }

        function getProcessor(schemaOption) {
            var dtoName = ppsCommonLoggingConstant.SchemaOption2DtoName(schemaOption);
            if(!cache[dtoName]){
                cache[dtoName] = createProcessor(schemaOption);
            }

            return cache[dtoName];
        }

        return {
            getProcessor: getProcessor
        };
    }
})();