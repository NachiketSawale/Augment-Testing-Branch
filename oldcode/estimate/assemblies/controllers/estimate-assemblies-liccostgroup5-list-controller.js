/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesLicCostgroup5ListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of enterprise cost group(5) entities.
	 **/
	angular.module('estimate.assemblies').controller('estimateAssembliesLicCostgroup5ListController',
		['$scope', 'estimateAssembliesService', 'estimateCommonLiccostgroupControllerService', 'estimateAssembliesFilterService', 'estimateAssembliesClipboardService',
			function ($scope, estimateAssembliesService, liccostgroupControllerService, estimateAssembliesFilterService, estimateAssembliesClipboardService) {

				liccostgroupControllerService.initLiccostgroupController($scope, '5', estimateAssembliesService, 'estimateAssembliesLiccostgroup5Service', estimateAssembliesClipboardService, estimateAssembliesFilterService);

				estimateAssembliesFilterService.onFilterButtonRemoved.register($scope.updateTools);
				$scope.$on('$destroy', function () {
					estimateAssembliesFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
				});
			}]);
})();