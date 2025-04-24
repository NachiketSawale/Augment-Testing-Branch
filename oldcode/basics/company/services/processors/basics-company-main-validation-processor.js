/**
 * Created by henkel on 24.11.2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyMainValidationProcessor', basicsCompanyMainValidationProcessor);
	basicsCompanyMainValidationProcessor.$inject = ['$injector'];
	function basicsCompanyMainValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(items) {
			if (items.Version === 0) {
				$injector.get('basicsCompanyValidationService').validateCode(items, null, 'Code');
			}
			if (items.Version === 0 && items.CompanyTypeFk === 3) {
				$injector.get('platformRuntimeDataService').readonly(items, [{field: 'EquipmentDivisionFk', readonly: true}]);
			}
		};
		return service;
	}
})(angular);