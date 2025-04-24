/**
 * Created by zov on 27/06/2019.
 */
(function () {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).controller('ppsEngineeringProgressController', ppsEngineeringProgressController);
	ppsEngineeringProgressController.$inject = ['$scope',
		'ppsEngineeringProgressDataServiceFactory',
		'ppsEngineeringProgressValidationServiceFactory',
		'platformGridControllerService',
		'platformDetailControllerService',
		'ppsEngineeringProgressUIStandardServiceFactory',
		'basicsCommonMandatoryProcessor'
	];
	function ppsEngineeringProgressController($scope,
												  dataServiceFactory,
												  validationServiceFactory,
												  platformGridControllerService,
												  platformDetailControllerService,
												  uiStandardServiceFactory,
												  basicsCommonMandatoryProcessor) {

		// get environment variable from the module-container.json file
		var serviceOptions = $scope.getContentValue('serviceOptions');
		var dataSrv = dataServiceFactory.getService(serviceOptions);
		var validSrv = validationServiceFactory.getService(dataSrv);
		dataSrv.setNewEntityValidator(basicsCommonMandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'EngDrwProgReportDto',
			moduleSubModule: 'ProductionPlanning.Engineering',
			validationService: validSrv
		}));
		var uiStandardService = serviceOptions.parentFilter === 'engTaskId' ?
			uiStandardServiceFactory.createUIService4Task() : uiStandardServiceFactory.createUIService4Drawing();
		if(serviceOptions.containerType.toLowerCase() === 'grid'){
			platformGridControllerService.initListController($scope, uiStandardService, dataSrv, validSrv, {});
		}
		else{
			platformDetailControllerService.initDetailController($scope, dataSrv, validSrv, uiStandardService);
		}
	}
})();