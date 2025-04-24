/**
 * Created by anl on 3/16/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	angular.module(moduleName).factory('productionplanningActivityResReservationClipBoardFactory', ReservationClipBoardService);

	ReservationClipBoardService.$inject = ['$http', '$injector'];

	function ReservationClipBoardService($http, $injector) {

		function createService(config) {
			var typeForActivity = 'activity-resReservation';
			var typeForTrsRequisition = 'trsRequisition-resReservation';
			var typeActivity = 'mntActivity';
			var typeActTrsRequisition = 'activity-trsRequisition';
			var module = config.module;

			function doPaste(source, itemOnDragEnd, type, defaultHandler, targetItemService) {
				if (type === typeActivity || type === typeActTrsRequisition) {
					var targetSelected = targetItemService.getSelected();
					if (type === typeActivity) {
						updateActResRequisition(targetSelected, source.data);
						refresh(source.itemService, targetItemService, source.data);
					}
					else if (type === typeActTrsRequisition) {
						updateTrsResRequisition(targetSelected, source.data);
						refresh(source.itemService, targetItemService, source.data);
					}
				}
				else {
					var parentSelected = targetItemService.parentService().getSelected();
					if (type === typeForActivity) {
						updateActResRequisition(parentSelected, source.data);
					}
					else if (type === typeForTrsRequisition) {
						updateTrsResRequisition(parentSelected, source.data);
					}
					refresh(source.itemService, targetItemService, source.data);
				}
			}

			function doCanPaste(source, type, itemOnDragEnd, targetItemService) {
				//TrsRequisition: Reservation -> Activity: Reservation
				var result1 = false;
				if (((source.type === typeForActivity && type === typeForTrsRequisition) ||
					(source.type === typeForTrsRequisition && type === typeForActivity)) &&
					(type === typeForActivity || (type === typeForTrsRequisition && targetItemService.canCreate())) &&
					source.itemService.getSelected() &&
					source.itemService.parentService().getSelected() &&
					targetItemService.parentService().getSelected()) {
					result1 = true;
				}

				//TrsRequisition:Reservation -> activity
				var result2 = false;
				if ((source.type === typeForTrsRequisition && type === typeActivity) &&
					source.itemService.getSelected()) {
					result2 = true;
				}

				//act-Resercation -> act-TrsRequisitioin
				var result3 = false;
				if ((source.type === typeForActivity && type === typeActTrsRequisition) &&
					source.itemService.getSelected()) {
					result3 = true;
				}

				return result1 || result2 || result3;
			}

			function refresh(sourceDataService, targetDataService, targetDatas) {
				var allItems = targetDataService.getList();
				var targetItems = _.filter(targetDatas, function (item) {//ignore the existing items
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

			function updateActResRequisition(activity, dropDatas) {
				var cisName = _.camelCase(module) + 'ResRequisitionDataService';
				var actResRequisitionService = $injector.get(cisName);
				//var actResRequisitionService = $injector.get('productionplanningActivityResRequisitionDataService');
				//load first, making sure actResRequisition container has data
				actResRequisitionService.load().then(function (respond) {
					_.forEach(dropDatas, function (d) {
						//Change requisition's PpsEventFk same to target's parent(Activity)
						$http.get(globals.webApiBaseUrl + 'resource/requisition/getById?Id=' + d.RequisitionFk).then(function (requisition) {
							requisition.data.PpsEventFk = activity.PpsEventFk;
							var originList = respond.Main ? respond.Main : respond;
							actResRequisitionService.setLoadedItems(_.concat(originList, requisition.data));
							actResRequisitionService.markItemAsModified(requisition.data);
						});
					});
				});
			}

			function updateTrsResRequisition(trsRequisition, dropDatas) {
				var cisName = _.camelCase(module) + 'TrsRequisitionResRequisitionDataService';
				var trsResRequisitionService = $injector.get(cisName);
				//var trsResRequisitionService = $injector.get('productionplanningActivityTrsRequisitionResRequisitionDataService');
				//load first, making sure trsResRequisition container has data
				trsResRequisitionService.load().then(function (respond) {
					_.forEach(dropDatas, function (d) {
						//Change requisition's trsRequisition same to target's parent(TrsRequisition)
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
				doPaste: doPaste,
				doCanPaste: doCanPaste
			};
		}
		return {
			createService: createService
		};
	}

})(angular);