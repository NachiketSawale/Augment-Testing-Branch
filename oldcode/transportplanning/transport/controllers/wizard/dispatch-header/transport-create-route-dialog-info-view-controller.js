/**
 * Created by anl on 8/12/2021.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportCreateRouteInfoViewController', InfoViewController);
	InfoViewController.$inject = [
		'$scope',
		'transportplanningTransportCreateRouteInfoViewService'];

	function InfoViewController(
		$scope,
		infoViewService) {

		infoViewService.initialize($scope);
	}
})(angular);