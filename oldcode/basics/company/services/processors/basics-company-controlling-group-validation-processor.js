/**
 * Created by henkel
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';	
	
	angular.module(moduleName).factory('basicsCompanyControllingGroupValidationProcessor', BasicsCompanyControllingGroupValidationProcessor);
	BasicsCompanyControllingGroupValidationProcessor.$inject = ['$injector'];
	function BasicsCompanyControllingGroupValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.invoke(['basicsCompanyControllingGroupValidationService', function (basicsCompanyControllingGroupValidationService) {
					basicsCompanyControllingGroupValidationService.validateControllingGroupFk(items, null, 'ControllingGroupFk');
					basicsCompanyControllingGroupValidationService.validateControllingGrpDetailFk(items, null, 'ControllingGrpDetailFk');
				}]);
			}
		};
		return service;
	}
})(angular);