/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainCostBudgetAssignDetailValidationService
	 * @description provides validation methods for controlling totals config detail instances
	 */
	angular.module(moduleName).factory('estimateMainCostBudgetAssignDetailValidationService',
		['platformDataValidationService', 'estimateMainCostBudgetAssignDetailDataService',
			function (platformDataValidationService, costBudgetAssignDetailDataService) {

				let service = {};

				angular.extend(service, {
					validateMdcCostCodeFk: validateMdcCostCodeFk
				});

				function validateMdcCostCodeFk(entity, value/* , model */) {
					entity.MdcCostCodeFk = value;
					// To do:sysnchro costcode to costcode assignment
					costBudgetAssignDetailDataService.synchroCostcodeData(entity);
				}

				return service;
			}]);

})(angular);
