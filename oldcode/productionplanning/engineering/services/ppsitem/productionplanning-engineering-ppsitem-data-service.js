(function () {
	'use strict';
	var module = angular.module('productionplanning.engineering');
	/*global angular, globals*/

	module.factory('productionplanningEngineeringPpsItemDataService', DataService);

	DataService.$inject = ['$http', 'platformDataServiceFactory', 'productionplanningEngineeringMainService',
		'platformRuntimeDataService', 'productionplanningItemProcessor', 'platformModalService'];

	function DataService($http, platformDataServiceFactory, engMainService,
						 platformRuntimeDataService, ppsItemProcessor, platformModalService) {
		var serviceOption = {
			flatLeafItem: {
				module: module,
				serviceName: 'productionplanningEngineeringPpsItemDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'getByEngTaskId',
					initReadData: function (readData) {
						readData.filter = '?engTaskId=' + engMainService.getSelected().Id;
					}
				},
				dataProcessor: [{
					processItem: function (item) {
						var fields = [];
						_.forEach(item, function(value,column){
							if(column !== 'Quantity'){
								fields.push({field: column, readonly: true});
							}
						});
						platformRuntimeDataService.readonly(item, fields);
						//platformRuntimeDataService.readonly(item, true);
					}
				}, ppsItemProcessor],
				entityRole: {
					leaf: {
						itemName: 'PlanningUnit',
						parentService: engMainService
					}
				},
				actions: {} // no create/delete actions
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceOption);

		container.service.showEventQuantityDialog = function showEventQuantityDialog(item) {
			var selectedEngTask = engMainService.getSelected();
			$http.get(globals.webApiBaseUrl + 'productionplanning/common/event/listForCommon?foreignKey=ItemFk&mainItemId=' + item.Id)
				.then(function (response) {
					if (response.data.Main.length > 0) {
						var events = _.filter(response.data.Main, function (event) {
							return event.ItemFk === item.Id;
						});
						var modalCreateConfig = {
							width: '940px',
							resizeable: true,
							templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-event-quantity-dialog.html',
							controller: 'productionplanningItemEventQuantityDialogController',
							resolve: {
								'$options': function () {
									return {
										events: events,
										selectedItem: item,
										selectedTask: selectedEngTask,
										itemService: container.service,
										module: 'EngineeringTask'
									};
								}
							}
						};
						platformModalService.showDialog(modalCreateConfig);
					}
				});
		};

		container.service.setQuantityChangedEvents = function (events) {
			engMainService.changedSequenceEvents = events;
			var selectedEngTask = engMainService.getSelected();
			engMainService.markItemAsModified(selectedEngTask);
		};

		container.service.getContainerData = () => container.data;
		return container.service;
	}
})();