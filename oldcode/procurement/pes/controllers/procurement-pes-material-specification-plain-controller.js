(function(angular){
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';
	/**
	 * @ngdoc controller
	 * @name procurement.pes.prcPesMaterialSpecificationController
	 * @require $scope
	 * @description controller for pesItem's basics material catalog
	 */
	angular.module(moduleName).controller('prcPesMaterialSpecificationPlainController',
		['$scope', 'procurementCommonMaterialSpecificationFactory', 'procurementPesItemService',
			function ($scope, procurementCommonMaterialSpecificationFactory, itemService) {
				procurementCommonMaterialSpecificationFactory.getMaterialSpecificationPlainController($scope, itemService);

			}]);
})(angular);