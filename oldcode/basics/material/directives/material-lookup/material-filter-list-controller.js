(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterListController', [
		'$scope', '$http', 'definition', 'basicsMaterialFilterOperator', 'basicsMaterialFilterId', 'basicsMaterialFilterPredefinedId',
		function ($scope, $http, definition, basicsMaterialFilterOperator, basicsMaterialFilterId, basicsMaterialFilterPredefinedId) {
			$scope.definition = angular.copy(definition);

			$scope.definition.Operator = basicsMaterialFilterOperator.equals;

			$scope.filterId = basicsMaterialFilterId;

			$scope.apply = function () {
				if ($scope.definition.List?.length) {
					$scope.definition.Factors = $scope.definition.List.filter(e => e.IsSelected).map(e => e.Id);
				} else {
					$scope.definition.Factors = [];
				}

				if ($scope.definition.PredefinedList?.length) {
					$scope.definition.PredefinedFactors = $scope.definition.PredefinedList.filter(e => e.IsSelected).map(e => e.Id);
				} else {
					$scope.definition.PredefinedFactors = [];
				}

				$scope.$close({
					isOk: true,
					definition: $scope.definition
				});
			};

			$scope.list = [];

			$scope.search = function (userInput) {
				if (!userInput) {
					$scope.list = $scope.definition.List;
				} else {
					$scope.list = $scope.definition.List.filter(e => e.Description?.toLowerCase().includes(userInput.toLowerCase()));
				}
			};

			$scope.setPredefine = function (predefinedItem) {
				if ($scope.definition.Id === $scope.filterId.catalogType) {
					$scope.list.filter(e => e.IsFramework === (basicsMaterialFilterPredefinedId.frameworkContract === predefinedItem.Id)).forEach(e => {
						e.IsSelected = predefinedItem.IsSelected;
					});
				}
			};

			$scope.resetPredefine = function (item) {
				if ($scope.definition.Id === $scope.filterId.catalogType) {
					if (!item.IsSelected) {
						const predefineItem = $scope.definition.PredefinedList.find(e => e.Id === item.IsFramework ? basicsMaterialFilterPredefinedId.frameworkContract : basicsMaterialFilterPredefinedId.nonFrameworkContract)
						predefineItem.IsSelected = false;
					}
				}
			};

			$scope.getSelectedCount = function () {
				return $scope.definition.List?.filter(e => e.IsSelected).length;
			};

			$scope.getTotalCount = function () {
				return $scope.definition.List?.length;
			};

			$scope.clear = function () {
				$scope.definition.List.filter(e => !$scope.isDisabled(e)).forEach(e => e.IsSelected = false);
				$scope.apply();
			};

			$scope.isDisabled = function (item) {
				if (!$scope.definition.ReadonlyFactors) {
					return false;
				}

				return $scope.definition.ReadonlyFactors.some(e => e === item.Id);
			};

			$scope.isLoading = false;

			loadList();

			function loadList() {
				if ($scope.definition.List) {
					setList($scope.definition.List);
					return;
				}

				const endpoint = $scope.definition.ListEndpoint;

				$scope.isLoading = true;

				$http[endpoint.UsePost ? 'post' : 'get'](globals.webApiBaseUrl + endpoint.Url, endpoint.Payload).then(r => {
					let list = r.data;

					if (list && endpoint.mapper) {
						list = list.map(endpoint.mapper);
					}

					definition.List = list;
					$scope.definition.List = angular.copy(list);
					setList($scope.definition.List);
					$scope.isLoading = false;
				});
			}

			function setList(list) {
				if (list?.length && $scope.definition.Factors?.length) {
					list.forEach(e => {
						e.IsSelected = $scope.definition.Factors.includes(e.Id);
					});
				}

				$scope.list = list;
			}
		}
	]);

})(angular);