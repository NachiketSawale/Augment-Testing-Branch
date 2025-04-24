(function () {
    'use strict';
    var moduleName = 'transportplanning.transport';
    /**
     * @ngdoc service
     * @name transportplanningTransportWaypointUIStandardService
     * @function
     *
     * @description
     * This service provides standard layouts for different containers of Waypoint entities
     */
    angular.module(moduleName).factory('transportplanningTransportWaypointUIStandardService', transportplanningTransportWaypointUIStandardService);

    transportplanningTransportWaypointUIStandardService.$inject = ['platformUIStandardConfigService',
        'platformUIStandardExtentService',
        'platformSchemaService',
        'transportplanningTransportTranslationService',
        'transportplanningTransportWaypointLayout',
        'transportplanningTransportWaypointLayoutConfig'];

    function transportplanningTransportWaypointUIStandardService(platformUIStandardConfigService,
                                                                 platformUIStandardExtentService,
                                                                 platformSchemaService,
                                                                 translationServ,
                                                                 layout,
                                                                 layoutConfig) {

        var BaseService = platformUIStandardConfigService;

        var dtoSchema = platformSchemaService.getSchemaFromCache({
            typeName: 'TrsWaypointDto',
            moduleSubModule: 'TransportPlanning.Transport'
        });
        var schemaProperties;
        if (dtoSchema) {
            schemaProperties = dtoSchema.properties;
        }
        function WaypointUIStandardService(layout, scheme, translateService) {
            BaseService.call(this, layout, scheme, translateService);
        }

        WaypointUIStandardService.prototype = Object.create(BaseService.prototype);
        WaypointUIStandardService.prototype.constructor = WaypointUIStandardService;

        var service = new BaseService(layout, schemaProperties, translationServ);

        platformUIStandardExtentService.extend(service, layoutConfig.addition, schemaProperties);

        service.getProjectMainLayout = function () {
            return layout;
        };

        return service;
    }
})();