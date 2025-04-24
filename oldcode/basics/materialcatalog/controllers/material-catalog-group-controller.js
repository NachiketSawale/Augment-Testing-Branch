(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialGroupsController
	 * @require $scope
	 * @description controller for basics material catalog
	 */
	angular.module('basics.materialcatalog').controller('basicsMaterialCatalogMaterialGroupController',
		['$scope', 'platformGridControllerService', 'basicsMaterialCatalogMaterialGroupService',
			'basicsMaterialCatalogGroupUIStandardService', 'basicsMaterialCatalogMaterialGroupValidationService',
			function ($scope, gridControllerService, dataService, uiStandardService, validationService) {

				var gridConfig = {
					columns: [],
					parentProp: 'MaterialGroupFk',
					childProp: 'ChildItems'
				};

				gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
			}
		]);
})(angular);