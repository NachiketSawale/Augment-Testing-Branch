/**
 * Created by jhe on 7/23/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.regionCatalog';

	angular.module(moduleName).controller('basicsRegionCatalogListController',
		['$scope', '$translate', 'platformGridControllerService', 'basicsRegionCatalogService', 'basicsRegionCatalogUIStandardService','basicsRegionCatalogValidationService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns, validationService) {

				var gridConfig = {
					columns: [],
					initCalled: false,
					parentProp: 'RegionCatalogFk',
					childProp: 'ChildItems'
				};

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			}]
	);
})(angular);