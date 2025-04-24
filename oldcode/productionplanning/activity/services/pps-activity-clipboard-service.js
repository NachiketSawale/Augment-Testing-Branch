/**
 * Created by pep on 3/22/2018.
 */

(function (angular) {
	'use strict';

	/*global angular */
	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).service('productionplanningActivityClipBoardService', ProductionplanningActivityClipBoardService);

	ProductionplanningActivityClipBoardService.$inject = ['$http'];

	function ProductionplanningActivityClipBoardService($http) {
		var trsResReqType = 'resRequisition-trsRequisition';
		var trsResResType = 'trsRequisition-resReservation';

		var costGroupFilter = 'lic-leadingStructure';
		var prjCostGroupFilter = 'prj-leadingStructure';
		var prjLocationFilter = 'prjLocation-leadingStructure';
		var ctrlUnitFilter = 'ctrlUnit-leadingStructure';
		var psdActivityFilter = 'psdActivity-leadingStructure';

		function doCanPaste(source, type, itemOnDragEnd) {
			return itemOnDragEnd && (source.type === trsResReqType || source.type === trsResResType ||
				source.type.indexOf('leadingStructure') );
		}

		function doPaste(source, itemOnDragEnd, targetType, defaultHandler, itemService) {
			var pastedData = angular.copy(source.data);

			if (itemOnDragEnd && source.data && _.isArray(source.data)) {
				var selectedItem = itemService.getSelected();
				if (source.type === trsResReqType) {
					var resReqService = getResReqService(itemService);
					if (resReqService) {
						if (selectedItem === itemOnDragEnd) {
							_.forEach(source.data, function (data) {
								data.PpsEventFk = itemOnDragEnd.PpsEventFk;
							});
							refreshResReq(resReqService, source.data);
						} else {
							itemService.setSelected(itemOnDragEnd).then(function () {
								resReqService.onDataReaded = function () {
									_.forEach(source.data, function (data) {
										data.PpsEventFk = itemOnDragEnd.PpsEventFk;
									});
									refreshResReq(resReqService, source.data);
									resReqService.onDataReaded = function () {
									};
								};
							});
						}
					}
				}
				else if (source.type === trsResResType) {
					var resResService = getResResService(itemService);
					if (resResService) {
						if (selectedItem === itemOnDragEnd) {
							updateActResRequisition(itemService, itemOnDragEnd, source.data);
							refreshResRes(source.itemService, resResService, source.data, true);
						} else {
							var allItems = getAllResReservations(source.itemService, source.data);
							itemService.setSelected(itemOnDragEnd).then(function () {
								resResService.onDataReaded = function () {
									updateActResRequisition(itemService, itemOnDragEnd, source.data);
									refreshResRes(source.itemService, resResService, allItems, false);
									resResService.onDataReaded = function () {
									};
								};
							});
						}
					}
				}

				else if (source.type.indexOf('leadingStructure')) {
					var list = source.type.split(',');
					var filterType = list[0];
					var seqNumber = list[1];
					switch (filterType) {
						case costGroupFilter: {
							var costPropertyName = 'LicCostGroup' + seqNumber + 'Fk';
							itemOnDragEnd[costPropertyName] = pastedData[0].Id;
						}
							break;
						case prjCostGroupFilter: {
							var propertyName = 'PrjCostGroup' + seqNumber + 'Fk';
							itemOnDragEnd[propertyName] = pastedData[0].Id;
						}
							break;
						case  prjLocationFilter: {
							itemOnDragEnd.PrjLocationFk = pastedData[0].Id;
						}
							break;
						case  ctrlUnitFilter: {
							itemOnDragEnd.MdcControllingunitFk = pastedData[0].Id;
						}
							break;
						case psdActivityFilter: {
							itemOnDragEnd.PsdActivityFk = pastedData[0].Id;
						}
							break;
					}
					defaultHandler(itemService.updateActivityForFilterDragDrop(itemOnDragEnd));   // callback on success
				}
			}
		}

		function getResReqService(parentService) {
			var resReqService;
			_.forEach(parentService.getChildServices(), function (service) {
				if (service.getServiceName() === 'productionplanningActivityResRequisitionDataService' ||
					service.getServiceName() === 'productionplanningMountingResRequisitionDataService') {
					resReqService = service;
				}
			});
			return resReqService;
		}

		function getResResService(parentService) {
			var resReqService;
			_.forEach(parentService.getChildServices(), function (service) {
				if (service.getServiceName() === 'productionplanningActivityReservedForActivityDataServiceFactory' ||
					service.getServiceName() === 'resourceReservationReservedForActivityDataService') {
					resReqService = service;
				}
			});
			return resReqService;
		}

		function refreshResReq(dataService, targetDatas) {
			var allItems = dataService.getList();
			var targetItems = _.filter(targetDatas, function (item) {
				return !_.find(allItems, {Id: item.Id});
			});

			if (targetItems.length > 0) {
				var targetAllItems = _.concat(allItems, targetItems);
				allItems.length = 0;
				allItems = _.forEach(targetAllItems, function (item) {
					allItems.push(item);
				});
				dataService.markEntitiesAsModified(targetItems);
				dataService.gridRefresh();
			}
		}

		function refreshResRes(sourceDataService, targetDataService, targetDatas, getAllResRes) {
			var allItems = targetDataService.getList();
			var targetItems = _.filter(targetDatas, function (item) {
				return !_.find(allItems, {Id: item.Id});
			});

			if (targetItems.length > 0) {
				if (getAllResRes) {
					targetItems = getAllResReservations(sourceDataService, targetItems);
				}
				var targetAllItems = _.concat(allItems, targetItems);
				allItems.length = 0;
				allItems = _.forEach(targetAllItems, function (item) {
					allItems.push(item);
				});
				targetDataService.markEntitiesAsModified(targetItems);
				targetDataService.gridRefresh();
			}
		}

		function getAllResReservations(dataService, items) {
			var allItems = [];
			var list = dataService.getList();
			_.forEach(items, function (item1) {
				_.forEach(list, function (item2) {
					if (item1.RequisitionFk === item2.RequisitionFk) {
						allItems.push(item2);
					}
				});
			});

			return allItems;
		}

		function updateActResRequisition(itemService, activity, dropDatas) {
			var trsResRequisitionService = getResReqService(itemService);
			trsResRequisitionService.load().then(function (respond) {
				_.forEach(dropDatas, function (d) {
					$http.get(globals.webApiBaseUrl + 'resource/requisition/getById?Id=' + d.RequisitionFk).then(function (requisition) {
						requisition.data.PpsEventFk = activity.PpsEventFk;
						var originList = respond.Main ? respond.Main : respond;
						trsResRequisitionService.setLoadedItems(_.concat(originList, requisition.data));
						trsResRequisitionService.markItemAsModified(requisition.data);
					});
				});
			});
		}


		return {
			canDrag: function (type) {
				return true;
			},
			doCanPaste: doCanPaste,
			doPaste: doPaste
		};
	}
})(angular);