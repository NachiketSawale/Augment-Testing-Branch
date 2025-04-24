/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainTotalsProcessor
	 * @function
	 *
	 * @description
	 * The estimateMainTotalsProcessor provide line item totals.
	 */
	angular.module(moduleName).factory('estimateMainTotalsProcessor', ['estimateMainCommonService', function (estimateMainCommonService) {

		let service = {};
		let total = {'totalCost': 0, 'totalCostRisk': 0, 'totalHours': 0, 'majorCostCode': [], 'majorCostTotal' : 0, 'isValid' : false };

		service.processItem = function processItem(lineItem){
			if(lineItem) {
				service.calculateTotal(lineItem);
			}
		};
		service.processData = function processData(lineItem){
			if(lineItem) {
				service.calculateTotal(lineItem);
			}
		};

		// calculate line items totals
		service.calculateTotal = function calculateTotal(lineItem) {
			if(!lineItem.IsDisabled){
				if(lineItem.EstCostRiskFk !== null && lineItem.EstCostRiskFk > 0 ){
					total.totalCostRisk += lineItem.CostTotal;
				}
				else{
					total.totalCost += lineItem.CostTotal;
				}
				total.totalHours += lineItem.HoursTotal;
				estimateMainCommonService.setTotal(total);
			}
		};

		return service;
	}]);
})(angular);
