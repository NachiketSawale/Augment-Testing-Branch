(function (angular) {
	'use strict';
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc controller
	 * @name procurement.common.prcCommonMaterialSpecificationPlainController
	 * @require $scope
	 * @description controller for prcItem's basics material catalog
	 */
	angular.module(moduleName).controller('prcCommonMaterialSpecificationPlainController',
		['$scope', 'procurementCommonMaterialSpecificationFactory', 'procurementCommonPrcItemDataService',
			function ($scope, procurementCommonMaterialSpecificationFactory, procurementCommonPrcItemDataService) {
				var prcItemService = procurementCommonPrcItemDataService.getService();
				procurementCommonMaterialSpecificationFactory.getMaterialSpecificationPlainController($scope, prcItemService);

			}]);
})(angular);