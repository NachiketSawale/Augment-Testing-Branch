/**
 * Created by las on 6/13/2018.
 */

(function () {
    'use strict';
    /*global angular, _*/
    angular.module('productionplanning.common').factory('productionplanningCommonDispatcherUIStandardService', ppsCommonDispatcherUIStandardService);

    ppsCommonDispatcherUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningCommonTranslationService'];

    function ppsCommonDispatcherUIStandardService(platformUIStandardConfigService, ppsCommonTranslationService) {

        var dtoScheme = {
                'DescriptionInfo': {'domain': 'translation'}
            },
            basLayout = {
                'fid': 'productionplanning.common.dispatcher.detailform',
                'version': '1.0.0',
                'addValidationAutomatically': true,
                'groups': [
                    {
                        'gid': 'baseGroup',
                        'attributes': []
                    }
                ],
                'overloads': {}
            },

            detailLayout = angular.copy(basLayout);

        _.forEach(dtoScheme, function (property, key) {
            var lProperty = key.toLowerCase();
            detailLayout.groups[0].attributes.push(lProperty);
            detailLayout.overloads[lProperty] = {'readonly': true};
        });

        function StructureUIStandardService(layout, scheme, translateService) {
            platformUIStandardConfigService.call(this, layout, scheme, translateService);
        }

        StructureUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
        StructureUIStandardService.prototype.constructor = StructureUIStandardService;

        return new StructureUIStandardService(detailLayout, dtoScheme, ppsCommonTranslationService);
    }
})(angular);