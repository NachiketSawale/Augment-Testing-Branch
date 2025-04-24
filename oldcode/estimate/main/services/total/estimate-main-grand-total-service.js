/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);

	estimateMainModule.factory('estimateGrandTotalService', [
		'platformDataServiceFactory', 'estimateTotalCalculateService', 'estimateMainService',
		function (platformDataServiceFactory, estimateTotalCalculateService, estimateMainService
		) {

			let options = {
				flatNodeItem: {
					module: estimateMainModule,
					serviceName: 'estimateGrandTotalService',
					httpRead: {
						// http get:
						route: globals.webApiBaseUrl + 'estimate/main/lineitem/getresourcesbyestheaderfk',
						endRead: '/',
						initReadData: function initReadData(readData) {
							angular.extend(readData, {
								estHeaderFk: estimateMainService.getSelectedEstHeaderId() || -1,
								prjProjectFk: estimateMainService.getSelectedProjectId() || -1
							});
						},
						usePostForRead: true
					},

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


			// a promise resolved to [dataList]
			function incorporateDataRead(readData, data){

				let listData = readData || [];
				estimateTotalCalculateService.getTotalLines(listData).then(function(totalResult){
					// resolve the data
					return data.handleReadSucceeded(totalResult, data);
				});

			}

			let estimateHeaderId = estimateMainService.getSelectedEstHeaderId() || null;

			function getButtons() {
				let toolButtons = [
					{
						id: 'estimate-main-grand-total-recalculate',
						caption: 'estimate.main.grandTotalRecalculate',
						type: 'item',
						iconClass: 'control-icons ico-recalculate',
						fn: function() {
							// only do the calculation once the user click on a calc-button
							loadGrandTotal();
						},

						disabled:function (){
							return false;
							// return estimateMainService.getList() && estimateMainService.getList().length > 0 ? false : true;
						}
					}
				];
				return toolButtons;
			}

			function loadGrandTotal() {
				service.load();
			}

			function resetGrandTotal() {
				service.setList([]);
				estimateHeaderId = null;
			}

			function resetGrandTotalIfEstimateHeaderChange(newEstimateHeaderId) {
				if(newEstimateHeaderId !== estimateHeaderId){
					resetGrandTotal();
					estimateHeaderId = newEstimateHeaderId;
				}
			}
			return angular.extend(service, {
				getButtons: getButtons,
				loadGrandTotal: loadGrandTotal,
				resetGrandTotal: resetGrandTotal,
				resetGrandTotalIfEstimateHeaderChange: resetGrandTotalIfEstimateHeaderChange
			});
		}]);
})();
