/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsEfbsheetsAverageWageValidationService
	 * @description provides validation methods for EFBSheets average wage
	 */
	angular.module('basics.efbsheets').factory('basicsEfbsheetsAverageWageValidationService', [
		'$injector',
		'platformDataValidationService',

		function ($injector, platformDataValidationService) {
			let service = {};

			service.validateMdcWageGroupFk = function validateMdcWageGroupFk(entity, value) {
				let lookupOptions = {
					lookupType: 'basicsEfbSheetsWageGroupLookupDataService',
					dataServiceName: 'basicsEfbSheetsWageGroupLookupDataService'
				};

				let basicsEfbSheetsWageGroupLookupDataService = $injector.get('basicsEfbSheetsWageGroupLookupDataService');
				let customizeMarkupRate = basicsEfbSheetsWageGroupLookupDataService.getItemById(value, lookupOptions);
				if (customizeMarkupRate) {
					entity.MarkupRate = customizeMarkupRate.MarkupRate;
				}
			};
			return service;
		}
	]);
})(angular);
