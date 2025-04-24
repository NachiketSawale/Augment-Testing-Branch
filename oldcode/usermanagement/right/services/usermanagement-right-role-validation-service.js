/**
 * Created by sandu on 14.09.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.right';

	/**
     * @ngdoc service
     * @name usermanagementRoleValidationService
     * @description provides validation methods for Role entities
     */
	angular.module(moduleName).factory('usermanagementRoleValidationService', usermanagementRoleValidationService);

	usermanagementRoleValidationService.$inject = ['platformDataValidationService', 'usermanagementRightMainService'];

	function usermanagementRoleValidationService(platformDataValidationService, usermanagementRightMainService) {
		var service = {};
		service.validateName = function validateName(entity, value, model) {
			var list = usermanagementRightMainService.getList();
			var retlist= _.find(list , function (chr) {
				return chr.Version !== 0 && chr.Name.toLowerCase() === value.toLowerCase();
			});
			var result = {
				valid: !retlist,
				error$tr$: 'usermanagement.right.validateName',
				apply: true
			};
			platformDataValidationService.finishValidation(result, entity, value, model, service, usermanagementRightMainService);
			return result;
		};
		return service;
	}
})(angular);