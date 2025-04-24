/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.assemblies';

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesWicItemListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of entity entities.
	 **/
	angular.module(moduleName).controller('estimateAssembliesWicItemListController',
		['$scope', 'platformContainerControllerService', 'estimateAssembliesWicItemService',
			function ($scope, platformContainerControllerService, estimateAssembliesWicItemService) {

				platformContainerControllerService.initController($scope, moduleName, '4DCC2EC321AF4a6297FED83EEACF9F38');

				estimateAssembliesWicItemService.registerLookupFilter();

				$scope.$on('$destroy', function () {
					estimateAssembliesWicItemService.unregisterLookupFilter();
				});


				// for hidden bulk editor button
				let index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);

			}]);
})();
