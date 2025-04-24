(function (angular) {
	'use strict';
	/*global globals, angular, _*/
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportReturnResourcesDialogService', Service);

	Service.$inject = ['$translate', 'transportplanningTransportStepsService', '$http', '$injector', 'transportplanningTransportMainService', 'packageTypes'];

	function Service($translate, transportplanningTransportStepsService, $http, $injector, transportMainService, packageTypes) {

		function initialize($scope, $options) {
			$scope.title = $translate.instant('transportplanning.transport.wizard.returnResources');
			$scope.isBusy = false;
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
				},
				{
					url: 'transportplanning.transport/partials/transportplanning-transport-return-resources-resource-configure.html',
					service: 'transportplanningTransportReturnResourcesResourceConfigureService',
					title: $translate.instant('transportplanning.transport.wizard.resourceConfigure')
				}
			];
			$scope.context = {resources: [], preSelectedRoute: $options.entity, statusIds: $options.statusIds};

			$scope.finish = function () {
				$scope.isBusy = true;
				var resource = [];
				_.forEach(transportplanningTransportStepsService.getService($scope.steps[2].service).getResult(), function (item) {
					resource.push({
						Id: item.OriginalId,
						PkgType: packageTypes.Resource,
						Quantity: item.TransportQuantity,
						SrcJobFk: item.Job.Id,
						SrcWPFk: item.Job.SourceWaypoint ? item.Job.SourceWaypoint.Id : null,
						PlannedTime: item.Job.PlannedTime,
						UomFk: item.ResourceUom
					});
				});
				var step2Result = transportplanningTransportStepsService.getService($scope.steps[1].service).getResult();

				var postData;
				var url;
				if (step2Result.model === '1') {
					url = 'transportplanning/transport/route/createbyreturnpackages';
					var propList = ['BasUomFk','CalCalendarFk','DefSrcWaypointJobFk','PpsEventFk'];
					_.forEach(propList, function (prop){
						if (step2Result.routeEntity[prop] === null) {
							step2Result.routeEntity[prop] = 0;
						}
					});
					postData = {
						'TrsRoute': step2Result.routeEntity,
						'DstJobFk': step2Result.routeEntity.DstJobFk,
						'Resources': resource,
						'IntervalHours': step2Result.routeEntity.IntervalHours
					};
				} else {
					url = 'transportplanning/transport/route/addreturnpackages';
					postData = {
						'Route': step2Result.routeEntity,
						'DstWPFk': step2Result.routeEntity.DstWPFk,
						'Waypoint': step2Result.routeEntity.waypointEntity,
						'Resources': resource
					};
				}
				$http.post(globals.webApiBaseUrl + url, postData).then(function (result) {
					if (step2Result.model === '1') {
						if (result.data) {
							transportMainService.appendNewItem(result.data);
							$scope.$close(true);
						}
					} else {
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
					}
				}, function () {
					$scope.isBusy = false;
				});
			};
		}

		return {initialize: initialize};
	}

})(angular);