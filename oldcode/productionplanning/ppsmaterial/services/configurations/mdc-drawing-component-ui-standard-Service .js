(function () {
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    /**
     * @ngdoc service
     * @name mdcDrawingComponentUIStandardService
     * @function
     *
     * @description
     *
     */
    angular.module(moduleName).factory('mdcDrawingComponentUIStandardService',mdcDrawingComponentUIStandardService );

	mdcDrawingComponentUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningPpsMaterialTranslationService',
        'platformSchemaService', 'mdcDrawingComponentLayout', 'platformUIStandardExtentService', 'mdcDrawingComponentLayoutConfig'];

    function mdcDrawingComponentUIStandardService(platformUIStandardConfigService, ppsMaterialTranslationService,
                                                     platformSchemaService, mdcDrawingComponentLayout, platformUIStandardExtentService, mdcDrawingComponentLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({ typeName: 'MdcDrawingComponentDto', moduleSubModule: 'ProductionPlanning.PpsMaterial' });
        var schemaProperties;
        if(dtoSchema)
        {
            schemaProperties = dtoSchema.properties;
        }
        function DrawingComponentUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

	    DrawingComponentUIStandardService.prototype = Object.create(BaseService.prototype);
	    DrawingComponentUIStandardService.prototype.constructor = DrawingComponentUIStandardService;

        var service =  new BaseService(mdcDrawingComponentLayout, schemaProperties, ppsMaterialTranslationService);

        platformUIStandardExtentService.extend(service, mdcDrawingComponentLayoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return mdcDrawingComponentLayout;
        };

        return service;
    }
})();