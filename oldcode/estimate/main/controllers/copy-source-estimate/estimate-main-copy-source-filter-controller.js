(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainCopySourceFilterFormController
	 * @function
	 * @description
	 * Controller for the filter options of Copy Source entities.
	 **/
	angular.module(moduleName).controller('estimateMainCopySourceFilterFormController',
		['$scope', '$timeout', 'estimateMainCopySourceFilterService',
			function ($scope, $timeout, estimateMainCopySourceFilterService) {

				function updateCurrentItem() {
					$timeout(function () {
						$scope.currentItem = estimateMainCopySourceFilterService.getSelected();
					}, 0);
				}

				estimateMainCopySourceFilterService.dataModified.register(updateCurrentItem);

				//  unregister subscription
				$scope.$on('$destroy', function () {
					// estimateMainCopySourceFilterService.unregisterDataModified(updateCurrentItem);

					estimateMainCopySourceFilterService.dataModified.unregister(updateCurrentItem);
				});
			}
		]);
})(angular);