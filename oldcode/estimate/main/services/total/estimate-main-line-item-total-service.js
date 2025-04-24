/**
 */
(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateLineItemTotalService
	 * @function
	 *
	 * @description
	 * estimateLineItemTotalService is the data service for totals of line items.
	 */
	estimateMainModule.factory('estimateLineItemTotalService', [
		'platformDataServiceFactory',
		'estimateTotalCalculateService',
		'estimateMainResourceService',
		'estimateMainService',
		function (platformDataServiceFactory,
			estimateTotalCalculateService,
			estimateMainResourceService,
			estimateMainService
		) {

			let options = {
				flatNodeItem: {
					module: estimateMainModule,
					serviceName: 'estimateLineItemTotalService',
					httpRead: {
						// http get:
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/getresourcesbylineitem',
						endRead: '/',
						initReadData: function initReadData(readData) {
							let selectedLineItem = estimateMainService.getSelected() || {};
							angular.extend(readData, {
								estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
								prjProjectFk: estimateMainService.getSelectedProjectId() || -1,
								lineItemIds: [selectedLineItem.Id || -1]
							});
						},
						usePostForRead: true
					},

					httpRead0Bak: { // for back up only, this block of code is not involved
						useLocalResource: true,
						resourceFunction: loadLineItemData,
						resourceFunctionParameters: []
					},

					// httpUpdate: {},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					actions: {}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(options),
				service = serviceContainer.service;

			function loadLineItemData() {
				let lineItem = estimateMainService.getSelected();
				lineItem.EstResources = estimateMainResourceService.getList();
				return [lineItem];
			}

			// a promise resolved to [dataList]
			function incorporateDataRead(readData, data){

				let listData = readData || [];
				estimateTotalCalculateService.getTotalLines(listData).then(function(totalResult){
					// resolve the data
					return data.handleReadSucceeded(totalResult, data);
				});

			}

			return angular.extend(service, {
			});
		}]);
})();
