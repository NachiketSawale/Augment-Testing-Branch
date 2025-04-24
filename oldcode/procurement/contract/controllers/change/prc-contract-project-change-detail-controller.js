/**
 * Created by yew on 07.24.2023.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.contract';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementContractProjectChangeDetailController', PrcContractProjectChangeDetailController);

	PrcContractProjectChangeDetailController.$inject = ['$scope', 'platformDetailControllerService',
		'changeMainConfigurationService','changeMainContractChangeDataService', 'changeMainValidationService'];

	function PrcContractProjectChangeDetailController($scope, platformDetailControllerService, changeMainConfigurationService, dataService, validationService) {
		platformDetailControllerService.initDetailController($scope, dataService, validationService, changeMainConfigurationService);
	}
})(angular);