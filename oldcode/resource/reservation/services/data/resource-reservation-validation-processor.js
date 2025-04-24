(function (angular) {
	'use strict';

	var moduleName = 'resource.reservation';

	angular.module(moduleName).factory('resourceReservationValidationProcessor', ResourceReservationValidationProcessor);
	ResourceReservationValidationProcessor.$inject = ['$injector'];
	function ResourceReservationValidationProcessor($injector) {
		var service = {};
		service.validate = function validate(item) {
			if (item.Version === 0) {
				$injector.invoke(['resourceReservationValidationService', function (resourceReservationValidationService) {
					resourceReservationValidationService.validateRequisitionFk(item, item.RequisitionFk, 'RequisitionFk');
					resourceReservationValidationService.validateUomFk(item, item.UomFk, 'UomFk');
				}]);
			}
		};
		return service;
	}
})(angular);