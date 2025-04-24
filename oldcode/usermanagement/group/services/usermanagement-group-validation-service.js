/**
 * Created by sandu on 25.08.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'usermanagement.group';

	/**
     * @ngdoc service
     * @name usermanagementGroupValidationService
     * @description provides validation methods for Group entities
     */
	angular.module(moduleName).factory('usermanagementGroupValidationService', usermanagementGroupValidationService);

	usermanagementGroupValidationService.$inject = ['platformDataValidationService','usermanagementGroupMainService'];

	function usermanagementGroupValidationService(platformDataValidationService,usermanagementGroupMainService) {
		var service = {};
		service.validateName = function validateName(entity, value, model) {
			var list = usermanagementGroupMainService.getList();
			var retlist= _.find(list , function (chr) {
				return chr.Version !==0 && chr.Name.toLowerCase() === value.toLowerCase();
			});
			var result = {
				valid: !retlist,
				error$tr$: 'usermanagement.group.validateName',
				apply: true
			};
			platformDataValidationService.finishValidation(result, entity, value, model, service, usermanagementGroupMainService);
			return result;
		};


		return service;
	}
})(angular);