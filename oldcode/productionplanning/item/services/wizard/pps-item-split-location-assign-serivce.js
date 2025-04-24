/**
 * Created by anl on 7/1/2019.
 */

(function (angular) {
	'use strict';

	/*global angular, globals, Slick, moment, Platform*/

	var moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemSplitLocationAssignService', LocationAssignService);

	LocationAssignService.$inject = ['$http', 'platformGridAPI', '$q', '$translate', '_',
		'productionplanningItemSplitUIService',
		'cloudCommonGridService',
		'$interval',
		'platformDateshiftHelperService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'basicsCompanyNumberGenerationInfoService'];

	function LocationAssignService(
		$http, platformGridAPI, $q, $translate, _,
		itemSplitUIService,
		cloudCommonGridService,
		$interval,
		platformDateshiftHelperService,
		platformRuntimeDataService,
		basicsLookupdataLookupDescriptorService,
		basicsCompanyNumberGenerationInfoService) {

		var service = {};
		var scope = {};
		var firstTime;
		var parentItem, splitConfig, eventInfos, events, item2events, locations, remainQuantity, allEvents, relations = [],
			calendarData;
		var codeValidation = true;

		//For Moveup/down
		var selectedPositions = [];
		var selectedLocations = [];
		var minPosition, maxPosition = 0;

		var cuttedLocations = [];

		var lastDateShiftEvent;

		service.updateContext = new Platform.Messenger();

		service.registerUpdateContext = function registerUpdateContext(callBackFn) {
			service.updateContext.register(callBackFn);
		};

		service.unregisterUpdateContext = function unregisterUpdateContext(callBackFn) {
			service.updateContext.unregister(callBackFn);
		};

		service.unregisterDateshift = function unregisterDateshift() {
			platformDateshiftHelperService.unregisterDateshift(service);
		};

		service.init = function ($scope) {
			firstTime = true;
			scope = $scope;
			service.active();
		};

		service.getModule = function () {//for validation
			return 'productionplanningItemSplitLocationAssignService';
		};

		service.busy = function (flag) {
			scope.isLoading = flag;
		};

		service.isValid = function () {
			return codeValidation && !scope.isLoading;
		};

		service.unActive = function () {
			platformGridAPI.grids.unregister(scope.gridOptions.mainItemGrid.state);
			platformGridAPI.grids.unregister(scope.gridOptions.locationGrid.state);
			var defer = $q.defer();
			defer.resolve(true);
			return defer.promise;
		};

		service.active = function () {
			//set new LocationItem data
			if (scope.context.config.Updated) {
				scope.isLoading = true;
				var mainItemGridConfig = itemSplitUIService.getMainItemListConfig();
				var locationGridConfig = itemSplitUIService.getLocationConfig();

				var dynamicEventColumn = itemSplitUIService.getDynamicColumns(eventInfos);
				locationGridConfig.columns = locationGridConfig.columns.concat(dynamicEventColumn);

				if (firstTime) {
					if(parentItem){
						var mainItemGrid = {
							id: mainItemGridConfig.state,
							columns: mainItemGridConfig.columns,
							data: [{
								Id: 1,
								Code: 'code',
								MaterialGroup: parentItem.MaterialGroupFk,
								Quantity: parentItem.Quantity,
								RemainQuantity: 0,
								ProductionDate: new moment()
							}],
							lazyInit: true,
							options: {
								indicator: true,
								editable: false,
								idProperty: 'Id',
								skipPermissionCheck: true,
								selectionModel: new Slick.RowSelectionModel()
							},
							state: mainItemGridConfig.state
						};
						platformGridAPI.grids.config(mainItemGrid);
					}

					var locationGrid = {
						id: locationGridConfig.state,
						columns: locationGridConfig.columns,
						lazyInit: true,
						options: {
							indicator: true,
							editable: true,
							idProperty: 'Id',
							tree: true,
							parentProp: 'LocationParentFk',
							childProp: 'CustomLocations',
							//allowRowDrag: true,
							hierarchyEnabled: true,
							skipPermissionCheck: true,
							selectionModel: new Slick.RowSelectionModel()
						},
						state: locationGridConfig.state,
						toolbarItemsDisabled: false,
						tools: initLocationToolButton()
					};

					//add dateshift helper
					platformDateshiftHelperService.registerDateshift(service);
					var dateshiftToolConfig = [
						{
							id: 'fullshift',
							value: true,
							hidden: true
						}
					];
					locationGrid.dateShiftModeTools = platformDateshiftHelperService.getDateshiftTools(service.getServiceName(), dateshiftToolConfig, 'default', locationGrid);
					_.forEachRight(locationGrid.dateShiftModeTools, function (tool) {
						locationGrid.tools.items.unshift(tool);
					});

					locationGrid.tools.update = function () {
					};
					platformGridAPI.grids.config(locationGrid);

					scope.gridOptions = {
						mainItemGrid: mainItemGrid,
						locationGrid: locationGrid
					};

					firstTime = false;
				} else {
					var existLocationGrid = platformGridAPI.grids.element('id', locationGridConfig.state);
					if (existLocationGrid) {
						platformGridAPI.columns.configuration(locationGridConfig.state, locationGridConfig.columns);
						platformGridAPI.configuration.refresh(locationGridConfig.state);
						platformGridAPI.columns.resetColumns(locationGridConfig.state);
					}
				}

				//always reset
				platformDateshiftHelperService.resetDateshift(service.getServiceName());

				scope.context.config.Updated = false;
				scope.context.locations = [];
				$interval(setData, 1000, 1);
			}
		};

		service.getResult = function () {
			//console.log('Location Result');
		};

		service.setRemainQuantity = function (rQuantity) {
			remainQuantity = rQuantity;
		};

		service.initCache = function (item, config, response) {
			parentItem = item;
			splitConfig = config;
			locations = response.data.Locations;
			events = _.filter(response.data.Events, {IsHidden: false});
			item2events = response.data.Item2Events;
			eventInfos = response.data.EventInfos;
			remainQuantity = response.data.RemainQuantity;

			//for dateshift!
			relations = response.data.Relations;
			allEvents = response.data.Events;
			calendarData = response.data.CalendarData;
		};

		service.clearContext = function () {
			scope.context.splitedItems = [];
			scope.context.events = [];
			scope.context.item2events = [];
			scope.context.locations = [];
			scope.context.eventInfo = [];
		};


		//region: dateshift methods

		service.getServiceName = function () {
			return service.getModule();
		};

		service.getDateshiftData = function () {
			var dateshiftConfig = {
				id: 'Id',
				end: 'PlannedFinish',
				start: 'PlannedStart',
				nextEdgeKey: 'SuccessorFk',
				prevEdgeKey: 'PredecessorFk'
			};

			return {
				originalActivities: allEvents,
				relations: relations,
				config: dateshiftConfig,
				calendarData: calendarData
			};
		};

		service.getList = function () {
			return allEvents;
		};
		service.isItemFilterEnabled = function () {
			return false;
		};

		service.shiftDate = function (triggerEvent, value) {
			if (lastDateShiftEvent !== triggerEvent.Id) {
				platformDateshiftHelperService.resetDateshift(service.getServiceName());
				lastDateShiftEvent = triggerEvent.Id;
			}
			triggerEvent = _.cloneDeep(triggerEvent);
			triggerEvent.PlannedStart = value;
			//set planned finish if string
			if (!moment.isMoment(triggerEvent.PlannedFinish)) {
				triggerEvent.PlannedFinish = moment(triggerEvent.PlannedFinish).utc();
			}
			platformDateshiftHelperService.shiftDate(service.getServiceName(), triggerEvent);
		};

		service.postProcessDateshift = function (dateshiftResult) {
			//merge to information to item data
			var changedEvents = _.filter(dateshiftResult, 'hasChanged');
			_.forEach(changedEvents, function (event) {
				if (!_.find(events, {Id: event.Id})) {
					events.push(event);
				}
			});
			var changedItemIds = _.uniq(_.map(changedEvents, 'ItemFk'));
			var flatLocations = flattenLocations(locations);
			var items = _.filter(flatLocations, function (item) {
				return item.IsSplitedItem && changedItemIds.includes(item.Id);
			});
			_.forEach(items, function (item) {
				var changedEventsOfItem = _.filter(changedEvents, {ItemFk: item.Id});
				_.forEach(changedEventsOfItem, function (event) {
					//get sequence order etc.
					var item2Event = _.find(item2events, {ItemFk: item.Id, EventFk: event.Id});
					var eventInfo = eventInfos[item2Event.SequenceOrder.toString()];
					var eventInfoName = _.first(_.keys(eventInfo));
					item.DateInfo[eventInfoName] = event.PlannedStart;
				});
			});
			//refresh grid
			platformGridAPI.grids.refresh(scope.gridOptions.locationGrid.state, true);
		};

		function setData() {
			translateFakeLocation();
			cuttedLocations = [];
			if(parentItem){
				parentItem.RemainQuantity = remainQuantity;
				parentItem.ProductionDate = events[events.length - 1].PlannedStart;
				//After set parentItem eventTime, remove it
				//Set MainItem Grid Data
				scope.gridOptions.mainItemGrid.dataView.setItems([parentItem]);
				platformGridAPI.grids.refresh(scope.gridOptions.mainItemGrid.state, true);
			}
			events = _.filter(events, function (e) {
				return e.ItemFk !== scope.context.parentItem.Id;
			});

			//Set Location Grid Data
			var items = getSplitedItems(locations);
			updateLocations(locations);
			scope.gridOptions.locationGrid.dataView.setItems(locations);
			scope.gridOptions.locationGrid.data = locations;
			platformGridAPI.items.data(scope.gridOptions.locationGrid.state, locations);
			platformGridAPI.grids.refresh(scope.gridOptions.locationGrid.state, true);

			//store splitedItem, events, item2events
			service.updateContext.fire(items, 'NewItems');
			service.updateContext.fire(events, 'Events');
			service.updateContext.fire(eventInfos, 'EventInfos');
			service.updateContext.fire(item2events, 'Item2Events');

			platformGridAPI.grids.resize(scope.gridOptions.locationGrid.state);
			scope.isLoading = false;
		}

		service.onRowCountChanged = function () {
			var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
			var project = basicsLookupdataLookupDescriptorService.getLookupItem('Project', scope.context.parentItem.ProjectFk);

			_.forEach(shownLocations, function (item) {
				if (!item.IsSplitedItem && !_.isNil(item.__rt$data)) {
					setLocationColumnReadOnly(item, project);
				}
			});
		};

		service.validateCode = function validateCode(entity){
			//1. validate shown items
			var result = {};
			var restSplitedItems = _.filter(_.clone(scope.context.splitedItems), function(item){
				return item.Id !== entity.Id;
			});
			if(entity.Code === null || entity.Code ===''){
				result = {
					valid: false,
					apply: true,
					error: 'The Code is Mandatory',
					error$tr$: 'cloud.common.emptyOrNullValueErrorMessage'
				};
				applyCodeValidation(result, entity);
				return;
			}

			result = _.find(restSplitedItems, {Code: entity.Code}) ? {
				valid: false,
				apply: true,
				error: 'The Code should be unique',
				error$tr$: 'productionplanning.item.validation.errors.uniqCode'
			} : {apply: true, valid: true, error: ''};
			applyCodeValidation(result, entity);

			//2. validate database items
			if (result.valid) {
				var postData = {Id: entity.PpsItem.Id, Code: entity.Code, ProjectId: scope.context.parentItem.ProjectFk};
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/isuniquecode',
					postData).then(function (response) {
					if (response.data) {
						result = {apply: true, valid: true, error: ''};
					} else {
						result = {
							valid: false,
							apply: true,
							error: 'The Code should be unique',
							error$tr$: 'productionplanning.item.validation.errors.uniqCode'
						};
					}
					applyCodeValidation(result, entity);
				});
			}
		};

		function applyCodeValidation(result, entity){
			platformRuntimeDataService.applyValidationResult(result, entity, 'Code');
			platformGridAPI.grids.refresh(scope.gridOptions.locationGrid.state, true);
			codeValidation = result.valid;
			if(codeValidation) {
				var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
				var flatLocations = flattenLocations(shownLocations);
				var itemLocations = _.filter(flatLocations, function (location) {
					return location.IsSplitedItem;
				});
				_.forEach(itemLocations, function(item){
					if(angular.isDefined(item.__rt$data) && angular.isDefined(item.__rt$data.errors) &&
						angular.isDefined(item.__rt$data.errors.Code) && item.__rt$data.errors.Code !== null){
						service.validateCode(item);
					}
				});
			}
		}

		function setLocationColumnReadOnly(item, project) {
			_.forEach(eventInfos, function (eventInfo) {
				var dateName = _.keys(eventInfo);
				platformGridAPI.cells.readonly({
					gridId: scope.gridOptions.locationGrid.state,
					item: item,
					field: 'DateInfo.' + dateName
				});
			});
			platformGridAPI.cells.readonly({
				gridId: scope.gridOptions.locationGrid.state,
				item: item,
				field: 'PpsItem.Quantity'
			});
			platformGridAPI.cells.readonly({
				gridId: scope.gridOptions.locationGrid.state,
				item: item,
				field: 'PpsItem.SiteFk'
			});

			if (item.Version === 0 && project && project.RubricCatLocationFk &&
				basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService').hasToGenerateForRubricCategory(project.RubricCatLocationFk)) {
				item.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('projectLocationNumberInfoService').provideNumberDefaultText(project.RubricCatLocationFk, item.Code);
				platformGridAPI.cells.readonly({
					gridId: scope.gridOptions.locationGrid.state,
					item: item,
					field: 'Code'
				});
			}

			if (item.Id === -1) {
				platformGridAPI.cells.readonly({
					gridId: scope.gridOptions.locationGrid.state,
					item: item,
					field: 'Code'
				});
				platformGridAPI.cells.readonly({
					gridId: scope.gridOptions.locationGrid.state,
					item: item,
					field: 'Description'
				});
			}
		}

		//Get SplitedItems From Locations-Tree
		function getSplitedItems(locations) {
			var flatLocations = flattenLocations(locations);

			var itemLocations = _.filter(flatLocations, function (location) {
				return location.IsSplitedItem;
			});

			return _.map(itemLocations, 'PpsItem');
		}

		function setEventStartTime(items) {
			_.forEach(items, function (item) {
				var filterItem2events = _.filter(item2events, function (item2event) {
					return item2event.ItemFk === item.Id;
				});
				var alleventIds = _.map(events, 'Id');
				var currentItemEventIds = _.map(filterItem2events, 'EventFk');
				currentItemEventIds = _.filter(currentItemEventIds, function (currentItemEventId) {
					return _.includes(alleventIds, currentItemEventId);
				});
				var relatedEvents = _.filter(events, function (event) {
					return _.includes(currentItemEventIds, event.Id);
				});
				item.DateInfo = {};

				var orders = _.keys(eventInfos);
				_.forEach(orders, function (order) {
					var eventInfo = eventInfos[order];
					var item2event = _.find(filterItem2events, {SequenceOrder: parseInt(order)});
					var event = _.find(relatedEvents, {Id: item2event.EventFk});
					var name = _.keys(eventInfo);
					item.DateInfo[name] = moment(event.PlannedStart).utc();
				});
			});
		}

		function updateLocations(locations) {
			var flatLocations = flattenLocations(locations);
			var items = _.filter(flatLocations, function (location) {
				return location.IsSplitedItem;
			});
			if (items.length > 0) {
				setEventStartTime(items);
				var parentLocation = _.filter(flatLocations, function (location) {
					return location.Id === items[0].LocationParentFk;
				});
				parentLocation.CustomLocations = _.filter(parentLocation.CustomLocations, function (location) {
					return !location.IsSplitedItem;
				});
				parentLocation.CustomLocations = parentLocation.CustomLocations.concat(items);

				return _.filter(flatLocations, function (location) {
					return location.LocationParentFk === null;
				});
			}
		}

		function flattenLocations(locations) {
			var output = [];
			return cloudCommonGridService.flatten(locations, output, 'CustomLocations');
		}

		function createLocation(scope, type) {
			//var originFlatLocations = flattenLocations(scope.gridOptions.locationGrid.dataView.getItems());
			var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
			var position = scope.gridOptions.locationGrid.instance.getSelectedRows()[0];
			var selectedLocation = shownLocations[position];
			var projectId = selectedLocation && selectedLocation.Id !== -1 ? selectedLocation.ProjectId : scope.context.parentItem.ProjectFk;
			var locationParentId = selectedLocation ? selectedLocation.LocationParentFk : null;
			$http.get(globals.webApiBaseUrl + 'productionplanning/item/createlocation?ProjectId=' +
				projectId + '&LocationParentFk=' + locationParentId).then(function (response) {
				//var originFlatLocations = flattenLocations(scope.gridOptions.locationGrid.dataView.getItems());
				var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
				var newFlatLocations = angular.copy(shownLocations);
				var newLocation = response.data;
				newLocation.Version = 0;
				var targetPosition = shownLocations.length;
				if (selectedLocation && type === 'Sub') {
					newLocation.image = 'control-icons ico-location2';
					newLocation.LocationParentFk = selectedLocation.Id;
					targetPosition = getPosition(shownLocations, selectedLocation.Id);

					updateTargetLocation('DOWN1', newFlatLocations, targetPosition, [newLocation]);

					var flat = flattenLocations([shownLocations[targetPosition]]);

					refreshLocationGrid(newFlatLocations, targetPosition + flat.length);
				} else if (type === 'Root') {
					if (selectedLocation) {
						newLocation.LocationParentFk = selectedLocation.LocationParentFk;

						var parentPosition = getPosition(shownLocations, selectedLocation.LocationParentFk);
						if (parentPosition > 0) {
							targetPosition = parentPosition;
							var parentLocation = shownLocations[targetPosition];
							updateTargetLocation('DOWN1', newFlatLocations, targetPosition, [newLocation]);
							newLocation.image = 'control-icons ico-location2';

							var lastLocation = parentLocation.CustomLocations[parentLocation.CustomLocations.length - 1];
							var lastPosition = lastLocation.CustomLocations === null && !lastLocation.nodeInfo.collapsed ? getPosition(shownLocations, lastLocation.Id)
								: getPosition(shownLocations, lastLocation.Id) + lastLocation.CustomLocations.length;

							refreshLocationGrid(newFlatLocations, lastPosition + 1);
						} else {
							newLocation.LocationParentFk = shownLocations[0].LocationParentFk;
							newFlatLocations[targetPosition] = response.data;
							newLocation.image = 'control-icons ico-location-group';
							refreshLocationGrid(newFlatLocations, targetPosition);
						}
					} else {
						newLocation.LocationParentFk = shownLocations[0].LocationParentFk;
						newFlatLocations[targetPosition] = response.data;
						newLocation.image = 'control-icons ico-location-group';
						refreshLocationGrid(newFlatLocations, targetPosition);
					}

				}

				//fire UpdateContext
				service.updateContext.fire(newLocation, 'NewLocation');
			});
		}

		function updateSplitedItemNodeInfo(targetLocation, selectedLocations) {
			_.forEach(selectedLocations, function (splitedItem) {
				splitedItem.nodeInfo.level = targetLocation.nodeInfo.level + 1;
			});
		}

		function refreshLocationGrid(shownLocations, positions) {
			var newFlatLocations = _.filter(shownLocations, function (location) {
				return location.LocationParentFk === null;
			});
			if (positions.length > 0) {
				scope.gridOptions.locationGrid.dataView.setItems(newFlatLocations);
				scope.gridOptions.locationGrid.instance.setSelectedRows(positions);
				scope.gridOptions.locationGrid.instance.resetActiveCell();
			} else {
				scope.gridOptions.locationGrid.dataView.setItems(newFlatLocations);
				scope.gridOptions.locationGrid.instance.setSelectedRows([positions]);
				scope.gridOptions.locationGrid.instance.resetActiveCell();
			}
			platformGridAPI.grids.refresh(scope.gridOptions.locationGrid.state, true);
		}

		function customLocationMoveUp(scope) {
			selectedLocations = [];
			var originFlatLocations = scope.gridOptions.locationGrid.dataView.getRows();
			//flattenLocations(scope.gridOptions.locationGrid.dataView.getItems());
			var newFlatLocations = angular.copy(originFlatLocations);
			selectedPositions = getSelectedPositions(originFlatLocations);

			var targetPosition = 0;
			var parentPosition = 0;
			var upperPosition = minPosition - 1;
			var minSelectedLocation = originFlatLocations[minPosition];
			var upperLocation = originFlatLocations[upperPosition];

			if (!upperLocation.IsSplitedItem) {
				if (minSelectedLocation.LocationParentFk === upperLocation.Id) {
					//  --> targetLocation
					//  --> parentLocation(upper)
					//  	--> Item
					targetPosition = upperPosition - 1;
					parentPosition = upperPosition;

					if (originFlatLocations[targetPosition].IsSplitedItem) {
						/*
						 Need to refact to solve sorting
						 */
						newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);

						minSelectedLocation.LocationParentFk = originFlatLocations[targetPosition].LocationParentFk;
						_.forEach(selectedLocations, function (selectedLocation) {
							selectedLocation.LocationParentFk = originFlatLocations[targetPosition].LocationParentFk;
							//selectedLocation.PpsItem.PrjLocationFk = originFlatLocations[targetPosition].LocationParentFk;
						});

						targetPosition = getPosition(originFlatLocations, minSelectedLocation.LocationParentFk);
						upperLocation = originFlatLocations[upperPosition - 1];
						updateTargetLocation('UP1', newFlatLocations, targetPosition, selectedLocations, upperLocation);
					} else {
						_.forEach(selectedLocations, function (selectedLocation) {
							selectedLocation.LocationParentFk = originFlatLocations[targetPosition].Id;
							//selectedLocation.PpsItem.PrjLocationFk = originFlatLocations[targetPosition].Id;
						});
						updateTargetLocation('UP', newFlatLocations, targetPosition, selectedLocations, upperLocation);
					}
					newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);
				} else {
					//  --> ParentLocation
					//  	--> upperLocation (target)
					//  	--> Item
					targetPosition = upperPosition;
					parentPosition = getPosition(originFlatLocations, minSelectedLocation.LocationParentFk);
					newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);

					_.forEach(selectedLocations, function (selectedLocation) {
						selectedLocation.LocationParentFk = upperLocation.Id;
						//selectedLocation.PpsItem.PrjLocationFk = upperLocation.Id;
					});
					updateTargetLocation('UP', newFlatLocations, targetPosition, selectedLocations, upperLocation);

					//in order to set selectedRow
					upperPosition = minPosition;
				}
			} else {
				//  --> ParentLocation
				//  	--> Item
				//  	--> Item
				targetPosition = getPosition(originFlatLocations, minSelectedLocation.LocationParentFk);
				updateTargetLocation('UP', newFlatLocations, targetPosition, selectedLocations, upperLocation);
			}

			// 2. set and refresh grid
			var positions = [];
			for (var i = 0; i < selectedPositions.length; i++) {
				positions.push(upperPosition + i);
			}

			//3. update nodeInfo of SplitedItem
			updateSplitedItemNodeInfo(newFlatLocations[targetPosition], selectedLocations);

			//4.filter newLocation list and refresh
			refreshLocationGrid(newFlatLocations, positions);

			_.forEach(selectedLocations, function (selectedLocation) {
				service.updateContext.fire(selectedLocation, 'UpdateItem');
			});
		}

		function customLocationMoveDown(scope) {
			selectedLocations = [];
			var originFlatLocations = scope.gridOptions.locationGrid.dataView.getRows();
			var newFlatLocations = angular.copy(originFlatLocations);
			selectedPositions = getSelectedPositions(originFlatLocations);

			var targetPosition = 0;
			var parentPosition = 0;
			var lowerPosition = maxPosition + 1;
			var maxSelectedLocation = originFlatLocations[maxPosition];
			var lowerLocation = originFlatLocations[lowerPosition];

			if (!lowerLocation.IsSplitedItem) {
				targetPosition = lowerPosition;
				parentPosition = getPosition(originFlatLocations, maxSelectedLocation.LocationParentFk);
				newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);

				_.forEach(selectedLocations, function (selectedLocation) {
					selectedLocation.LocationParentFk = lowerLocation.Id;
					selectedLocation.PpsItem.PrjLocationFk = lowerLocation.Id;
				});
				updateTargetLocation('DOWN', newFlatLocations, targetPosition, selectedLocations);
			} else {
				/*
				 Need to refact to solve sorting
				 */
				parentPosition = getPosition(originFlatLocations, maxSelectedLocation.LocationParentFk);
				newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);

				if (maxSelectedLocation.LocationParentFk === lowerLocation.LocationParentFk) {
					targetPosition = getPosition(originFlatLocations, maxSelectedLocation.LocationParentFk);
				} else {
					targetPosition = getPosition(originFlatLocations, lowerLocation.LocationParentFk);
				}

				_.forEach(selectedLocations, function (selectedLocation) {
					selectedLocation.LocationParentFk = lowerLocation.LocationParentFk;
					selectedLocation.PpsItem.PrjLocationFk = lowerLocation.LocationParentFk;
				});
				updateTargetLocation('DOWN', newFlatLocations, targetPosition, selectedLocations, lowerLocation);

			}

			//2. set and refresh grid
			var positions = [];
			for (var i = 0; i < selectedPositions.length; i++) {
				positions.push(lowerPosition - i);
			}

			//3. update nodeInfo of SplitedItem
			updateSplitedItemNodeInfo(newFlatLocations[targetPosition], selectedLocations);

			//4.filter newLocation list and refresh
			refreshLocationGrid(newFlatLocations, positions);

			_.forEach(selectedLocations, function (selectedLocation) {
				service.updateContext.fire(selectedLocation, 'UpdateItem');
			});
		}

		function customLocationMoveTop(scope) { //jshint ignore:line
			selectedLocations = [];
			var originFlatLocations = scope.gridOptions.locationGrid.dataView.getRows();
			var newFlatLocations = angular.copy(originFlatLocations);
			selectedPositions = getSelectedPositions(originFlatLocations);

			var targetLocation = originFlatLocations[0];
			var minSelectedLocation = originFlatLocations[minPosition];
			var parentPosition = getPosition(originFlatLocations, minSelectedLocation.LocationParentFk);
			newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);

			_.forEach(selectedLocations, function (selectedLocation) {
				selectedLocation.LocationParentFk = targetLocation.Id;
				//selectedLocation.PpsItem.PrjLocationFk = upperLocation.Id;
			});
			updateTargetLocation('UP', newFlatLocations, 0, selectedLocations);

			// 2. set and refresh grid
			var positions = [];
			var beginPosition = 1;
			for (var i = 0; i < selectedPositions.length; i++) {
				positions.push(beginPosition + i);
			}

			//3. update nodeInfo of SplitedItem
			updateSplitedItemNodeInfo(newFlatLocations[0], selectedLocations);

			//4.filter newLocation list and refresh
			refreshLocationGrid(newFlatLocations, positions);

			_.forEach(selectedLocations, function (selectedLocation) {
				service.updateContext.fire(selectedLocation, 'UpdateItem');
			});
		}

		function customLocationMoveBottom(scope) { //jshint ignore:line
			selectedLocations = [];
			var originFlatLocations = scope.gridOptions.locationGrid.dataView.getRows();
			selectedPositions = getSelectedPositions(originFlatLocations);

			var newFlatLocations = _.filter(originFlatLocations, function (location) {
				return location.LocationParentFk === null;
			});
			var targetPosition = getPosition(originFlatLocations, newFlatLocations[newFlatLocations.length - 1].Id);
			var targetLocation = newFlatLocations[newFlatLocations.length - 1];

			newFlatLocations = angular.copy(originFlatLocations);
			var maxSelectedLocation = originFlatLocations[maxPosition];
			var parentPosition = getPosition(originFlatLocations, maxSelectedLocation.LocationParentFk);
			newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);

			_.forEach(selectedLocations, function (selectedLocation) {
				selectedLocation.LocationParentFk = targetLocation.Id;
			});
			updateTargetLocation('DOWN', newFlatLocations, targetPosition, selectedLocations);

			// 2. set and refresh grid
			var positions = [];
			var beginPosition = targetPosition - selectedPositions.length + 1;
			for (var i = 0; i < selectedPositions.length; i++) {
				positions.push(beginPosition + i);
			}

			//3. update nodeInfo of SplitedItem
			updateSplitedItemNodeInfo(newFlatLocations[0], selectedLocations);

			//4.filter newLocation list and refresh
			refreshLocationGrid(newFlatLocations, positions);

			_.forEach(selectedLocations, function (selectedLocation) {
				service.updateContext.fire(selectedLocation, 'UpdateItem');
			});
		}

		function customLocationMoveUpper() {  //jshint ignore:line
			selectedLocations = [];
			var originFlatLocations = scope.gridOptions.locationGrid.dataView.getRows();
			var newFlatLocations = angular.copy(originFlatLocations);
			var rootLocations = _.filter(newFlatLocations, function (location) {
				return location.LocationParentFk === null;
			});
			selectedPositions = getSelectedPositions(originFlatLocations);

			var minSelectedLocation = originFlatLocations[minPosition];
			var parentPosition = getPosition(originFlatLocations, minSelectedLocation.LocationParentFk);
			newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);

			//get current root
			var rootPosition = getCurrentRootPosition(minSelectedLocation, originFlatLocations, rootLocations);
			if (rootPosition === 0) {
				rootPosition++;
			}

			var targetPosition = getPosition(originFlatLocations, rootLocations[rootPosition - 1].Id);
			var targetLocation = originFlatLocations[targetPosition];
			_.forEach(selectedLocations, function (selectedLocation) {
				selectedLocation.LocationParentFk = targetLocation.Id;
			});
			updateTargetLocation('UP', newFlatLocations, targetPosition, selectedLocations);

			// 2. set and refresh grid
			var positions = [];
			var beginPosition = targetPosition + 1;
			for (var i = 0; i < selectedPositions.length; i++) {
				positions.push(beginPosition + i);
			}

			//3. update nodeInfo of SplitedItem
			updateSplitedItemNodeInfo(newFlatLocations[targetPosition], selectedLocations);

			//4.filter newLocation list and refresh
			refreshLocationGrid(newFlatLocations, positions);

			_.forEach(selectedLocations, function (selectedLocation) {
				service.updateContext.fire(selectedLocation, 'UpdateItem');
			});
		}

		function customLocationMoveLower() {  //jshint ignore:line
			selectedLocations = [];
			var originFlatLocations = scope.gridOptions.locationGrid.dataView.getRows();
			var newFlatLocations = angular.copy(originFlatLocations);
			var rootLocations = _.filter(newFlatLocations, function (location) {
				return location.LocationParentFk === null;
			});
			selectedPositions = getSelectedPositions(originFlatLocations);

			var maxSelectedLocation = originFlatLocations[maxPosition];
			var parentPosition = getPosition(originFlatLocations, maxSelectedLocation.LocationParentFk);
			newFlatLocations[parentPosition].CustomLocations = updateOriginLocation(newFlatLocations, parentPosition, selectedLocations);

			//get current root
			var rootPosition = getCurrentRootPosition(maxSelectedLocation, originFlatLocations, rootLocations);
			if (rootPosition === rootLocations.length - 1) {
				rootPosition--;
			}
			var targetPosition = getPosition(originFlatLocations, rootLocations[rootPosition + 1].Id);
			var targetLocation = originFlatLocations[targetPosition];
			_.forEach(selectedLocations, function (selectedLocation) {
				selectedLocation.LocationParentFk = targetLocation.Id;
			});
			updateTargetLocation('DOWN', newFlatLocations, targetPosition, selectedLocations);

			// 2. set and refresh grid
			var positions = [];
			var beginPosition = targetPosition - selectedPositions.length + 1;
			for (var i = 0; i < selectedPositions.length; i++) {
				positions.push(beginPosition + i);
			}

			//3. update nodeInfo of SplitedItem
			updateSplitedItemNodeInfo(newFlatLocations[targetPosition], selectedLocations);

			//4.filter newLocation list and refresh
			refreshLocationGrid(newFlatLocations, positions);

			_.forEach(selectedLocations, function (selectedLocation) {
				service.updateContext.fire(selectedLocation, 'UpdateItem');
			});
		}

		function getCurrentRootPosition(selectedLocation, originFlatLocations, rootLocations) {
			var rootPosition = 0;
			var tempLocation = selectedLocation;
			while (tempLocation) {
				var parentPosition = getPosition(originFlatLocations, tempLocation.LocationParentFk);
				tempLocation = originFlatLocations[parentPosition];
				if (tempLocation.LocationParentFk === null) {
					break;
				}
			}
			rootPosition = getPosition(rootLocations, tempLocation.Id);

			return rootPosition;
		}

		function getSelectedPositions(originFlatLocations) {
			selectedLocations = [];
			selectedPositions = scope.gridOptions.locationGrid.instance.getSelectedRows();
			selectedPositions = _.sortBy(selectedPositions, function (position) {
				return position;
			});

			//init selectedPositions, minPosition, maxPosition
			_.forEach(selectedPositions, function (position) {
				selectedLocations.push(originFlatLocations[position]);
			});

			minPosition = _.min(selectedPositions);
			maxPosition = _.max(selectedPositions);

			return selectedPositions;
		}

		function getPosition(originFlatLocations, Id) {
			var position = -1;
			for (var k = 0; k < originFlatLocations.length; k++) {
				if (originFlatLocations[k].Id === Id) {
					position = k;
					break;
				}
			}
			return position;
		}

		function updateTargetLocation(type, newFlatLocations, targetPosition, slocations, nextLocation) {
			var selectedIds = _.map(slocations, 'Id');
			//var addLocations = false;
			var newLocationChildren = [];
			if (!_.isNil(newFlatLocations[targetPosition].CustomLocations) && newFlatLocations[targetPosition].CustomLocations.length > 0) {
				if (type.indexOf('UP') > -1) {
					if (type.indexOf('UP1') > -1) {
						_.forEach(newFlatLocations[targetPosition].CustomLocations, function (childLocation) {
							if (childLocation.IsSplitedItem) {
								newLocationChildren.push(childLocation);
							}
						});

						//make sure selecteds following ppsItem which is already in parent
						_.forEach(slocations, function (location) {
							newLocationChildren.push(location);
						});

						_.forEach(newFlatLocations[targetPosition].CustomLocations, function (childLocation) {
							if (!childLocation.IsSplitedItem) {
								newLocationChildren.push(childLocation);
							}
						});
					} else {
						//make sure the selecteds are adjacent to parent closest
						_.forEach(slocations, function (location) {
							newLocationChildren.push(location);
						});
						_.forEach(newFlatLocations[targetPosition].CustomLocations, function (childLocation) {
							if (angular.isDefined(nextLocation) && nextLocation.Id === childLocation.Id) {
								newLocationChildren.push(childLocation);
							} else {
								if (!_.includes(selectedIds, childLocation.Id)) {
									newLocationChildren.push(childLocation);
								}
							}
						});
					}
				} else if (type.indexOf('DOWN') > -1) {
					newLocationChildren = [];
					if (type.indexOf('DOWN1') > -1) { //for create subLocation
						newLocationChildren = angular.copy(newFlatLocations[targetPosition].CustomLocations);
						_.forEach(slocations, function (location) {
							newLocationChildren.push(location);
						});
					} else if (angular.isDefined(nextLocation) && nextLocation.IsSplitedItem) {
						_.forEach(newFlatLocations[targetPosition].CustomLocations, function (childLocation) {
							if (nextLocation.Id === childLocation.Id) {
								newLocationChildren.push(childLocation);
								_.forEach(slocations, function (location) {
									newLocationChildren.push(location);
								});
							} else {
								if (!_.includes(selectedIds, childLocation.Id)) {
									newLocationChildren.push(childLocation);
								}
							}
						});
					} else {
						newLocationChildren = slocations;
						_.forEach(newFlatLocations[targetPosition].CustomLocations, function (childLocation) {
							if (!_.includes(selectedIds, childLocation.Id)) {
								newLocationChildren.push(childLocation);
							}
						});
					}
				}

				newFlatLocations[targetPosition].CustomLocations = newLocationChildren;
				newFlatLocations[targetPosition].nodeInfo.collapsed = false;
			} else {
				newFlatLocations[targetPosition].CustomLocations = [];
				_.forEach(slocations, function (location) {
					newFlatLocations[targetPosition].CustomLocations.push(location);
				});
			}
		}

		function updateOriginLocation(newFlatLocations, parentPosition, sLocations) {
			var selectedLocationIds = _.map(sLocations, 'Id');
			return _.filter(newFlatLocations[parentPosition].CustomLocations, function (location) {
				return !_.includes(selectedLocationIds, location.Id);
			});
		}

		function disabledButtons(type) {
			if (scope.gridOptions.locationGrid.instance && scope.gridOptions.locationGrid.dataView) {
				var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();

				selectedPositions = getSelectedPositions(shownLocations);

				var prjLocation = _.filter(selectedPositions, function (position) {
					return position < shownLocations.length && angular.isDefined(shownLocations[position]) && !shownLocations[position].IsSplitedItem;
				});

				if (type === 'DOWN') {
					return !(maxPosition && maxPosition < shownLocations.length - 1 && prjLocation.length === 0);
				} else if (type === 'UP') {
					return !(minPosition && minPosition > 1 && prjLocation.length === 0);
				} else if (type === 'CUT') {
					return !(selectedPositions.length > 0 && prjLocation.length === 0);
				} else if (type === 'PASTE') {
					var selected = shownLocations[minPosition];
					return !(selectedPositions.length === 1 && angular.isDefined(selected) && !selected.IsSplitedItem && cuttedLocations.length > 0);
				} else if (type === 'DELETE') {
					if (angular.isDefined(scope.context.locations) && angular.isDefined(shownLocations[minPosition])) {
						var selectedLocation = shownLocations[minPosition];
						var ids = _.map(scope.context.locations, 'Id');
						var index = ids.indexOf(shownLocations[minPosition].Id);
						return !(selectedPositions.length === 1 && !selectedLocation.IsSplitedItem && !selectedLocation.nodeInfo.children && index > -1 &&
							selectedLocation.Id !== -1);
					}
				} else if (type === 'INDENT' || type === 'OUTDENT') {
					var existFakeLocation = _.filter(selectedPositions, function (position) {
						return position === 0 || position === 1 || position === (1 + shownLocations[0].CustomLocations.length);
					});
					return selectedPositions.length > 0 && prjLocation.length === selectedPositions.length &&
						existFakeLocation.length === 0;
				}
			}
			return true;
		}

		function disabledCreateSub() {
			if (scope.gridOptions.locationGrid.instance && scope.gridOptions.locationGrid.dataView) {
				var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
				selectedPositions = scope.gridOptions.locationGrid.instance.getSelectedRows();
				var selected = shownLocations[selectedPositions[0]];
				return !(selectedPositions.length === 1 && angular.isDefined(selected) && !selected.IsSplitedItem &&
					selected.Id !== -1);
			}
			return true;
		}

		function cutLocations() {
			var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
			selectedPositions = [];
			if (cuttedLocations.length === 0) {
				selectedPositions = getSelectedPositions(shownLocations);
				cuttedLocations = selectedLocations;
				_.forEach(selectedPositions, function (position) {
					shownLocations[position].image = 'tlb-icons ico-cut';
				});
				refreshLocationGrid(shownLocations, selectedPositions);
			} else {
				var cuttedPositions = [];
				_.forEach(cuttedLocations, function (location) {
					var position = getPosition(shownLocations, location.Id);
					cuttedPositions.push(position);
					shownLocations[position].image = 'app-small-icons ico-production-planning';
				});

				selectedPositions = getSelectedPositions(shownLocations);
				cuttedLocations = selectedLocations;
				_.forEach(selectedPositions, function (position) {
					shownLocations[position].image = 'tlb-icons ico-cut';
				});
				refreshLocationGrid(shownLocations, selectedPositions);
			}
		}

		function pasteLocations() {
			var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
			selectedPositions = getSelectedPositions(shownLocations);
			var targetPosition = selectedPositions[0];
			var selectedLocation = shownLocations[targetPosition];

			var focusPositions = [];
			var beginPosition = targetPosition, index = 0;

			_.forEach(cuttedLocations, function (cutLocation) {
				//1. remove cuttedLocations from parent
				var parentPosition = getPosition(shownLocations, cutLocation.LocationParentFk);
				shownLocations[parentPosition].CustomLocations = updateOriginLocation(shownLocations, parentPosition, cuttedLocations);

				cutLocation.LocationParentFk = selectedLocation.Id;
				cutLocation.PpsItem.PrjLocationFk = selectedLocation.Id;
				cutLocation.image = 'app-small-icons ico-production-planning';

				//set focus position
				beginPosition = targetPosition > parentPosition ? beginPosition - 1 : beginPosition;
			});

			//2. update nodeInfo of SplitedItem
			updateSplitedItemNodeInfo(shownLocations[targetPosition], cuttedLocations);

			//3. add cuttedLocation to new parent children
			updateTargetLocation('DOWN', shownLocations, selectedPositions[0], angular.copy(cuttedLocations));

			//set focus position
			beginPosition++;
			for (index = 0; index < cuttedLocations.length; index++) {
				focusPositions.push(beginPosition + index);
			}

			//4. filter newLocation list and refresh
			refreshLocationGrid(shownLocations, focusPositions);

			_.forEach(cuttedLocations, function (cutLocation) {
				service.updateContext.fire(cutLocation, 'UpdateItem');
			});
			cuttedLocations = [];
		}

		function deleteLocation() {
			var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
			selectedPositions = getSelectedPositions(shownLocations);
			var targetPosition = selectedPositions[0];
			var selectedLocation = shownLocations[targetPosition];

			var parentPosition = getPosition(shownLocations, selectedLocation.LocationParentFk);
			if (parentPosition >= 0) {
				shownLocations[parentPosition].CustomLocations = updateOriginLocation(shownLocations, parentPosition, [selectedLocation]);
			} else {
				shownLocations.splice(shownLocations.length - 1, 1);
			}
			refreshLocationGrid(shownLocations, {});
			service.updateContext.fire(selectedLocation, 'DeleteLocation');
		}

		function upgradeLocation(grid) {
			var destination, locationToMove, oldParent, parentFk;
			var position = grid.instance.getSelectedRows();
			var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
			locationToMove = shownLocations[position];

			if (locationToMove && locationToMove.Id) {
				parentFk = locationToMove.LocationParentFk;
				if (parentFk) {
					var oldParentPosition = getPosition(shownLocations, locationToMove.LocationParentFk);
					oldParent = shownLocations[oldParentPosition];
					var destinationPosition = getPosition(shownLocations, oldParent.LocationParentFk);
					destination = shownLocations[destinationPosition];

					if (destination && destination.Id) {
						locationToMove.LocationParentFk = oldParent.LocationParentFk;
						locationToMove.nodeInfo.level = locationToMove.nodeInfo.level - 1;
						destination.CustomLocations.push(locationToMove);

						_.remove(oldParent.CustomLocations, function (treeItem) {
							return treeItem.Id === locationToMove.Id;
						});
					} else {
						locationToMove.LocationParentFk = null;
						locationToMove.nodeInfo.level = 0;
						locationToMove.image = 'control-icons ico-location-group';

						_.remove(oldParent.CustomLocations, function (treeItem) {
							return treeItem.Id === locationToMove.Id;
						});
					}
				}

				refreshLocationGrid(shownLocations, {});
				grid.instance.setSelectedRows([position]);
				service.updateContext.fire(locationToMove, 'UpdateLocation');
			}
		}

		function downgradeLocation(grid) {
			var locations, index, locationToMove, newParent, oldParent;
			var position = grid.instance.getSelectedRows();
			var shownLocations = scope.gridOptions.locationGrid.dataView.getRows();
			locationToMove = shownLocations[position];

			if (locationToMove && locationToMove.Id) {
				if (locationToMove.LocationParentFk) {
					var oldParentPosition = getPosition(shownLocations, locationToMove.LocationParentFk);
					oldParent = shownLocations[oldParentPosition];
					locations = oldParent.CustomLocations;
				} else {
					var rootLocations = _.filter(shownLocations, function (location) {
						return location.LocationParentFk === null;
					});
					locations = rootLocations;
				}

				index = locations.indexOf(locationToMove);
				if (index > 0) {
					newParent = locations[index - 1];
				}

				if (newParent && newParent.Id) {
					newParent.CustomLocations.push(locationToMove);
					locationToMove.LocationParentFk = newParent.Id;
					locationToMove.nodeInfo.level++;
					locationToMove.image = 'control-icons ico-location2';

					if (oldParent) {
						_.remove(oldParent.CustomLocations, function (treeItem) {
							return treeItem.Id === locationToMove.Id;
						});
					}
					refreshLocationGrid(shownLocations, {});
					grid.instance.setSelectedRows([position]);
					service.updateContext.fire(locationToMove, 'UpdateLocation');
				}
			}
		}

		function initLocationToolButton() {
			return {
				showImages: false,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't1',
						caption: $translate.instant('productionplanning.item.wizard.itemSplit.createNewBtn'),
						iconClass: 'tlb-icons ico-rec-new',
						type: 'item',
						fn: function () {
							createLocation(scope, 'Root');
						}
					},
					{
						id: 't2',
						caption: $translate.instant('productionplanning.item.wizard.itemSplit.createSubBtn'),
						iconClass: 'tlb-icons ico-sub-fld-new',
						type: 'item',
						fn: function () {
							createLocation(scope, 'Sub');
						},
						disabled: function () {
							return disabledCreateSub();
						}
					},
					{
						id: 't2',
						caption: $translate.instant('cloud.common.toolbarDelete'),
						iconClass: 'tlb-icons ico-delete',
						type: 'item',
						fn: function () {
							deleteLocation(scope, 'Sub');
						},
						disabled: function () {
							return disabledButtons('DELETE');
						}
					},
					{
						id: 'd1',
						prio: 50,
						type: 'divider',
						isSet: true
					},
					{
						id: 't3',
						caption: $translate.instant('productionplanning.item.wizard.itemSplit.moveUp'),
						iconClass: 'tlb-icons ico-grid-row-up',
						type: 'item',
						fn: function () {
							customLocationMoveUp(scope);
						},
						disabled: function () {
							return disabledButtons('UP');
						}
					},
					{
						id: 't4',
						caption: $translate.instant('productionplanning.item.wizard.itemSplit.moveDown'),
						iconClass: 'tlb-icons ico-grid-row-down',
						type: 'item',
						fn: function () {
							customLocationMoveDown(scope);
						},
						disabled: function () {
							return disabledButtons('DOWN');
						}
					},
					{
						id: 'd2',
						prio: 50,
						type: 'divider',
						isSet: true
					},
					{
						id: 't5',
						caption: $translate.instant('cloud.common.toolbarCut'),
						iconClass: 'tlb-icons ico-cut',
						type: 'item',
						fn: function () {
							cutLocations(scope);
						},
						disabled: function () {
							return disabledButtons('CUT');
						}
					},
					{
						id: 't6',
						caption: $translate.instant('cloud.common.toolbarPaste'),
						iconClass: 'tlb-icons ico-paste',
						type: 'item',
						fn: function () {
							pasteLocations(scope);
						},
						disabled: function () {
							return disabledButtons('PASTE');
						}
					},
					{
						id: 'd3',
						prio: 50,
						type: 'divider',
						isSet: true
					},
					{
						id: 't7',
						caption: 'project.location.downgradeLocation',
						type: 'item',
						iconClass: 'tlb-icons ico-demote',
						disabled: function () {
							return !disabledButtons('INDENT');
						},
						fn: function () {
							downgradeLocation(scope.gridOptions.locationGrid);
						}
					},
					{
						id: 't8',
						caption: 'project.location.upgradeLocation',
						type: 'item',
						iconClass: 'tlb-icons ico-promote',
						disabled: function () {
							return !disabledButtons('OUTDENT');
						},
						fn: function () {
							upgradeLocation(scope.gridOptions.locationGrid);
						}
					}

				]
			};
		}

		function translateFakeLocation() {
			var fakeLocation = locations[0];
			fakeLocation.Code = $translate.instant('productionplanning.item.wizard.itemSplit.fakeLocationCode');
			fakeLocation.Description = $translate.instant('productionplanning.item.wizard.itemSplit.fakeLocationDesc');
		}

		return service;

	}

})(angular);