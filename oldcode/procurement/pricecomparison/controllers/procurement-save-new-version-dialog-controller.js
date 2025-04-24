(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementSaveNewVersionDialogController',
		['$scope', function ($scope) {

			$scope.options = $scope.$parent.modalOptions;

			$scope.options.ok = function () {
				$scope.$close($scope.modalOptions.model.saveNewVersionSelect);

			};

			$scope.options.cancel = function () {
				$scope.$close();
			};
		}]);
})(angular);