/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesLicCostgroup1ListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of enterprise cost group(1) entities.
	 **/
	angular.module('estimate.assemblies').controller('estimateAssembliesLicCostgroup1ListController',
		['$scope', 'estimateAssembliesService', 'estimateCommonLiccostgroupControllerService', 'estimateAssembliesFilterService', 'estimateAssembliesClipboardService',
			function ($scope, estimateAssembliesService, liccostgroupControllerService, estimateAssembliesFilterService, estimateAssembliesClipboardService) {

				liccostgroupControllerService.initLiccostgroupController($scope, '1', estimateAssembliesService, 'estimateAssembliesLiccostgroup1Service', estimateAssembliesClipboardService, estimateAssembliesFilterService);

				estimateAssembliesFilterService.onFilterButtonRemoved.register($scope.updateTools);
				$scope.$on('$destroy', function () {
					estimateAssembliesFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
				});
			}]);
})();