/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainResourceSummaryValidateService',
		[
			function () {

				let service = {};

				let _columnName = null;
				service.setCurrentEditColumn = function (columnName) {
					_columnName = columnName;
				};

				service.getCurrentEditColumn = function () {
					return _columnName;
				};

				service.validateAdjCostSummaryForBulkConfig = validateColumn;
				service.validateAdjustCostUnitForBulkConfig = validateColumn;
				service.validateCostFactor1ForBulkConfig = validateColumn;
				service.validateCostFactor2ForBulkConfig = validateColumn;
				service.validateEfficiencyFactor1ForBulkConfig = validateColumn;
				service.validateEfficiencyFactor2ForBulkConfig = validateColumn;
				service.validateProductivityFactorForBulkConfig = validateColumn;
				service.validateQuantityFactor1ForBulkConfig = validateColumn;
				service.validateQuantityFactor2ForBulkConfig = validateColumn;
				service.validateQuantityFactor3ForBulkConfig = validateColumn;
				service.validateQuantityFactor4ForBulkConfig = validateColumn;

				function validateColumn(entity, value, model) {
					_columnName = model;

					return true;
				}

				return service;
			}]);

})();