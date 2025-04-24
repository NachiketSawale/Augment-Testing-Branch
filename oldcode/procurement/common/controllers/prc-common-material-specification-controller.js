(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.common';

	/**
	 * @ngdoc controller
	 * @name procurement.common.prcCommonMaterialSpecificationController
	 * @require $scope
	 * @description controller for prcItem's basics material catalog
	 */
	angular.module(moduleName).controller('prcCommonMaterialSpecificationController',
		['$scope', 'procurementCommonMaterialSpecificationFactory', 'procurementCommonPrcItemDataService',
			function ($scope, procurementCommonMaterialSpecificationFactory, procurementCommonPrcItemDataService) {
				var prcItemService = procurementCommonPrcItemDataService.getService();
				procurementCommonMaterialSpecificationFactory.getMaterialSpecificationController($scope, prcItemService);

			}]);
})(angular);