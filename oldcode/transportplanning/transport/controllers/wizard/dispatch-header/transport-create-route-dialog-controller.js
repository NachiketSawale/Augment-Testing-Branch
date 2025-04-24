/**
 * Created by anl on 8/11/2021.
 */
(function (angular) {
	'use strict';
	/*global _, globals, angular*/
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportCreateRouteDispatchHeaderController', CreateRouteDispatchHeaderController);
	CreateRouteDispatchHeaderController.$inject = [
		'$http',
		'$scope',
		'$options',
		'$injector',
		'$translate',
		'platformModalService',
		'transportplanningTransportStepsService'];

	function CreateRouteDispatchHeaderController(
		$http, $scope, $options, $injector, $translate, platformModalService, stepsService) {

		$scope.headers = $options.headers;
		$scope.isBusy = false;
		$scope.isNew = true;
		$scope.context = {
			DispatchHeaders: $options.DispatchHeaders,
			PlannedDelivery: {},
			NewRoute: {},
			Waypoints: [],
			Packages: []
		};

		$scope.title = $translate.instant('transportplanning.transport.wizard.createTrasnsportRoute');
		$scope.steps = [
			{
				url: 'transportplanning.transport/partials/transport-create-route-select-dispatch-header.html',
				service: 'transportplanningTransportCreateRouteSelectHeaderService',
				title: $translate.instant('transportplanning.transport.wizard.createRoute.selectHeader'),
				isInitialized: true
			},
			{
				url: 'transportplanning.transport/partials/transport-create-route-info-view.html',
				service: 'transportplanningTransportCreateRouteInfoViewService',
				title: $translate.instant('transportplanning.transport.wizard.createRoute.infoView')
			}
		];
		$scope.finish = finish;

		stepsService.initialize($scope);

		_.extend($scope.modalOptions, {
			cancel: close
		});

		function close() {
			return $scope.$close(false);
		}

		$scope.$on('$destroy', function () {
		});

		function finish() {
			$scope.isBusy = true;
			var infoViewService = $injector.get('transportplanningTransportCreateRouteInfoViewService');
			var result = infoViewService.getResult();

			_.forEach(result.Waypoints, function (wp) {
				wp.PlannedTime = wp.PlannedTime !== null ? wp.PlannedTime.utc().format() : null;
			});

			var postData = {
				Route : result.NewRoute,
				Waypoints : result.Waypoints,
				Packages : result.Packages === null ? [] : result.Packages,
			};

			$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/saverouteinfo', postData)
				.then(function (response) {

					platformModalService.showMsgBox(response.data, 'Info', 'ico-info');
					$scope.isBusy = false;
					$scope.$close(false);

				});

		}
	}
})(angular);