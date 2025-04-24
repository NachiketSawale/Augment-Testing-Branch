(function () {
	'use strict';

	const moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialFilterSelectionController', ['$scope', 'list',
		function ($scope, list) {
			const vm = this;

			$scope.pinnedItems = list.filter(e => e.IsPinned);

			$scope.items = list.filter(e => !e.IsPinned);

			$scope.select = function (item) {
				$scope.$close({
					isOk: true,
					item: item
				});
			};

			$scope.userInput = '';

			$scope.search = function () {
				$scope.items = list.filter(e => !e.IsPinned && e.Id.toLowerCase().includes($scope.userInput.toLowerCase()));
			};
		}
	]);

})(angular);