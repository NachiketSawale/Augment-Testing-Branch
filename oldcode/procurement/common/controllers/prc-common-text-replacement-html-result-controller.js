/**
 * Created by chi on 2/28/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonTextReplacementResultController', procurementCommonTextReplacementResultController);

	procurementCommonTextReplacementResultController.$inject = ['$scope'];

	function procurementCommonTextReplacementResultController($scope) {
		$scope.currentData = $scope.$parent.data;
	}

})(angular);