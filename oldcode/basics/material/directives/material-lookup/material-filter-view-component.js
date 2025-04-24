/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).component('basicsMaterialFilterView', {
		templateUrl: 'basics.material/templates/material-lookup/material-filter-view-component.html',
		bindings: {
			searchViewOptions: '<'
		},
		controller: [
			'$scope',
			function (
				$scope
			) {
				let currentFilterOption = {};

				$scope.searchViewOptions = this.searchViewOptions;
				$scope.searchService = this.searchViewOptions.searchService;
				$scope.searchOptions = this.searchViewOptions.searchOptions;

				// $onInit hook
				this.$onInit = function () {
					$scope.searchViewOptions.updateCurrentFilterOption = updateCurrentFilterOption;
					$scope.searchViewOptions.getCurrentFilterOption = getCurrentFilterOption;
					$scope.searchViewOptions.executeFilter = executeFilter;
					$scope.searchViewOptions.executePaging = executePaging;
					$scope.searchViewOptions.executeSortBy = executeSortBy;
					$scope.searchViewOptions.executePageSize = executePageSize;
				};

				// $onDestroy hook
				this.$onDestroy = function () {
					console.log('Component is being destroyed');
				};

				function updateCurrentFilterOption(filterOption) {
					if (!filterOption) {
						return;
					}
					const keysOfFilterOption = Object.keys(filterOption);
					keysOfFilterOption.forEach(function (key) {
						currentFilterOption[key] = filterOption[key];
					});
				}

				function getCurrentFilterOption() {
					return currentFilterOption;
				}

				function executeFilter(filterOption) {
					$scope.searchViewOptions.clearSelectedItems();
					updateCurrentFilterOption(filterOption);
					$scope.searchService.resetPage();
					return execute();
				}

				function executeSortBy() {
					$scope.searchService.resetPage();
					return execute();
				}

				function executePaging() {
					return execute();
				}

				function executePageSize() {
					$scope.searchService.resetPage();
					return execute();
				}

				function execute() {
					$scope.dialogLoading = true;
					return $scope.searchService.filterRequest(currentFilterOption).finally(function () {
						$scope.dialogLoading = false;
					});
				}
			}],
		controllerAs: 'basicsMaterialFilterView'
	});

})(angular);