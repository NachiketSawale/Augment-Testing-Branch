/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	let moduleName = 'estimate.assemblies';
	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemTotalController
	 * @function
	 *
	 * @description
	 * Controller for total costs.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('estimateAssembliesConfigTotalController',
		['$scope', 'platformGridControllerService', 'estimateMainCommonUIService',
			'estimateDefaultGridConfig',
			'estimateAssembliesService',
			'estimateAssembliesFilterService',
			'estimateAssembliesConfigTotalService',
			function ($scope,  platformGridControllerService, estimateMainCommonUIService,
				estimateDefaultGridConfig,
				estimateAssembliesService,
				estimateAssembliesFilterService,
				estimateAssembliesConfigTotalService
			) {
				let gridConfig = angular.extend({/* enter specific options here */}, estimateDefaultGridConfig),
					uiService = estimateMainCommonUIService.createUiService(['Description',  'Quantity', 'UoM', 'Total', 'Currency']);

				platformGridControllerService.initListController($scope, uiService, estimateAssembliesConfigTotalService, null, gridConfig);

				if(!estimateAssembliesConfigTotalService.toolHasAdded){
					$scope.addTools(estimateAssembliesConfigTotalService.initTotalIcons($scope));
					estimateAssembliesConfigTotalService.toolHasAdded = true;
				}
			}]);
})();
