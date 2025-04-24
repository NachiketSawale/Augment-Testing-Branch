(function () {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemDetailerTaskSummaryController', [
		'$scope',
		'platformSourceWindowControllerService',
		'ppsItemDetailerTaskFilterService',
		'productionplanningItemDataService',
		'moment',
		'$http',
		'$injector',
		'ppsCommonFixGroupingService',
		function ($scope,
				  platformSourceWindowControllerService,
				  ppsItemDetailerTaskFilterService,
				  productionplanningItemDataService,
				  moment,
				  $http,
				  $injector,
				  ppsCommonFixGroupingService) {

			var sourceFSName = 'ppsItemDetailerTaskFilterService';
			var uuid = $scope.getContainerUUID();
			platformSourceWindowControllerService.initSourceFilterController($scope, uuid,
				'productionplanningItemContainerInformationService', sourceFSName);

			function onSelectedChanged(e, item) {
				if (item) {
					$http.get(globals.webApiBaseUrl + 'productionplanning/item/getEvent?type=5&itemId=' + item.Id).then(function (response) {
						if (response && response.data) {
							ppsItemDetailerTaskFilterService.entity.startingDate = moment(response.data.PlannedStart);
						}
					});
				}
			}

			function onListLoaded() {
				ppsCommonFixGroupingService.expandGroup($scope);
			}

			var conf = $injector.get('productionplanningItemContainerInformationService').getContainerInfoByGuid(uuid);
			var dataSrv = _.isString(conf.dataServiceName) ? $injector.get(conf.dataServiceName) : conf.dataServiceName;
			dataSrv.registerListLoaded(onListLoaded);

			productionplanningItemDataService.registerSelectionChanged(onSelectedChanged);
			onSelectedChanged(null,productionplanningItemDataService.getSelected());

			var groupingService = ppsCommonFixGroupingService.setGrouping($scope, 'weekinfo');

			$scope.$on('$destroy', function () {
				groupingService();
				productionplanningItemDataService.unregisterSelectionChanged(onSelectedChanged);
				dataSrv.unregisterListLoaded(onListLoaded);
			});
		}
	]);
})();