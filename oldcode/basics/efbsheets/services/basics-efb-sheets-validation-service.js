/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name basicsEfbSheetsValidationService
     * @description provides validation methods for EFBSheets instances
     */
	angular.module('basics.efbsheets').factory('basicsEfbsheetsValidationService', ['$injector', 'platformDataValidationService', 'basicsEfbsheetsMainService',

		function ($injector, platformDataValidationService, basicsEfbsheetsMainService) {

			let service = {};

			service.validateCode = function validateCode(entity, value) {
				return platformDataValidationService.validateMandatoryUniqEntity(entity, value, 'Code', basicsEfbsheetsMainService.getList(), service, basicsEfbsheetsMainService);
			};
			return service;
		}
	]);
})(angular);
