(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.bundle';

    angular.module(moduleName).factory('transportplanningBundleUIStandardService', BundleUIStandardService);
    BundleUIStandardService.$inject = ['platformTranslateService', 'platformUIStandardConfigService',
        'platformSchemaService', 'platformUIStandardExtentService',
        'transportplanningBundleTranslationService', 'transportplanningBundleDetailLayout',
        'transportplanningBundleMainLayoutConfig', 'ppsCommonCustomColumnsServiceFactory', 'ppsCommonLayoutOverloadService'];

    function BundleUIStandardService(platformTranslateService, platformUIStandardConfigService,
                                     platformSchemaService, platformUIStandardExtentService,
                                     transportplanningBundleTranslationService, transportplanningBundleDetailLayout,
                                     transportplanningBundleMainLayoutConfig, customColumnsServiceFactory, ppsCommonLayoutOverloadService) {

        var BaseService = platformUIStandardConfigService;

        var attributeDomains = platformSchemaService.getSchemaFromCache({
            typeName: 'BundleDto',
            moduleSubModule: 'TransportPlanning.Bundle'
        }).properties;

        var customColumnsService = customColumnsServiceFactory.getService(moduleName);
        _.merge(attributeDomains, customColumnsService.attributes);

        var service = new BaseService(transportplanningBundleDetailLayout, attributeDomains, transportplanningBundleTranslationService);
        platformUIStandardExtentService.extend(service, transportplanningBundleMainLayoutConfig.addition, attributeDomains);
        platformTranslateService.translateFormConfig(service.getStandardConfigForDetailView());

        service.getLookupConfigForListView = function () {
            var columns = _.cloneDeep(service.getStandardConfigForListView().columns);
            _.forEach(columns, function (o) {
                o.editor = null;
                o.navigator = null;
            });
            return {columns: columns};
        };

	    ppsCommonLayoutOverloadService.translateCustomUom(service);

	    return service;
    }
})(angular);
