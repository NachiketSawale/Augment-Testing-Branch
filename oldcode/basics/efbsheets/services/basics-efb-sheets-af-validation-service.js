/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsEfbsheetsAfValidationService
	 * @description provides validation methods for EFBSheets average wage
	 */
	angular.module('basics.efbsheets').factory('basicsEfbsheetsAfValidationService', [
		'$injector',
		'platformDataValidationService',

		function ($injector, platformDataValidationService) {
			let service = {};

			service.validateMdcWageGroupFk = function validateMdcWageGroupFk(entity, value) {
				let lookupOptions = {
					lookupType: 'basicsEfbSheetsSurchargeLookupDataService',
					dataServiceName: 'basicsEfbSheetsSurchargeLookupDataService'
				};

				let lookupDataService = $injector.get('basicsEfbSheetsSurchargeLookupDataService');

				let customizeMarkupRate = lookupDataService.getItemById(value, lookupOptions);
				if (customizeMarkupRate) {
					entity.MarkupRate = customizeMarkupRate.MarkupRate;
				}
			};

			return service;
		}
	]);
})(angular);
