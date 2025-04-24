(function () {
    'use strict';
    var moduleName = 'productionplanning.common';
    /**
     * @ngdoc service
     * @name productionplanningCommonEventUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of master entities
     */
    angular.module(moduleName).factory('productionplanningCommonEventUIStandardService', ProductionplanningCommonEventUIStandardService);

    ProductionplanningCommonEventUIStandardService.$inject = ['productionplanningCommonEventUIStandardServiceFactory'];

    function ProductionplanningCommonEventUIStandardService(uiStandardServiceFactory) {
        return uiStandardServiceFactory.getService();
    }

    angular.module(moduleName).factory('productionplanningCommonEventUIStandardServiceFactory', UIStandardServiceFactory);

    UIStandardServiceFactory.$inject = ['ppsCommonLoggingUiService', 'productionplanningCommonTranslationService',
        'productionplanningCommonEventDetailLayoutFactory', 'platformUIStandardExtentService'];

    function UIStandardServiceFactory(ppsCommonLoggingUiService, productionplanningCommonTranslationService,
                                      detailLayoutFactory, platformUIStandardExtentService) {

        var service = {};

        service.getService = function (foreignKey) {
            var BaseService = ppsCommonLoggingUiService;

            var schemaOption = { typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common' };
            var layout = detailLayoutFactory.getLayout(foreignKey);
            var uiStandardService = new BaseService(layout, schemaOption, productionplanningCommonTranslationService);

            platformUIStandardExtentService.extend(uiStandardService, layout.addition);

            uiStandardService.getProjectMainLayout = function () {
                return layout;
            };

            return uiStandardService;
        };

        return service;
    }
})();
