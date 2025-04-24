/**
 * Created by anl on 1/4/2018.
 */

(function () {
    'use strict';
    var moduleName = 'productionplanning.common';

    angular.module(moduleName).factory('productionplanningCommonDocumentUIStandardService', PpsDocumentUIStandardService);

    PpsDocumentUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningCommonTranslationService',
        'platformSchemaService', 'platformUIStandardExtentService', 'productionplanningCommonDocumentLayout'];

    function PpsDocumentUIStandardService(PlatformUIStandardConfigService, productionplanningCommonTranslationService,
                                               platformSchemaService, platformUIStandardExtentService, ppsDocumentLayout) {

        var masterAttributeDomains = platformSchemaService.getSchemaFromCache({
            typeName: 'PpsDocumentDto',
            moduleSubModule: 'ProductionPlanning.Common'
        });
        masterAttributeDomains = masterAttributeDomains.properties;

        var service = new PlatformUIStandardConfigService(ppsDocumentLayout, masterAttributeDomains, productionplanningCommonTranslationService);

        platformUIStandardExtentService.extend(service, ppsDocumentLayout.addition, masterAttributeDomains);

        service.getProjectMainLayout = function () {
            return ppsDocumentLayout;
        };

        return service;
    }
})();
