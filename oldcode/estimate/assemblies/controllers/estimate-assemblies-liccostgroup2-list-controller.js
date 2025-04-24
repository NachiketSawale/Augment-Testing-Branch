/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesLicCostgroup2ListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of enterprise cost group(2) entities.
	 **/
	angular.module('estimate.assemblies').controller('estimateAssembliesLicCostgroup2ListController',
		['$scope', 'estimateAssembliesService', 'estimateCommonLiccostgroupControllerService', 'estimateAssembliesFilterService', 'estimateAssembliesClipboardService',
			function ($scope, estimateAssembliesService, liccostgroupControllerService, estimateAssembliesFilterService, estimateAssembliesClipboardService) {

				liccostgroupControllerService.initLiccostgroupController($scope, '2', estimateAssembliesService, 'estimateAssembliesLiccostgroup2Service', estimateAssembliesClipboardService, estimateAssembliesFilterService);

				estimateAssembliesFilterService.onFilterButtonRemoved.register($scope.updateTools);
				$scope.$on('$destroy', function () {
					estimateAssembliesFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
				});
			}]);
})();