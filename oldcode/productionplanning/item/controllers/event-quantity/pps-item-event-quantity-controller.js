/**
 * Created by anl on 8/21/2019.
 */

(function (angular) {
	/* global angular, globals */
	'use strict';

	let moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemEventQuantityDialogController', EventQuantityDialogController);

	EventQuantityDialogController.$inject = ['$scope', '$options', '$interval', '$injector',
		'productionplanningItemEventQuantityDialogService',
		'platformGridAPI',
		'platformRuntimeDataService',
		'productionplanningItemUtilService',
		'productionplanningCommonEventMainServiceFactory'];

	function EventQuantityDialogController(
		$scope, $options, $interval, $injector,
		eventQuantityDialogService,
		platformGridAPI,
		platformRuntimeDataService,
		utilService,
		eventMainServiceFactory) {

		var eventService = {};
		if (eventMainServiceFactory.hasService('productionplanning.common.item.event')) {
			eventService = eventMainServiceFactory.getService('', 'productionplanning.common.item.event');
		}

		var events = $options.events;
		var selectedItem = $options.selectedItem;
		var selectedTask = $options.selectedTask;
		var itemDataService = $options.itemService;
		var module = $options.module;

		eventQuantityDialogService.init($scope, events);
		$interval(initData, 1000, 1);

		function initData() {
			var eventGrid = platformGridAPI.grids.element('id', $scope.eventGrid.id);
			if (eventGrid && eventGrid.dataView) {
				var events = eventGrid.dataView.getItems();
				var foundTaskEvent = false;
				_.forEach(events, function (event) {
					event.QuantityChanged = true;
					if(module !== null && module === 'EngineeringTask'){
						if(event.Id === selectedTask.PpsEventFk){
							foundTaskEvent = true;
							return;
						}
						else if(foundTaskEvent){
							event.Quantity = selectedItem.Quantity;
						}
					}else{
						event.Quantity = selectedItem.Quantity;
					}

					if(event.ItemFk !== selectedItem.Id) {
						setQuantityReadonly(event);
					}
				});

				//#119889 -- for those items are splited from engTask, which dont show engTask event in Event-Quantity-Change container
				if(!foundTaskEvent && module === 'EngineeringTask')
				{
					_.forEach(events, function (event) {
						event.QuantityChanged = true;
						event.Quantity = selectedItem.Quantity;
					});
				}

				platformGridAPI.grids.refresh($scope.eventGrid.id, true);
				$scope.isLoading = false;
			}
		}

		function setQuantityReadonly(entity) {
			var fields = [];
			fields.push({
				field: 'Quantity',
				readonly: true
			});
			platformRuntimeDataService.readonly(entity, fields);
		}

		$scope.isOKDisabled = () =>{
			return $scope.isLoading;
		};

		$scope.handleOK = function () {
			platformGridAPI.grids.commitEdit($scope.eventGrid.id);
			var eventGrid = platformGridAPI.grids.element('id', $scope.eventGrid.id);
			if (eventGrid && eventGrid.dataView) {
				var events = eventGrid.dataView.getItems();
				var changedEvents = _.filter(events, function (event) {
					return event.QuantityChanged;
				});
				if (utilService.hasShowContainer('productionplanning.item.itemEvent')) {
					eventService.onEventUpdated.fire(changedEvents);
				}
				itemDataService.setQuantityChangedEvents(changedEvents);
			}
			$scope.$close(false);
		};

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.grids.unregister($scope.eventGrid.id);
		});
	}
})(angular);
