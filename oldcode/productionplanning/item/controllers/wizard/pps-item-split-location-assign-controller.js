/**
 * Created by anl on 6/28/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningItemSplitLocationAssignController', Controller);
	Controller.$inject = [
		'$scope',
		'productionplanningItemSplitLocationAssignService',
		'platformGridAPI',
		'$interval',
		'_',
		'productionplanningItemDataService'];

	function Controller($scope,
						itemSplitLocationAssignService,
						platformGridAPI,
						$interval,
						_,
						ppsItemDataService) {


		itemSplitLocationAssignService.init($scope);

		function updateContext(object, type) {
			//console.log('update');
			switch (type) {
				case 'NewItems':
					$scope.context.splitedItems = object;
					break;
				case 'Events':
					$scope.context.events = object;
					break;
				case 'Item2Events':
					$scope.context.item2events = object;
					break;
				case 'EventInfos':
					$scope.context.eventInfos = object;
					break;
				case 'NewLocation':
					if ($scope.context.locations) {
						$scope.context.locations = $scope.context.locations.concat(object);
					}
					else {
						$scope.context.locations = [];
						$scope.context.locations.push(object);
					}
					break;
				case 'UpdateLocation':
					if ($scope.context.locations.length === 0) {
						$scope.context.locations = [object];
					}
					else {
						var locationIndex = _.findIndex($scope.context.locations, {Id: object.Id});
						if (locationIndex >= 0) {
							$scope.context.locations[locationIndex] = object;
						}
					}
					break;
				case 'DeleteLocation':
					var ids = _.map($scope.context.locations, 'Id');
					var index = ids.indexOf(object.Id);
					if(index > -1){
						$scope.context.locations.splice(index, 1);
					}
					break;
				case 'UpdateItem':
					var itemIndex = _.findIndex($scope.context.splitedItems, {Id: object.Id});
					if (itemIndex >= 0) {
						object.PpsItem.PrjLocationFk = object.LocationParentFk;
						$scope.context.splitedItems[itemIndex] = object.PpsItem;
						updateRelatedEvents($scope.context, object.PpsItem);
					}
					break;
				case 'UpdateEvent':
					var item2events = $scope.context.item2events;
					var events = $scope.context.events;
					var eventInfos = $scope.context.eventInfos;
					var cell = object.grid.getColumns()[object.cell].field;
					var name = cell.substr(9); //DateInfo.xxxx
					var orders = _.map(eventInfos, function(value, key){
						if(_.keys(value)[0] === name){
							return key;
						}
					});
					var order = _.find(orders, function(value){ return angular.isDefined(value); });

					var item2Event = _.find(item2events, {ItemFk: object.item.Id, SequenceOrder: parseInt(order)});
					if (item2Event) {
						var event = _.find(events, {Id: item2Event.EventFk});
						itemSplitLocationAssignService.shiftDate(event, object.item.DateInfo[name]);
						//event.PlannedStart = object.item.DateInfo[name];
					}
					break;
			}
		}

		//update event's location, quantity
		function updateRelatedEvents(context, item){
			var events = context.events;
			var itemEvents = _.filter(events, function(e){
				return e.ItemFk === item.Id;
			});
			_.forEach(itemEvents, function(e){
				e.PrjLocationFk = item.PrjLocationFk;
			});
		}

		itemSplitLocationAssignService.registerUpdateContext(updateContext);

		function onCellChange(e, args) {
			var col = args.grid.getColumns()[args.cell].field;
			var domain = args.grid.getColumns()[args.cell].domain;
			if (!args.item.IsSplitedItem && (col === 'Code' || col === 'Description' || col === 'Sorting')) {
				itemSplitLocationAssignService.updateContext.fire(args.item, 'UpdateLocation');
			}
			else if (args.item.IsSplitedItem &&
				(col === 'Code' || col === 'PpsItem.Quantity' || col === 'PpsItem.SiteFk')) {
				if(col === 'Code'){
					args.item.PpsItem.Code = args.item.Code;
					itemSplitLocationAssignService.validateCode(args.item);
				}
				else if(col === 'PpsItem.Quantity'){
					updateQuantityCell();
				}
				itemSplitLocationAssignService.updateContext.fire(args.item, 'UpdateItem');
			}
			else if (domain === 'datetimeutc') {
				itemSplitLocationAssignService.updateContext.fire(args, 'UpdateEvent');
			}
		}

		function onRowCountChanged(){
			itemSplitLocationAssignService.onRowCountChanged();
		}

		platformGridAPI.events.register($scope.gridOptions.locationGrid.state, 'onCellChange', onCellChange);
		platformGridAPI.events.register($scope.gridOptions.locationGrid.state, 'onRowCountChanged', onRowCountChanged);


		var updateQuantityCell = function(){
			var mainItemGrid = platformGridAPI.grids.element('id', $scope.gridOptions.mainItemGrid.state);
			if (mainItemGrid && mainItemGrid.instance) {
				var splitedItems = $scope.context.splitedItems;
				var totalQuantity = 0;
				_.forEach(splitedItems, function (item) {
					totalQuantity += item.Quantity;
				});
				var parentItem = $scope.parentItem;
				if($scope.context.splitMode === false){
					var list = _.filter(ppsItemDataService.getList(), function (item){
						return item.PPSItemFk === parentItem.Id;
					});
					_.forEach(list, function (matItem){
						totalQuantity += matItem.Quantity;
					});
				}
				parentItem.RemainQuantity = parentItem.Quantity - totalQuantity;
				itemSplitLocationAssignService.setRemainQuantity(parentItem.RemainQuantity);
				$scope.gridOptions.mainItemGrid.dataView.setItems([parentItem]);
				platformGridAPI.grids.refresh($scope.gridOptions.mainItemGrid.state, true);
			}
		};

		$scope.$on('$destroy', function () {
			itemSplitLocationAssignService.unregisterUpdateContext(updateContext);
			itemSplitLocationAssignService.clearContext();
			itemSplitLocationAssignService.unregisterDateshift();
			platformGridAPI.events.unregister($scope.gridOptions.locationGrid.state, 'onCellChange', onCellChange);
			platformGridAPI.events.unregister($scope.gridOptions.locationGrid.state, 'onRowCountChanged', onRowCountChanged);
			platformGridAPI.grids.unregister($scope.gridOptions.mainItemGrid.state);
			platformGridAPI.grids.unregister($scope.gridOptions.locationGrid.state);
		});
	}
})(angular);