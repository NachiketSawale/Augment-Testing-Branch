/**
 * Created by anl on 2/5/2018.
 */

(function () {
    'use strict';
    var moduleName = 'productionplanning.activity';

    angular.module(moduleName).factory('productionplanningActivityActivityUIStandardService', ActivityUIStandardService);

    ActivityUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningActivityTranslationService',
        'platformSchemaService', 'ppsActivityLayout', 'platformUIStandardExtentService', 'ppsActivityLayoutConfig'];

    function ActivityUIStandardService(platformUIStandardConfigService, ppsActivityTranslationService,
                                       platformSchemaService, activityLayout, platformUIStandardExtentService, activityLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var activityAttributeDomains = platformSchemaService.getSchemaFromCache({
            typeName: 'ActivityDto',
            moduleSubModule: 'ProductionPlanning.Activity'
        });
        activityAttributeDomains = activityAttributeDomains.properties;

        var service = new BaseService(activityLayout, activityAttributeDomains, ppsActivityTranslationService);

        platformUIStandardExtentService.extend(service, activityLayoutConfig.addition, activityAttributeDomains);

        return service;
    }
})();
