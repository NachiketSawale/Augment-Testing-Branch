/**
 * Created by henkel
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';	
	
	angular.module(moduleName).factory('basicsCompanyUtilisableGroupValidationProcessor', basicsCompanyUtilisableGroupValidationProcessor);
	basicsCompanyUtilisableGroupValidationProcessor.$inject = ['$injector'];
	function basicsCompanyUtilisableGroupValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(entity) {
			if (entity.Version === 0) {
				$injector.invoke(['basicsCompanyUtilisableGroupValidationService', function (basicsCompanyUtilisableGroupValidationService) {
					basicsCompanyUtilisableGroupValidationService.validateGroupFk(entity, entity.GroupFk, 'GroupFk');
				}]);
			}
		};
		return service;
	}
})(angular);