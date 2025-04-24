/**
 * Created by lav on 12/18/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportUnplannedReturnResourcesDialogController', Controller);
	Controller.$inject = [
		'$scope',
		'$options',
		'$injector',
		'$translate',
		'$http',
		'transportplanningTransportMainService',
		'platformModuleStateService',
		'transportplanningTransportStepsService'];

	function Controller($scope,
						$options,
						$injector,
						$translate,
						$http,
						transportMainService,
						platformModuleStateService,
						transportplanningTransportStepsService) {


		initializeScope();

		function initializeScope() {
			$scope.title = $translate.instant('transportplanning.transport.wizard.unplannedReturnResources');
			$scope.isBusy = false;
			$scope.forUnplanned = true;
			$scope.steps = [
				{
					url: 'transportplanning.transport/partials/transportplanning-transport-return-resources-select.html',
					service: 'transportplanningTransportReturnResourcesSelectService',
					title: $translate.instant('transportplanning.transport.wizard.selectResources'),
					isInitialized: true
				},
				{
					url: 'transportplanning.transport/partials/transportplanning-transport-return-resources-route-setting.html',
					service: 'transportplanningTransportReturnResourcesRouteSettingService',
					title: $translate.instant('transportplanning.transport.wizard.routeSetting')
				}
			];
			$scope.context = {resources: [], statusIds: $options.statusIds};
			$scope.finish = finish;
			transportplanningTransportStepsService.initialize($scope);

			_.extend($scope.modalOptions, {
				cancel: close
			});

			function close() {
				return $scope.$close(false);
			}

			$scope.$on('$destroy', function () {
				var modState = platformModuleStateService.state(transportMainService.getModule());
				if (modState.validation && modState.validation.issues) {
					modState.validation.issues.length = 0;//delete all the issues
				}
			});
		}

		function finish() {
			var step2Result = transportplanningTransportStepsService.getService($scope.steps[1].service).getResult();
			if (!step2Result.routeEntity.LgmJobFk) {
				$injector.get('platformDialogService').showErrorDialog({
					ErrorMessage: 'The Job field for the selected route should not be empty'
				});
				return;
			}
			$scope.isBusy = true;
			var resource = [];
			_.forEach(transportplanningTransportStepsService.getService($scope.steps[0].service).getResult().selectedResources, function (item) {
				resource.push({
					Id: item.OriginalId,
					Quantity: item.TransportQuantity,
					SrcJobFk: item.Job.Id,
					UomFk: item.ResourceUom
				});
			});
			var postData;
			var url = 'transportplanning/transport/route/addreturnpackages';
			postData = {
				'Route': step2Result.routeEntity,
				'Resources': resource,
				'ForUnplanned': true
			};
			$http.post(globals.webApiBaseUrl + url, postData).then(function () {
				var wpService = $injector.get('transportplanningTransportWaypointLookupDataService');
				wpService.setFilter(step2Result.routeEntity.Id);
				wpService.getList({
					disableDataCaching: true
				}).then(function () {
					var selected = _.find(transportMainService.getList(), {'Id': step2Result.routeEntity.Id});
					if (selected) {
						transportMainService.deselect().then(function () {
							transportMainService.setSelected(selected);
							$scope.$close(true);
						});
					} else {
						$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/listbyids', [step2Result.routeEntity.Id]).then(function (result) {
							transportMainService.appendNewItem(result.data.Main[0]);
							$scope.$close(true);
						});
					}
				});
			}, function () {
				$scope.isBusy = false;
			});
		}
	}
})(angular);