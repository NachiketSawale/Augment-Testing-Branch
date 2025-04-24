/**
 * Created by las on 7/10/2017.
 */


(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var packageModule = angular.module(moduleName);

	packageModule.controller('transportplanningPackageDetailsController', TrsPackageDetailsController);
	TrsPackageDetailsController.$inject = ['$scope', '$injector', 'platformDetailControllerService', 'transportplanningPackageMainService',
		'transportplanningPackageValidationService', 'transportplanningPackageWithoutWaypointUIStandardService', 'transportplanningPackageTranslationService', 'transportplanningPackageDataServiceFactory'];


	function TrsPackageDetailsController($scope, $injector, platformDetailControllerService, TrsPackageMainService, TrsPackageValidationService,
										 uiService, TrsPackageTranslationService, TrsPackageDataServiceFactory) {

		var parentServiceName = $scope.getContentValue('parentService');
		var currentModuleName = $scope.getContentValue('currentModule');
		var dataService = {};
		if (parentServiceName === null || parentServiceName === undefined) {
			dataService = TrsPackageMainService;
		}
		else {
			var parentService = $injector.get(parentServiceName);
			dataService = TrsPackageDataServiceFactory.getService(currentModuleName, parentService);
		}

		platformDetailControllerService.initDetailController($scope, dataService, TrsPackageValidationService, uiService, TrsPackageTranslationService);

		if (currentModuleName === 'productionplanning.item') {
			$scope.formContainerOptions.createBtnConfig = null;
			$scope.formContainerOptions.deleteBtnConfig = null;
			$scope.formContainerOptions.createChildBtnConfig = null;
		}
	}

})(angular);
