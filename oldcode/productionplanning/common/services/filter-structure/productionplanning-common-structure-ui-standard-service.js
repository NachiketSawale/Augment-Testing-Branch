/**
 * Created by las on 2/2/2018.
 */

(function () {
 'use strict';
    /* global angular, _ */
   angular.module('productionplanning.common').factory('productionplanningCommonStructureUIStandardService', ppsCommonStructureUIStandardService);

   ppsCommonStructureUIStandardService.$inject = ['platformUIStandardConfigService', 'platformSchemaService', 'platformUIStandardExtentService',
        'productionplanningCommonTranslationService','basicsLookupdataConfigGenerator'];

    function ppsCommonStructureUIStandardService(platformUIStandardConfigService, platformSchemaService, platformUIStandardExtentService,
                                                 ppsCommonTranslationService,basicsLookupdataConfigGenerator) {

        var dtoScheme = {
            'Code': {'domain': 'code', 'mandatory': 'true', 'maxlen': 16},
            'DescriptionInfo': {'domain': 'translation'},
            'Quantity': {'domain': 'quantity', 'mandatory': 'true'},
           // 'UoMFk': {'type': 'integer'},
             'UomFk': {'type': 'integer'}
        },
            basLayout = {
                'fid': 'productionplanning.common.structure.detailform',
                'version': '1.0.0',
                'showGrouping': true,
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
            if(lProperty === 'uomfk')
            {
                detailLayout.overloads[lProperty] = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                    dataServiceName: 'basicsUnitLookupDataService',
                    cacheEnable: true,
                    readonly: true
                });
            }
        });

        function StructureUIStandardService(layout, scheme, translateService) {
            platformUIStandardConfigService.call(this, layout, scheme, translateService);
        }

        StructureUIStandardService.prototype = Object.create(platformUIStandardConfigService.prototype);
        StructureUIStandardService.prototype.constructor = StructureUIStandardService;

        return new StructureUIStandardService(detailLayout, dtoScheme, ppsCommonTranslationService);
    }
})(angular);