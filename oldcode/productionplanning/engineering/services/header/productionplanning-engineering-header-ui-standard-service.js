(function () {
    'use strict';
    var moduleName = 'productionplanning.engineering';
    /**
     * @ngdoc service
     * @name productionplanningEngineeringHeaderUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of header entities
     */
    angular.module(moduleName).factory('productionplanningEngineeringHeaderUIStandardService', productionplanningEngineeringHeaderUIStandardService);

    productionplanningEngineeringHeaderUIStandardService.$inject = ['platformUIStandardConfigService',
        'platformUIStandardExtentService', 
        'platformSchemaService',  
        'productionplanningEngineeringTranslationService',
        'productionplanningEngineeringHeaderLayout',
        'productionplanningEngineeringHeaderLayoutConfig'];

    function productionplanningEngineeringHeaderUIStandardService(platformUIStandardConfigService,
                                                       platformUIStandardExtentService, 
                                                       platformSchemaService,
                                                       translationServ,
                                                       headerLayout,
                                                       headerLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'EngHeaderDto',
            moduleSubModule: 'ProductionPlanning.Engineering'
        });
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
        }
        function HeaderUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        HeaderUIStandardService.prototype = Object.create(BaseService.prototype);
        HeaderUIStandardService.prototype.constructor = HeaderUIStandardService;

        var service = new BaseService(headerLayout, schemaProperties, translationServ);

        platformUIStandardExtentService.extend(service, headerLayoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return headerLayout;
        };

        return service;
    }
})();