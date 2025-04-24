/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
    'use strict';
    const moduleName = 'model.main';

    angular.module(moduleName).service('modelMainViewpointConfigurationService', ModelMainViewpointConfigurationService);

    ModelMainViewpointConfigurationService.$inject = ['platformUIConfigInitService', 'modelMainUIConfigurationService', 'modelMainTranslationService'];

    function ModelMainViewpointConfigurationService(platformUIConfigInitService, modelMainUIConfigurationService, modelMainTranslationService) {

        platformUIConfigInitService.createUIConfigurationService({
            service: this,
            layout: modelMainUIConfigurationService.getModelViewpointDetailLayout(),
            dtoSchemeId: {typeName: 'ViewpointDto', moduleSubModule: 'Model.Main'},
            translator: modelMainTranslationService
        });
    }

})(angular);