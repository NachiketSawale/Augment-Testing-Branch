/**
 * Created by zov on 11/14/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.common';
    /**
     * @ngdoc service
     * @name ppsCommonLoggingUndefinedFieldProcessorFactory
     * @function
     * @requires
     *
     * @description
     * this processor is to solve validation issue
     * code as below: (control-validation.js line:29)
     *      _.get(entity, field, modelValue)
     * if entity without property named the same as field, the return value is modelValue
     *
     * for the modification 
     */
    angular.module(moduleName).factory('ppsCommonLoggingUndefinedFieldProcessorFactory', undefinedFieldProcessorFactory);
    undefinedFieldProcessorFactory.$inject = ['ppsCommonLoggingConstant', 'platformSchemaService'];
    function undefinedFieldProcessorFactory(ppsCommonLoggingConstant, platformSchemaService) {
        var cache = {};

        function createProcessor(schemaOption) {

            var scheme = platformSchemaService.getSchemaFromCache(schemaOption);
            var propNames = Object.getOwnPropertyNames(scheme.properties);

            return {
                processItem: function (item) {
                    if (item) {
                        propNames.forEach(function (propName) {
                            if (!angular.isDefined(item[propName])) {
                                item[propName] = null;
                            }
                        });
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