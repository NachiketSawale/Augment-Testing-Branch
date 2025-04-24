/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainEstTotalsConfigDetailValidationService
	 * @description provides validation methods for controlling totals config detail instances
	 */
	angular.module(moduleName).factory('estimateMainEstTotalsConfigDetailValidationService',
		['platformDataValidationService', 'platformRuntimeDataService', 'basicsLookupdataLookupDescriptorService', 'estimateMainCostCodeAssignmentDetailDataService',
			function (platformDataValidationService, runtimeDataService, lookupDescriptorService, costCodeAssignmentDetailDataService) {

				let service = {};

				angular.extend(service, {
					validateMdcCostCodeFk: validateMdcCostCodeFk
				});

				function validateMdcCostCodeFk(entity, value/* , model */) {
					entity.MdcCostCodeFk = value;
					// To do:sysnchro costcode to costcode assignment
					costCodeAssignmentDetailDataService.synchroCostcodeData(entity);
				}

				return service;
			}]);

})(angular);
