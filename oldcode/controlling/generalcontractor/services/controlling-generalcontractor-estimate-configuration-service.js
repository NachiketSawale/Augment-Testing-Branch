
(function (angular) {
    'use strict';

    let moduleName = 'controlling.generalcontractor';

    angular.module(moduleName).factory('controllingGeneralContractorEstimateConfigurationService', ['platformUIStandardConfigService','platformUIStandardExtentService', 'controllingGeneralContractorTranslationService', 'platformSchemaService', 'controllingGeneralContractorUIConfigurationService',
        function (platformUIStandardConfigService, platformUIStandardExtentService,controllingGeneralContractorTranslationService, platformSchemaService, controllingGeneralContractorUIConfigurationService) {
            let BaseService = platformUIStandardConfigService;
            let domainSchema = platformSchemaService.getSchemaFromCache({
                typeName: 'GccEstimateCompleteDto',
                moduleSubModule: 'Controlling.GeneralContractor'
            });

            if (domainSchema) {
                domainSchema = domainSchema.properties;
            }

            function controllingUIStandardService(layout, scheme, translateService) {
                BaseService.call(layout, scheme, translateService);
            }

            controllingUIStandardService.prototype = Object.create(BaseService.prototype);
            controllingUIStandardService.prototype.constructor = controllingUIStandardService;

            let service =  new BaseService(controllingGeneralContractorUIConfigurationService.getEstimateDetailLayout(), domainSchema, controllingGeneralContractorTranslationService);

            platformUIStandardExtentService.extend(service, controllingGeneralContractorUIConfigurationService.getEstimateDetailLayout().addition, domainSchema);

            return service;
        }
    ]);
})(angular);

