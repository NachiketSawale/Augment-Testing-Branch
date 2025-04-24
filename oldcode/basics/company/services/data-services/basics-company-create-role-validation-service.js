/**
 * Created by henkel
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	/**
	 * @ngdoc service
	 * @name basicsCompanyCreateRoleValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('basicsCompanyCreateRoleValidationService', BasicsCompanyCreateRoleValidationService);

	BasicsCompanyCreateRoleValidationService.$inject = ['basicsCompanyCreateRoleService', 'platformDataValidationService'];

	function BasicsCompanyCreateRoleValidationService(basicsCompanyCreateRoleService, platformDataValidationService) {
		var self = this;

		self.validateClerkRoleFk = function validateIsDefault(entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyCreateRoleService);
		};

		self.validateAccessRoleFk = function (entity, value, model) {
			return platformDataValidationService.validateMandatory(entity, value, model, self, basicsCompanyCreateRoleService);

		};

	}
})(angular);