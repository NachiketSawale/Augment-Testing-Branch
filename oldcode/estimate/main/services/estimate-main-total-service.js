/**
 * Created by janas on 27.03.2015.
 */
(function () {
	'use strict';

	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateTotalService
	 * @function
	 *
	 * @description
	 * estimateTotalService is the data service for totals of line items.
	 */
	angular.module(moduleName).factory('estimateTotalService', [
		'platformDataServiceFactory',
		'estimateMainCommonService',
		'estimateMainService',
		'basicsCurrencyMainService',
		function (platformDataServiceFactory,
			estimateMainCommonService,
			estimateMainService,
			basicsCurrencyMainService) {

			let hours = 'Hours';

			let loadData = function () {
				let total = estimateMainCommonService.getTotal();


				// if (total.isValid) {
				if (total.isValid && total.majorCostCode.length > 0) {
					let dynamicCols = [],
						prjInfo = estimateMainService.getSelectedProjectInfo(),
						prjCurrId = prjInfo && prjInfo.ProjectCurrency ? prjInfo.ProjectCurrency : '',
						item = basicsCurrencyMainService.getItemById(prjCurrId),
						currency = item ? item.Currency :  '',
						id = 1;

					if(total.majorCostCode.length > 0){
						angular.forEach(total.majorCostCode, function(cc){
							let col = {'Id': id++, 'TotalOf': cc.code, 'Description': cc.desc, 'Total': cc.costTotal, 'CurUoM': currency};
							dynamicCols.push(col);
						});
						let totalCostCol = {'Id': id++, 'TotalOf': 'Direct Job Cost', 'Description': '', 'Total': total.majorCostTotal, 'CurUoM': currency, 'cssClass':'font-bold'};

						dynamicCols.push(totalCostCol);
					}

					let cols = [
						{'Id': id++, 'TotalOf': 'Labor Hours', 'Description': '', 'Total': total.totalHours, 'CurUoM': hours},
						{'Id': id++, 'TotalOf': 'Cost Risk', 'Description': '', 'Total': total.totalCostRisk, 'CurUoM': currency}
					];

					angular.forEach(cols, function (col){
						dynamicCols.push(col);
					});

					return dynamicCols;
				}
				else {
					return [];
				}
			};

			let estimateMainTotalServiceOptions = {
					module: estimateMainModule,
					serviceName: 'estimateTotalService',
					httpRead: {
						useLocalResource: true,
						resourceFunction: loadData,
						resourceFunctionParameters: []
					},
					entitySelection: {},
					presenter: {list: {}},
					actions: {}
				},
				serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainTotalServiceOptions),
				service = serviceContainer.service;


			// get the latest total calculation result from estimateMainCommonService
			estimateMainCommonService.registerTotalUpdated(function () {
				service.load();
			});

			basicsCurrencyMainService.load();
			// service.load(); // only do the calculation once the user click on a calc-button

			function getButtons() {
				let toolButtons = [
					{
						id: 'estimate-main-grand-total-recalculate',
						caption: 'estimate.main.grandTotalRecalculate',
						type: 'item',
						iconClass: 'control-icons ico-recalculate',
						fn: function() {
							// only do the calculation once the user click on a calc-button
							// estimateTotalService.load();
							estimateMainCommonService.getTotalMajorCCByEstHeader(estimateMainService.getSelectedEstHeaderId());
						},

						disabled:function (){
							return estimateMainService.getList() && estimateMainService.getList().length > 0 ? false : true;
						}
					}
				];
				return toolButtons;
			}


			angular.extend(service, {
				getButtons: getButtons
			});

			return service;
		}]);
})();
