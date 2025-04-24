/**
 * Created by zov on 7/15/2019.
 */
(function () {

    'use strict';
    var moduleName = 'productionplanning.producttemplate';
    var angModule = angular.module(moduleName);

    angModule.controller('ppsProducttemplateProductDescParamListController', ppsProducttemplateProductDescParamListController);

    ppsProducttemplateProductDescParamListController.$inject = ['$scope', 'platformGridControllerService',
        'ppsProducttemplateParamDataServiceFactory',
        'productionplanningProducttemplateProductDescParamUIStandardService',
        'ppsProducttemplateProductDescParamValidationServiceFactory',
        'basicsCommonMandatoryProcessor'];
    function ppsProducttemplateProductDescParamListController($scope, platformGridControllerService,
                                                                    dataServFactory,
                                                                    uiStandardServ,
                                                                    validationServFactory,
                                                                    basicsCommonMandatoryProcessor) {

        var gridConfig = {initCalled: false, columns: []};
        var serviceOptions = $scope.getContentValue('serviceOptions');
        var dataServ = dataServFactory.getService(serviceOptions);
        var validationServ = validationServFactory.getService(dataServ);
        dataServ.setNewEntityValidator(basicsCommonMandatoryProcessor.create({
            typeName: 'ProductDescParamDto',
            moduleSubModule: 'ProductionPlanning.ProductTemplate',
            validationService: validationServ
        }));

        platformGridControllerService.initListController($scope, uiStandardServ, dataServ, validationServ, gridConfig);
    }
})();