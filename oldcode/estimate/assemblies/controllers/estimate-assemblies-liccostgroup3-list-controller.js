/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesLicCostgroup3ListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of enterprise cost group(3) entities.
	 **/
	angular.module('estimate.assemblies').controller('estimateAssembliesLicCostgroup3ListController',
		['$scope', 'estimateAssembliesService', 'estimateCommonLiccostgroupControllerService', 'estimateAssembliesFilterService', 'estimateAssembliesClipboardService',
			function ($scope, estimateAssembliesService, liccostgroupControllerService, estimateAssembliesFilterService, estimateAssembliesClipboardService) {

				liccostgroupControllerService.initLiccostgroupController($scope, '3', estimateAssembliesService, 'estimateAssembliesLiccostgroup3Service', estimateAssembliesClipboardService, estimateAssembliesFilterService);

				estimateAssembliesFilterService.onFilterButtonRemoved.register($scope.updateTools);
				$scope.$on('$destroy', function () {
					estimateAssembliesFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
				});
			}]);
})();