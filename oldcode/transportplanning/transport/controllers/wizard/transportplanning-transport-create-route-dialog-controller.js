/**
 * Created by lav on 10/19/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportCreateRouteDialogController', Controller);
	Controller.$inject = [
		'$scope',
		'$options',
		'transportplanningTransportCreateTransportRouteDialogService'];

	function Controller($scope,
						$options,
						dialogService) {

		$scope.createWaypointForEachBundle = $options.createWaypointForEachBundle;

		dialogService.initialize($scope);
	}
})(angular);