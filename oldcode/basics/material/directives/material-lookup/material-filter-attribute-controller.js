(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterAttributeController', [
		'$scope', '$http', 'existedAttributeFilters',
		function ($scope, $http, existedAttributeFilters) {
			const existedAttributes = existedAttributeFilters.map(e => e.Id);
			const baseUrl = globals.webApiBaseUrl + 'basics/material/filter/';

			$scope.attributes = [];

			$scope.showMoreAttribute = false;

			$scope.input = {
				userInput: '',
				pageNumber: 1,
				pageSize: 100
			};

			$scope.search = function () {
				$scope.attributes = [];
				$scope.input.pageNumber = 1;
				return loadProperties();
			};

			$scope.showMore = function () {
				$scope.input.pageNumber++;
				return loadProperties();
			}

			$scope.select = function (attribute) {
				$scope.$close({
					isOk: true,
					attribute: attribute
				});
			};

			loadProperties();

			function loadProperties() {
				return $http.post(baseUrl + 'properties', $scope.input).then(function (response) {
					$scope.showMoreAttribute = response.data.length === $scope.input.pageSize;
					$scope.attributes = $scope.attributes.concat(_.difference(response.data, existedAttributes));
					return response.data;
				});
			}
		}
	]);

})(angular);