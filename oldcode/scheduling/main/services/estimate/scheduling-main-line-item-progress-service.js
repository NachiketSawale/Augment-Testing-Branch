(function () {
	/* global globals */
	'use strict';

	var schedulingModule = angular.module('scheduling.main');
	/**
	 * @ngdoc service
	 * @name schedulingMainLineItemProgressService
	 * @function
	 *
	 * @description
	 * schedulingMainLineItemProgressService is the data service for all Scheduling related functionality.
	 */
	/* jshint -W072 */ //
	schedulingModule.factory('schedulingMainLineItemProgressService', ['$http', '$timeout', 'schedulingMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'platformRuntimeDataService',

		function ($http, $timeout, schedulingMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, platformRuntimeDataService) {
			function processItem(item) {

				var fields = [
					{field: 'PeriodQuantityPerformance', readonly: item.ProgressReportMethodFk !== 4},
					{field: 'DueDateQuantityPerformance', readonly: item.ProgressReportMethodFk !== 4},
					{field: 'RemainingLineItemQuantity', readonly: item.ProgressReportMethodFk !== 4},
					{field: 'PeriodWorkPerformance', readonly: item.ProgressReportMethodFk !== 5},
					{field: 'DueDateWorkPerformance', readonly: item.ProgressReportMethodFk !== 5},
					{field: 'RemainingLineItemWork', readonly: item.ProgressReportMethodFk !== 5},
					{field: 'PCo', readonly: item.ProgressReportMethodFk === 7}
				];
				platformRuntimeDataService.readonly(item, fields);
			}

			var schedulingMainLineItemProgressServiceOption = {
				flatLeafItem: {
					module: schedulingModule,
					serviceName: 'schedulingMainLineItemProgressService',
					httpRead: {
						route: globals.webApiBaseUrl + 'scheduling/main/lineitemprogress/',
						initReadData: function (readdata) {
							var filter = '/?mainItemId=' + schedulingMainService.getSelected().Id;
							var duedate = schedulingMainService.getDueDate();
							if (duedate) {
								filter += '&performanceDueDate=' + duedate;
							}
							readdata.filter = filter;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'LineItemProgressDto',
						moduleSubModule: 'Scheduling.Main'
					}), {processItem: processItem}],
					actions: {delete: false},
					entityRole: {node: {itemName: 'LineItemProgress', parentService: schedulingMainService}},
					filterByViewer: true
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainLineItemProgressServiceOption);
			var service = serviceContainer.service;

			service.takeOverNewValues = function takeOverNewValues(data) {
				if (data && data.LineItemFk) {
					var lineItem = service.getItemById(data.LineItemFk);
					if (lineItem !== null) {
						$timeout(function assignNewValuesToLineItem() {
							lineItem.PeriodQuantityPerformance = data.PeriodQuantityPerformance;
							lineItem.DueDateQuantityPerformance = data.DueDateQuantityPerformance;
							lineItem.RemainingLineItemQuantity = data.RemainingLineItemQuantity;
							lineItem.PCo = data.PCo;
							lineItem.PeriodWorkPerformance = data.PeriodWorkPerformance;
							lineItem.DueDateWorkPerformance = data.DueDateWorkPerformance;
							lineItem.RemainingLineItemWork = data.RemainingLineItemWork;

							serviceContainer.data.itemModified.fire(null, lineItem);
						});
					}
				}
			};

			return service;
		}]);
})(angular);
