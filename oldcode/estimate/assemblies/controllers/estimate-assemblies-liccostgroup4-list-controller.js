/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesLicCostgroup4ListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of enterprise cost group(4) entities.
	 **/
	angular.module('estimate.assemblies').controller('estimateAssembliesLicCostgroup4ListController',
		['$scope', 'estimateAssembliesService', 'estimateCommonLiccostgroupControllerService', 'estimateAssembliesFilterService', 'estimateAssembliesClipboardService',
			function ($scope, estimateAssembliesService, liccostgroupControllerService, estimateAssembliesFilterService, estimateAssembliesClipboardService) {

				liccostgroupControllerService.initLiccostgroupController($scope, '4', estimateAssembliesService, 'estimateAssembliesLiccostgroup4Service', estimateAssembliesClipboardService, estimateAssembliesFilterService);

				estimateAssembliesFilterService.onFilterButtonRemoved.register($scope.updateTools);
				$scope.$on('$destroy', function () {
					estimateAssembliesFilterService.onFilterButtonRemoved.unregister($scope.updateTools);
				});
			}]);
})();