/**
 * Created by alm on 26/9/2023.
 */
/* globals math */

(function (angular, math) {
    'use strict';

    var moduleName = 'basics.material';

    angular.module(moduleName).factory('basicsMaterialCalculationHelper', ['_', 'basicsCommonRoundingService',
        function (_, basicsCommonRoundingService) {
            var globalKeep = 2;
            var basRoundingService = basicsCommonRoundingService.getService('basics.material');
            var service = {};
            service.round = round;
            service.roundingType = basRoundingService.getFieldsRoundType();
            service.basRoundingType = basRoundingService.getBasRoundType();

            function round(roundingField, beforeRoundingValue) {
                if (!roundingField) {
                    if (_.isNaN(beforeRoundingValue)) {
                        return 0;
                    }
                    var result = math.round(beforeRoundingValue, globalKeep);
                    if (result.isBigNumber) {
                        return result.toNumber();
                    }
                }
                let value = beforeRoundingValue;
                if (typeof beforeRoundingValue === 'object' && beforeRoundingValue.isBigNumber) {
                    value = beforeRoundingValue.toNumber();
                }
                return basRoundingService.doRounding(roundingField, value);
            }

            return service;
        }
    ]);

})(angular, math);
