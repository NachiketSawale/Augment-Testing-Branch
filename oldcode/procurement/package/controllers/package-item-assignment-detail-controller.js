/**
 * Created by clv on 10/23/2017.
 */
(function (angular) {

	'use strict';
	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageItemAssignmentDetailController', procurementPackageItemAssignmentDetailController);
	procurementPackageItemAssignmentDetailController.$inject = ['$scope', 'platformDetailControllerService',
		'procurementPackageItemAssignmentDataService', 'packageItemAssignmentUIStandardService', 'procurementPackageTranslationService',
		'procurementPackageItemAssignmentValidationService'];

	function procurementPackageItemAssignmentDetailController($scope, platformDetailControllerService,
		procurementPackageItemAssignmentDataService, packageItemAssignmentUIStandardService, procurementPackageTranslationService,
		procurementPackageItemAssignmentValidationService) {

		var dataService = procurementPackageItemAssignmentDataService;
		platformDetailControllerService.initDetailController($scope, dataService, procurementPackageItemAssignmentValidationService(dataService.name, dataService), packageItemAssignmentUIStandardService, procurementPackageTranslationService);
	}
})(angular);