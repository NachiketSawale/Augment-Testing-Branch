(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterFulltextListController', [
		'$scope', 'list', 'basicsMaterialSearchTextKindOptions',
		function ($scope, list, basicsMaterialSearchTextKindOptions) {
			$scope.list = list.map(e => angular.copy(e));

			$scope.itemAll = $scope.list.find(e => e.id === basicsMaterialSearchTextKindOptions.all);

			$scope.select = function (item) {

				item.selected = !item.selected;

				if (item === $scope.itemAll) {
					if (item.selected) {
						$scope.list.forEach(e => {
							if (e !== $scope.itemAll) {
								e.selected = false;
							}
						});
					}
				} else {
					if (item.selected) {
						$scope.itemAll.selected = false;
					}
				}

				$scope.$close($scope.list);
			};

			if (!$scope.list.some(e => e.selected)) {
				$scope.itemAll.selected = true;
			}
		}
	]);

})(angular);