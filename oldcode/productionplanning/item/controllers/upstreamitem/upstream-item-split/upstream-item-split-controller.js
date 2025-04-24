/**
 * Created by anl on 8/24/2021.
 */
(function (angular) {
	'use strict';
	/*global _, globals, angular*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemUpstreamItemSplitController', UpstreamItemSplitController);
	UpstreamItemSplitController.$inject = [
		'$http',
		'$scope',
		'$options',
		'$injector',
		'$translate',
		'platformModalService',
		'productionplanningItemSplitWizardStepsService',
		'productionplanningItemUtilService',
		'$timeout'];

	function UpstreamItemSplitController(
		$http, $scope, $options, $injector, $translate, platformModalService, stepsService, utilService, $timeout) {

		$scope.selected = $options.selected;
		$scope.isBusy = false;

		$scope.context = {
			selectedUpstreamItem: $options.selected,
			selectedItems: [],
			updatedItems: []
		};
		$scope.title = $translate.instant('productionplanning.item.upstreamItem.split');
		$scope.steps = [
			{
				url: 'productionplanning.item/partials/pps-upstream-item-split-selection.html',
				service: 'productionplanningItemUpstreamItemSplitSelectionService',
				title: $translate.instant('productionplanning.item.upstreamItem.selection'),
				isInitialized: true
			},
			{
				url: 'productionplanning.item/partials/pps-upstream-item-split-allocation.html',
				service: 'productionplanningItemUpstreamItemSplitAllocationService',
				title: $translate.instant('productionplanning.item.upstreamItem.allocation')
			}
		];
		$scope.finish = finish;

		stepsService.initialize($scope, finish);

		_.extend($scope.modalOptions, {
			cancel: close
		});

		function close() {
			return $scope.$close(false);
		}

		$scope.$on('$destroy', function () {
		});

		function finish(allocationService) {
			allocationService.busy(true);
			var result = allocationService.getResult();

			var upstreamItemInfo = [];

			_.forEach(result.selectedItems, function(item){
				var updatedItem = _.find(result.updatedItems, {Id: item.Id});
				var createNew = 2;
				//0-update, 1-create, 2-keep
				if(item.UpstreamItemQuantity === null && updatedItem.UpstreamItemQuantity !== null){
					createNew = 1;
				}
				else if(updatedItem.UpstreamItemQuantity !== item.UpstreamItemQuantity){
					createNew = 0;
				}

				upstreamItemInfo.push({
					PpsItemId: updatedItem.Id,
					UpstreamItemQuantity: updatedItem.UpstreamItemQuantity,
					CreateNew: createNew
				});
			});

			var postData = {
				SelectedUpstreamItem: result.selectedUpstreamItem,
				UpstreamItemInfos: upstreamItemInfo
			};
			$http.post(globals.webApiBaseUrl + 'productionplanning/item/upstreamitem/saveupstreamitems', postData)
				.then(function (response) {
					if(response.data) {
						const containers = {
							// container id: service key
							// upstream item
							'productionplanning.header.ppsupstreamitem.list': 'productionplanning.header.ppsitem.upstreamitem',
							'productionplanning.item.ppsupstreamitem.list': 'productionplanning.item.upstreamitem',
							'productionplanning.engineering.ppsitem.ppsupstreamitem.list': 'productionplanning.engineering.ppsitem.upstreamitem',
							// split upstream item
							'productionplanning.header.ppssplitppsupstreamitem.list': 'productionplanning.header.ppsitem.splitupstreamitem',
							'productionplanning.item.ppssplitupstreamitem.list': 'productionplanning.item.splitupstreamitem',
							'productionplanning.engineering.ppsitem.ppssplitupstreamitem.list': 'productionplanning.engineering.ppsitem.splitupstreamitem',
						};

						// reload data if container is shown
						const upstreamService = $injector.get('ppsUpstreamItemDataService');
						for (const containerId of Object.keys(containers)) {
							if (utilService.hasShowContainer(containerId)) {
								upstreamService.getService({
									serviceKey: containers[containerId]
								}).load();
							}
						}

						$timeout(function () {
							var msg = $translate.instant('productionplanning.item.upstreamItem.splitSuccess');
							platformModalService.showMsgBox(msg, 'Info', 'ico-info');
							allocationService.busy(false);
							$scope.$close(false);
						}, 1000);
					}
				});
		}
	}
})(angular);