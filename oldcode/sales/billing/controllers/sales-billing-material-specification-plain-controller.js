(function () {

	'use strict';
	var moduleName = 'sales.billing';

	/**
	 * @ngdoc controller
	 * @name salesBillingMaterialSpecificationController
	 * @function
	 *
	 * @description controller for salesBillingItem's basics material catalog
	 **/
	angular.module(moduleName).controller('salesBillingMaterialSpecificationPlainController',
		['$scope', 'procurementCommonMaterialSpecificationFactory', 'salesBillingItemService',
			function ($scope, procurementCommonMaterialSpecificationFactory, itemService) {

				procurementCommonMaterialSpecificationFactory.getMaterialSpecificationPlainController($scope, itemService);
			}
		]);

})();
