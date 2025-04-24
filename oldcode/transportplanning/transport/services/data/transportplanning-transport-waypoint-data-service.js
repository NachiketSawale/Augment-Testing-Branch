(function (angular) {
	'use strict';
	/* global globals,angular,Platform,_ */
	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningTransportWaypointDataService
	 * @function
	 *
	 * @description
	 * transportplanningTransportWaypointDataService is the data service for Waypoint.
	 */

	transportModule.factory('transportplanningTransportWaypointDataService', transportplanningTransportWaypointDataService);
	transportplanningTransportWaypointDataService.$inject = [
		'$injector', 'platformDataServiceFactory', '$http',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'transportplanningTransportMainService',
		'basicsLookupdataLookupFilterService',
		'transportplanningTransportWaypointProcessor',
		'transportplanningTransportWaypointReadOnlyProcessor',
		'transportplanningTransportRouteStatusLookupService',
		'transportplanningTransportCalculationDistanceWithoutMapService',
		'platformModalService',
		'platformGridAPI'
	];

	function transportplanningTransportWaypointDataService($injector, platformDataServiceFactory, $http,
														   platformDataServiceProcessDatesBySchemeExtension,
														   basicsLookupdataLookupDescriptorService,
														   basicsCommonMandatoryProcessor,
														   parentService,
														   basicsLookupdataLookupFilterService,
														   waypointProcessor,
														   waypointReadOnlyProcessor,
														   routeStatusServ,
														   trsCalculationDistanceWithoutMapService,
														   platformModalService,
														   platformGridAPI) {

		function getMaxNumber(items) {
			if (items) {
				var numbers = [0];
				_.each(items, function (item) {
					if (item) {
						numbers.push(convertToNumber(item.Code));
					}
				});
				return _.max(numbers);
			}
			return 0;
		}

		function convertToNumber(str) {
			if (str === '' || str === null || str === undefined) {
				return 0;
			}
			var arr = [];
			for (var i = str.length - 1; i >= 0; i--) {
				if (str[i] >= '0' && str[i] <= '9') {
					arr.push(str[i]);
				}
			}
			return parseInt(arr.reverse().join(''));
		}

		function getMaxSorting(items) {
			if (items && items.length > 0) {
				var sortings = _.map(items, 'Sorting');
				return _.max(sortings);
			}
			return -1;
		}

		var serviceInfo = {
			flatNodeItem: {
				module: transportModule,
				serviceName: 'transportplanningTransportWaypointDataService',
				entityNameTranslationID: 'transportplanning.transport.waypointListTitle',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'TrsWaypointDto',
					moduleSubModule: 'TransportPlanning.Transport'
				}), waypointProcessor, waypointReadOnlyProcessor],
				httpCreate: {
					route: globals.webApiBaseUrl + 'transportplanning/transport/waypoint/',
					endCreate: 'createwaypoint'
				},
				httpRead: {route: globals.webApiBaseUrl + 'transportplanning/transport/waypoint/'},
				entityRole: {
					node: {
						itemName: 'TrsWaypoint',
						parentService: parentService,
						parentFilter: 'routeId'
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.Main || []
							};
							var ret = container.data.handleReadSucceeded(result, data);
							container.service.appendUnSavedNewItems();
							return ret;
						},
						initCreationData: function (creationData) {
							//set PKey1 for creation
							var selected = parentService.getSelected();
							if (selected) {
								creationData.PKey1 = selected.Id;
							}
							//add existed codes for creation
							creationData.existedCodes = [];
							_.each(container.service.getList(), function (item) {
								creationData.existedCodes.push(item.Code);
							});
						},
						handleCreateSucceeded: function (newItem) {
							var list = container.service.getList();
							//check code
							var maxNumber = getMaxNumber(list);
							var num = convertToNumber(newItem.Code);
							if (num <= maxNumber) {
								num = maxNumber + 1;
								newItem.Code = (num < 10) ? ('0' + num) : num.toString();
								//remark:for Code, ignore prefix before number at the moment
							}
							newItem.Sorting = getMaxSorting(list) + 1;
							return newItem;
						}
					}
				},
				actions: {
					delete: {},
					canCreateCallBackFunc: function () {
						var parentItem = parentService.getSelected();
						if (parentItem.readonly) {//remark:field "readonly" of route entity is set in transportplanningTransportReadOnlyProcessor
							return false;
						}
						if (!parentItem.TrsRteStatusFk) {
							return false;
						}
						var statusList = routeStatusServ.getList();
						var status = _.find(statusList, {Id: parentItem.TrsRteStatusFk});
						return status && status.IsInTransport === false;
					},
					create: 'flat',
					canDeleteCallBackFunc: function (selectedItem) {
						if (selectedItem.Version <= 0) {
							return true;
						}

						var parentItem = parentService.getSelected();
						if (parentItem.readonly) {//remark:field "readonly" of route entity is set in transportplanningTransportReadOnlyProcessor
							return false;
						}
						if (!parentItem.TrsRteStatusFk) {
							return false;
						}
						var statusList = routeStatusServ.getList();
						var status = _.find(statusList, {Id: parentItem.TrsRteStatusFk});
						return status && status.IsInTransport === false;
					}
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'TrsWaypointDto',
			moduleSubModule: 'TransportPlanning.Transport',
			validationService: 'transportplanningTransportWaypointValidationService',
			mustValidateFields: ['UomFk', 'Distance']
		});

		var filters = [
			{
				key: 'transportplanning-transport-waypoint-uomfk-filter',
				fn: function (item) {
					if (item) {
						return item.LengthDimension !== null && item.LengthDimension === 1;
					}
					return false;
				}
			}
		];

		container.service.updateJobRelatedProperties = function (entity, selected) {
			if (entity) {
				selected = selected || {};
				var validationService = $injector.get('platformValidationByDataService').getValidationServiceByDataService(container.service);
				validationService.validateLgmJobFk(entity, entity.LgmJobFk, 'LgmJobFk');
				var relatedProperties = ['BusinessPartnerFk', 'DeliveryAddressContactFk', 'SubsidiaryFk', 'CustomerFk'];
				relatedProperties.forEach(function (item) {
					entity[item] = selected[item];
				});
				container.data.markItemAsModified(entity, container.data);
				container.data.mergeItemAfterSuccessfullUpdate(entity, entity, true, container.data);
			}
		};

		container.service.calculateDistance = function (type) {
			var list = container.service.getList();
			var mapService = $injector.get('transportplanningTransportMapDataService');
			switch (type) {
				case 'PlannedTime':
					if (mapService && list.length > 1) {
						list = _.sortBy(list, 'PlannedTime');
						mapService.setCalculateDist(list, moduleName);
					}
					break;

				case 'LgmJobFk':
					var selected = container.service.getSelected();
					//Here we must get the newest job info for calculating by async.Don't get job info from the job lookup data, in case the job has been changed in job module, and the job lookup data is old.
					$http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + selected.LgmJobFk).then(function (respond) {
						var job = respond.data;
						if (job.Address !== null && job.Address !== undefined) {
							// selected.Address = job.Address;
							var editWP = _.find(list, {Id: selected.Id});
							editWP.Address = job.Address;
							if (mapService && list.length > 1) {
								mapService.setCalculateDist(list, moduleName);
							}
						}
					});
					break;
				default:
					break;
			}
		};

		container.service.changeDistance = function (entity, value) {
			if (entity.Distance > 0 && entity.UomFk !== null && value !== null) {
				var strIds = _.toString([value]);
				$http.get(globals.webApiBaseUrl + 'transportplanning/transport/waypoint/conversionfactor?originUnitId=' + entity.UomFk + '&&unitIds=' + strIds).then(function (response) {
					var factorMaps = response.data.factorInfo;
					var factor = _.find(factorMaps, {unitId: value}).converFactor;
					entity.Distance = entity.Distance * factor;
					container.service.gridRefresh();
				});
			}
		};

		container.service.getFirstWaypoint = function () {
			var wpList = container.service.getList();
			return wpList.length > 0 ? wpList[0] : null;
		};

		container.service.setWaypointDistanceUom = function (selectedUom) {
			var waypoint = container.service.getSelected();
			waypoint.UomFk = selectedUom ? selectedUom.Id : null;

			container.data.markItemAsModified(waypoint, container.data);
			container.data.mergeItemAfterSuccessfullUpdate(waypoint, waypoint, true, container.data);
		};

		container.service.recalculateRoutes = function () {
			var bShowMap = true;
			var unliService = $injector.get('transportplanningTransportUtilService');
			if (unliService) {
				bShowMap = unliService.hasShowContainer('transportplanning.transport.routemap');
			}
			if (bShowMap === false) {
				//window.alert('need to open map container ');
				platformModalService.showMsgBox('Need to open map container!', 'Notes of Recalculate Distances', 'info');
				return;
			}
			var list = container.service.getList();
			if (list.length === 0) {
				return;
			} else if (list.length === 1) {
				var waypoint = list[0];
				waypoint.Distance = 0;
				container.service.markEntitiesAsModified(list);
			} else {
				var mapService = $injector.get('transportplanningTransportMapDataService');
				if (mapService) {
					mapService.setCalculateDist(list, moduleName);
				}
			}
		};

		//trsCalculationDistanceWithoutMapService.init();
		container.service.recalculateDistance = function () {
			var list = container.service.getList();
			if (list.length === 1) {
				var waypoint = list[0];
				waypoint.Distance = 0;
				container.service.markEntitiesAsModified(list);
			} else {
				trsCalculationDistanceWithoutMapService.recalculateDistance(list).then(function (data) {
					var originUnitInfo = data.unitInfo;
					var distances = data.distances;
					distances.unshift(0);
					var mapService = $injector.get('transportplanningTransportMapDataService');
					if (mapService) {
						mapService.setDistance(originUnitInfo, distances);
					}
				});
			}
		};


		container.service.canRecalculate = function () {
			var list = container.service.getList();
			return list.length >= 2;
		};

		container.service.registerFilter = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};
		container.service.unregisterFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};
		container.service.registerFilter();
		//container.service.registerEntityDeleted(container.service.recalculateRoutes);
		container.service.registerEntityDeleted(parentService.updateRouteDeliveryFieldsByWaypoint);

		container.service.fieldChanged = new Platform.Messenger();

		container.service.handleFieldChanged = function (entity, field) {
			$injector.get('transportplanningTransportWaypointDataServiceEntityPropertychangedExtension').onPropertyChanged(entity, field, container.service);
			container.service.fieldChanged.fire(entity, field);
		};

		// Pep: Templatory solution for creating new item by custom creation data, it is better implemented in the base class.
		container.service.createItemSimple = function createItem(creationOptions, customCreationData, onCreateSucceeded) {
			var data = container.data;
			var creationData = _.merge(data.doPrepareCreate(data, creationOptions), customCreationData);
			return data.doCallHTTPCreate(creationData, data, onCreateSucceeded);
		};

		container.service.updateSimple = function (updateData) {
			return $http.post(globals.webApiBaseUrl + 'transportplanning/transport/waypoint/save', updateData);
		};

		container.service.moveUp = function () {
			if (canMove(1)) {
				moveItem(1);
			}
		};

		container.service.moveDown = function () {
			if (canMove(2)) {
				moveItem(2);
			}
		};

		container.service.appendUnSavedNewItems = function (dtos, delay) {
			container.data.unSavedNewItems = dtos || container.data.unSavedNewItems;
			if (container.data.unSavedNewItems) {
				var selectedRoute = parentService.getSelected();
				if (selectedRoute && selectedRoute.isAddingTrsGood) {//check isAddingTrsGood to avoid append data after refresh
					var existeds = container.data.getList();
					_.forEach(container.data.unSavedNewItems, function (dto) {
						if (dto && selectedRoute.Id === dto.TrsRouteFk && !_.find(existeds, {Id: dto.Id})) {//check the TrsRouteFk to avoid append data to other entity
							dto.ignoreInitPlannedTime = true;
							container.data.onCreateSucceeded(dto, container.data);
						}
					});
				}
				if (!delay) {
					container.data.unSavedNewItems = null;
				}
			}
		};

		function getGridSelectedInfos(gridId) {
			var selectedInfo = {};
			var gridinstance = platformGridAPI.grids.element('id', gridId).instance;

			selectedInfo.selectedRows = angular.isDefined(gridinstance) ? gridinstance.getSelectedRows() : [];

			selectedInfo.selectedItems = selectedInfo.selectedRows.map(function (row) {
				return gridinstance.getDataItem(row);
			});

			return selectedInfo;
		}

		function switchSorting(item1, item2, items) {
			if (item1.Sorting === item2.Sorting) {
				var sorting = 0;
				_.each(items, function (item) {
					item.Sorting = sorting;
					sorting += 1;
					container.service.markItemAsModified(item);
				});
			}

			var tmp = item1.Sorting;
			item1.Sorting = item2.Sorting;
			item2.Sorting = tmp;
			container.service.markItemAsModified(item1);
			container.service.markItemAsModified(item2);
		}

		function moveItem(type) {
			var gridId = '2ce6d855a43844d595fe5c2ce8d86ae6';
			var items = platformGridAPI.items.data(gridId);
			var selectedData = getGridSelectedInfos(gridId);
			var i, selectedIndex;

			switch (type) {
				case 1: //moveUp
					for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] - 1 >= 0); i++) {
						selectedIndex = selectedData.selectedRows[i];
						switchSorting(items[selectedIndex - 1], items[selectedIndex], items);
						items.splice(selectedIndex - 1, 0, items.splice(selectedIndex, 1)[0]);
					}
					break;
				case 2: //moveDown
					selectedData.selectedRows = selectedData.selectedRows.reverse();
					for (i = 0; (i < selectedData.selectedRows.length && selectedData.selectedRows[i] + 1 < items.length); i++) {
						selectedIndex = selectedData.selectedRows[i];
						switchSorting(items[selectedIndex + 1], items[selectedIndex], items);
						items.splice(selectedIndex + 1, 0, items.splice(selectedIndex, 1)[0]);
					}
					break;
			}

			platformGridAPI.items.data(gridId, items);
			platformGridAPI.rows.selection({gridId: gridId, rows: selectedData.selectedItems});
		}

		function canMove(type) {
			var gridId = '2ce6d855a43844d595fe5c2ce8d86ae6';
			var result = false;
			var items = platformGridAPI.items.data(gridId);
			var selectedData = getGridSelectedInfos(gridId);

			switch (type) {
				case 1: //canMoveUp
					if (!_.isNil(items) && items.length > 0 && !_.isNil(selectedData) && selectedData.selectedRows.length > 0) {
						result = items[0].Id !== selectedData.selectedRows.Id;
					}
					break;
				case 2: //canMoveDown
					if (!_.isNil(items) && items.length > 0 && !_.isNil(selectedData) && selectedData.selectedRows.length > 0) {
						result = items[items.length - 1].Id !== selectedData.selectedRows[selectedData.selectedRows.length - 1].Id;
					}
					break;
			}
			return result;
		}

		container.service.waypoint4Update = [];
		var originalGetItemById = container.service.getItemById;
		container.service.getItemById = function (id) {
			var result = originalGetItemById(id);
			if (!result) {
				var routeItem = parentService.getSelected();
				if (routeItem && routeItem.Waypoints && routeItem.Waypoints.length > 0) {
					result = _.find(routeItem.Waypoints, {Id: id});
				}
			}
			if(!result && container.service.waypoint4Update.length > 0){
				result = _.find(container.service.waypoint4Update, {Id: id});
			}
			return result;
		};

		return container.service;

	}
})(angular);
