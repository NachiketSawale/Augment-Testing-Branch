/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainUpdatePackageBoqEstimateScopePageController', estimateMainUpdatePackageBoqEstimateScopePageController);

	estimateMainUpdatePackageBoqEstimateScopePageController.$inject = ['$scope'];

	function estimateMainUpdatePackageBoqEstimateScopePageController($scope) {

		$scope.modalOptions = $scope.modalOptions || {};
		$scope.estimateScope = angular.isFunction($scope.modalOptions.getEstimateScope) ? $scope.modalOptions.getEstimateScope() : 0;
		$scope.onEstimateScopeChanged = onEstimateScopeChanged;

		$scope.next = next;

		// ////////////////////

		function onEstimateScopeChanged(value) {
			if (angular.isFunction($scope.modalOptions.setEstimateScope)) {
				$scope.modalOptions.setEstimateScope(value);
			}
		}

		function next() {
			if (angular.isFunction($scope.modalOptions.next)) {
				$scope.modalOptions.next();
			}

			$scope.$close();
		}
	}

})(angular);
