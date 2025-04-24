(function () {
    'use strict';
    /* global angular */
    var moduleName = 'productionplanning.processconfiguration';
    /**
     * @ngdoc service
     * @name phaseReqTemplateUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of Pps Material Compatibility entities
     */
    angular.module(moduleName).factory('phaseReqTemplateUIStandardService', PhaseReqTemplateUIStandardService);

	PhaseReqTemplateUIStandardService.$inject = ['platformUIStandardConfigService', 'productionplanningProcessConfigurationTranslationService',
        'platformSchemaService', 'phaseReqTemplateLayout', 'platformUIStandardExtentService', 'phaseReqTemplateLayoutConfig'];

    function PhaseReqTemplateUIStandardService(platformUIStandardConfigService, ppsProcessConfigurationTranslationService,
                                                                     platformSchemaService, phaseReqTemplateLayout, platformUIStandardExtentService, phaseReqTemplateLayoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'PhaseReqTemplateDto',
            moduleSubModule: 'Productionplanning.ProcessConfiguration'
        });
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
        }
        function PpsPhaseReqTemplateUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

	    PpsPhaseReqTemplateUIStandardService.prototype = Object.create(BaseService.prototype);
	    PpsPhaseReqTemplateUIStandardService.prototype.constructor = PpsPhaseReqTemplateUIStandardService;

        var service = new BaseService(phaseReqTemplateLayout, schemaProperties, ppsProcessConfigurationTranslationService);

        platformUIStandardExtentService.extend(service, phaseReqTemplateLayoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return phaseReqTemplateLayout;
        };

        return service;
    }
})();