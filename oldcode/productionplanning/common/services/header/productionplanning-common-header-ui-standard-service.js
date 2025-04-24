(function () {
    'use strict';
    var moduleName = 'productionplanning.common';
    /**
	 * @ngdoc service
	 * @name productionplanningCommonHeaderUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of master entities
	 */
    angular.module(moduleName).factory('productionplanningCommonHeaderUIStandardService', ProductionplanningCommonHeaderUIStandardService);

    ProductionplanningCommonHeaderUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningCommonTranslationService',
	    'platformSchemaService', 'productionplanningCommonHeaderDetailLayout',
	    'platformUIStandardExtentService',
	    'ppsCommonCustomColumnsServiceFactory'];

    function ProductionplanningCommonHeaderUIStandardService(platformUIStandardConfigService, productionplanningCommonTranslationService,
                                                             platformSchemaService, productionplanningCommonHeaderDetailLayout,
                                                             platformUIStandardExtentService,
                                                             customColumnsServiceFactory) {

        var BaseService = platformUIStandardConfigService;

        var masterAttributeDomains = platformSchemaService.getSchemaFromCache({ typeName: 'HeaderDto', moduleSubModule: 'ProductionPlanning.Header' });
        masterAttributeDomains = masterAttributeDomains.properties;
        // var customColumnsService = customColumnsServiceFactory.getService('productionplanning.common.header');
        // _.merge(masterAttributeDomains, customColumnsService.attributes);

        function MasterUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        MasterUIStandardService.prototype = Object.create(BaseService.prototype);
        MasterUIStandardService.prototype.constructor = MasterUIStandardService;

        var service = new BaseService(productionplanningCommonHeaderDetailLayout, masterAttributeDomains, productionplanningCommonTranslationService);

        platformUIStandardExtentService.extend(service, productionplanningCommonHeaderDetailLayout.addition, masterAttributeDomains);

        service.getProjectMainLayout = function () {
            return productionplanningCommonHeaderDetailLayout;
        };

        return service;
    }
})();
