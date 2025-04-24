/**
 * Created by lnb on 9/9/2014.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialGroupsController
	 * @require $scope
	 * @description controller for basics material catalog
	 */
	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogGroupCharValController',
		['$scope', 'platformGridControllerService', 'basicsMaterialCatalogGroupCharValUIStandardService', 'basicsMaterialCatalogGroupCharValService', 'basicsMaterialCatalogGroupCharValValidationService',
			function ($scope, gridControllerService, gridColumns, dataService, validationService) {
				var gridConfig = {
					columns: []
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);
			}]);
})(angular);