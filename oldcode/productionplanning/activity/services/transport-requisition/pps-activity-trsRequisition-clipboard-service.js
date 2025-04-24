/**
 * Created by pep on 3/20/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('productionplanningActivityTrsRequisitionClipBoardService', ProductionplanningActivityTrsRequisitionClipBoardService);

	ProductionplanningActivityTrsRequisitionClipBoardService.$inject = ['$http'];

	function ProductionplanningActivityTrsRequisitionClipBoardService($http) {
		var activityResReqType = 'resRequisition-activity';
		var activityResResType = 'activity-resReservation';

		function doCanPaste(source, type, itemOnDragEnd, itemService) {
			return ((source.type === activityResReqType ||
			source.type === activityResResType) &&
			itemOnDragEnd && itemService.canPaste(itemOnDragEnd));
		}

		function doPaste(source, itemOnDragEnd, type, defaultHandler, itemService) {
			if (itemOnDragEnd && source.data && _.isArray(source.data)) {
				var selectedItem = itemService.getSelected();
				if (source.type === activityResReqType) {
					var resReqService = getResReqService(itemService);
					if (resReqService) {
						if (selectedItem === itemOnDragEnd) {
							_.forEach(source.data, function (data) {
								data.TrsRequisitionFk = itemOnDragEnd.Id;
							});
							refreshResReq(resReqService, source.data);
						} else {
							itemService.setSelected(itemOnDragEnd).then(function () {
								resReqService.onDataReaded = function () {
									_.forEach(source.data, function (data) {
										data.TrsRequisitionFk = itemOnDragEnd.Id;
									});
									refreshResReq(resReqService, source.data);
									resReqService.onDataReaded = function () {};
								};
							});
						}
					}
				} else if (source.type === activityResResType) {
					var resResService = getResResService(itemService);
					if (resResService) {
						if (selectedItem === itemOnDragEnd) {
							updateTrsResRequisition(itemService, itemOnDragEnd, source.data);
							refreshResRes(source.itemService, resResService, source.data);
						} else {
							itemService.setSelected(itemOnDragEnd).then(function () {
								resResService.onDataReaded = function () {
									updateTrsResRequisition(itemService, itemOnDragEnd, source.data);
									refreshResRes(source.itemService, resResService, source.data);
									resResService.onDataReaded = function () {};
								};
							});
						}
					}
				}
			}
		}

		function getResReqService(parentService) {
			var resReqService;
			_.forEach(parentService.getChildServices(), function (service) {
				if (service.getServiceName() === 'productionplanningActivityTrsRequisitionResRequisitionDataService' ||
					service.getServiceName() === 'productionplanningMountingTrsRequisitionResRequisitionDataService') {
					resReqService = service;
				}
			});
			return resReqService;
		}

		function getResResService(parentService) {
			var resReqService;
			_.forEach(parentService.getChildServices(), function (service) {
				if (service.getServiceName() === 'productionplanningActivityTrsRequisitionDataServiceResReservationDataService' ||
					service.getServiceName() === 'productionplanningMountingTrsRequisitionDataServiceResReservationDataService') {
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

		function refreshResRes(sourceDataService, targetDataService, targetDatas) {
			var allItems = targetDataService.getList();
			var targetItems = _.filter(targetDatas, function (item) {
				return !_.find(allItems, {Id: item.Id});
			});

			if (targetItems.length > 0) {
				targetItems = getAllResReservations(sourceDataService, targetItems);
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

		function updateTrsResRequisition(itemService, trsRequisition, dropDatas) {
			var trsResRequisitionService = getResReqService(itemService);
			trsResRequisitionService.load().then(function (respond) {
				_.forEach(dropDatas, function (d) {
					$http.get(globals.webApiBaseUrl + 'resource/requisition/getById?Id=' + d.RequisitionFk).then(function (requisition) {
						requisition.data.TrsRequisitionFk = trsRequisition.Id;
						var originList = respond.Main ? respond.Main : respond;
						trsResRequisitionService.setLoadedItems(_.concat(originList, requisition.data));
						trsResRequisitionService.markItemAsModified(requisition.data);
					});
				});
			});
		}

		return {
			canDrag: function () {
				return false;
			},
			doCanPaste: doCanPaste,
			doPaste: doPaste
		};
	}
})(angular);
