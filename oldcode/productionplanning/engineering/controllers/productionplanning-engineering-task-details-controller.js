/**
 * Created by las on 1/25/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.engineering';
	var packageModule = angular.module(moduleName);

	packageModule.controller('productionplanningEngineeringTaskDetailsController', PpsEngtaskDetailsController);
	PpsEngtaskDetailsController.$inject = ['$scope', '$injector', 'platformDetailControllerService',
		'productionplanningEngineeringMainService',
		'productionplanningEngineeringTaskValidationService',
		'productionplanningEngineeringTaskUIStandardService',
		'productionplanningEngineeringTranslationService',
		'ppsCommonLoggingHelper'];


	function PpsEngtaskDetailsController($scope, $injector, platformDetailControllerService,
		dataService,
		validationService,
		uiStandardService,
		translationService,
		ppsCommonLoggingHelper) {

		const containerUUID = $scope.getContainerUUID();

		// extend validation for logging
		ppsCommonLoggingHelper.extendValidationIfNeeded(
			dataService,
			validationService,
			{
				typeName: 'EngTaskDto',
				moduleSubModule: 'ProductionPlanning.Engineering'
			}
		);
		platformDetailControllerService.initDetailController($scope, dataService, validationService, uiStandardService, translationService);

		// extend characteristic2
		const characteristic2Config = {
			sectionId: 71,
			scope: $scope,
			formContainerId: containerUUID,
			dataService: dataService,
			containerInfoService: 'productionplanningEngineeringContainerInformationService',
		};
		const characteristic2RowEventsHelper = $injector.get('PpsCommonCharacteristic2RowEventsHelper');
		characteristic2RowEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			characteristic2RowEventsHelper.unregister(containerUUID, 71);
		});
	}

})(angular);