/**
 * Created by lnb on 9/9/2014.
 */
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialGroupsController
	 * @require $scope
	 * @description controller for basics material catalog
	 */
	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogDiscountGroupController',
		['$scope', 'platformGridControllerService', 'basicsMaterialCatalogDiscountGroupUIStandardService', 'basicsMaterialCatalogDiscountGroupService', 'basicsMaterialCatalogDiscountGroupValidationService',
			function ($scope, gridControllerService, gridColumns, dataService, validationService) {
				var gridConfig = {
					columns: [],
					parentProp: 'MaterialDiscountGroupFk',
					childProp: 'ChildItems'
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
			}]);
})(angular);