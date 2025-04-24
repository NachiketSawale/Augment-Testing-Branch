/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainLineItemSelectionStatementParentController
	 * @function
	 * @description
	 * Controller for the  list view of Estimate Line Item Selection Statement
	 **/
	angular.module(moduleName).controller('estimateMainLineItemSelectionStatementParentController', [
		'$rootScope', '$scope', '$timeout', 'estimateMainLineItemSelStatementListService',
		function ($rootScope, $scope, $timeout, estimateMainLineItemSelStatementListService) {

			$scope.selStatementType='lineItems';
			$scope.currentItem = $scope.currentItem || {};

			$scope.isInit = false;

			// itemService.registerListLoaded estimateMainLineItemSelStatementListService
			function setIsInitLayout(){
				let scopeParent = $scope.$parent;
				// scopeParent.config = estimateMainDynamicConfigurationService.getStandardConfigForLineItemStructure();
				// scopeParent.scheme = estimateMainDynamicConfigurationService.getDtoScheme();
				// scopeParent.options = scopeParent.options || {};
				// scopeParent.options.columns = estimateMainDynamicConfigurationService.getStandardConfigForLineItemStructure().columns;
				// scopeParent.state = [];

				$scope.isInit = true;

				apply(function(){
					scopeParent.$apply();
				});
			}

			function apply(fn) {
				let phase = $rootScope.$$phase;
				if (phase === '$apply' || phase === '$digest') {
					$timeout(fn, 500);
				} else {
					fn();
				}
			}

			estimateMainLineItemSelStatementListService.registerListLoaded(setIsInitLayout);

			$scope.$on('$destroy', function () {
				estimateMainLineItemSelStatementListService.unregisterListLoaded(setIsInitLayout);
			});
		}
	]);
})(angular);
