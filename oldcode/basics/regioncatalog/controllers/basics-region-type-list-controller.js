/**
 * Created by jhe on 7/23/2018.
 */
(function (angular) {

	'use strict';
	var moduleName = 'basics.regionCatalog';

	angular.module(moduleName).controller('basicsRegionTypeListController',
		['$scope', '$translate', 'platformGridControllerService', 'basicsRegionTypeMainService', 'basicsRegionTypeUIStandardService',
			function ($scope, $translate, gridControllerService, dataService, gridColumns) {

				var gridConfig = {
					initCalled: false,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, {}, gridConfig);


			}]
	);
})(angular);