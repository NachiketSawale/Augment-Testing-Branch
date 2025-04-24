/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsEfbsheetsAfsnValidationService
	 * @description provides validation methods for EFBSheets average wage
	 */
	angular.module('basics.efbsheets').factory('basicsEfbsheetsAfsnValidationService', [
		'$injector',
		'platformDataValidationService',

		function ($injector, platformDataValidationService) {
			let service = {};

			service.validateMdcWageGroupFk = function validateMdcWageGroupFk(entity, value) {
				let lookupOptions = {
					lookupType: 'basicsEfbSheetsAdditionalCostLookupDataService',
					dataServiceName: 'basicsEfbSheetsAdditionalCostLookupDataService'
				};

				let lookupDataService = $injector.get('basicsEfbSheetsAdditionalCostLookupDataService');
				let customizeMarkupRate = lookupDataService.getItemById(value, lookupOptions);

				if (customizeMarkupRate) {
					entity.MarkupRate = customizeMarkupRate.MarkupRate;
				}
			};

			return service;
		},
	]);
})(angular);
