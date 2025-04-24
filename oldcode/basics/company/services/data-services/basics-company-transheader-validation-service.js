/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';
	/**
	 * @ngdoc service
	 * @name basicsCompanyTransheaderValidationService
	 * @description provides validation methods for entities
	 */
	angular.module(moduleName).service('basicsCompanyTransheaderValidationService', BasicsCompanyTransheaderValidationService);

	BasicsCompanyTransheaderValidationService.$inject = ['basicsCompanyTransheaderService', 'platformDataValidationService', 'platformPermissionService', 'permissions', 'basicsCompanyTransactionService'];

	function BasicsCompanyTransheaderValidationService(basicsCompanyTransheaderService, platformDataValidationService, platformPermissionService, permissions, basicsCompanyTransactionService) {

		var self = this;

		this.validateIsSuccess = function validateStartDate(entity, value, model) {
			if (value === true) {
				platformPermissionService.restrict(basicsCompanyTransactionService.getContainerUUID().toLowerCase(), permissions.read);
			} else {
				platformPermissionService.restrict(basicsCompanyTransactionService.getContainerUUID().toLowerCase(), false);
			}

			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyTransheaderService);
		};
	}

})(angular);
