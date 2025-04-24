/**
 * Created by chi on 2/28/2022.
 */
(function (angular) {
	'use strict';

	let moduleName = 'procurement.common';

	angular.module(moduleName).controller('procurementCommonTextReplacementSourceController', procurementCommonTextReplacementSourceController);

	procurementCommonTextReplacementSourceController.$inject = ['$scope'];

	function procurementCommonTextReplacementSourceController($scope) {
		$scope.currentData = $scope.$parent.data;
	}

})(angular);