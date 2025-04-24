(function (angular) {
    'use strict';
    var moduleName = 'resource.requisition';

    /**
     * @ngdoc controller
     * @name resourceRequisitionItemLayoutService
     * @function
     *
     * @description
     * This service provides standard layout for grid / form of  resource requisition item entity.
     **/
    angular.module(moduleName).service('resourceRequisitionItemLayoutService',ResourceRequisitionItemLayoutService);

    ResourceRequisitionItemLayoutService.$inject = ['platformUIConfigInitService', 'resourceRequisitionContainerInformationService',
        'resourceRequisitionConstantValues', 'resourceRequisitionTranslationService'];

    function ResourceRequisitionItemLayoutService(platformUIConfigInitService, resourceRequisitionContainerInformationService,
                                                      resourceRequisitionConstantValues, resourceRequisitionTranslationService) {

        platformUIConfigInitService.createUIConfigurationService({
            service: this,
            layout: resourceRequisitionContainerInformationService.getResourceRequisitionItemLayout(),
            dtoSchemeId: resourceRequisitionConstantValues.schemes.requisitionItem,
            translator: resourceRequisitionTranslationService
        });
    }
})(angular);
