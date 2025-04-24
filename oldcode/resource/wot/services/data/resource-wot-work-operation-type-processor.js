/**
 * Created by baf on 12/14/2021.
 */
(function (angular) {
	'use strict';
	var moduleName = 'resource.wot';
	/**
	 * @ngdoc service
	 * @name resourceWotWorkOperationTypeProcessor
	 * @function
	 * @requires platformRuntimeDataService
	 *
	 * @description
	 * resourceWotWorkOperationTypeProcessor is the service to process data in work operation type entity
	 *
	 */
	angular.module(moduleName).service('resourceWotWorkOperationTypeProcessor', ResourceWotWorkOperationTypeProcessor);

	ResourceWotWorkOperationTypeProcessor.$inject = ['platformRuntimeDataService'];

	function ResourceWotWorkOperationTypeProcessor(platformRuntimeDataService) {
		var service = this;

		service.processItem = function processItem(item) {
			service.setIsHireColumnReadOnly(item, item.IsMinorEquipment);
		};

		service.setIsHireColumnReadOnly = function setIsHireColumnReadOnly(item, isMinorEquipment) {
			var fields = [
				{field: 'IsHire', readonly: isMinorEquipment },
				{field: 'UomFk', readonly: item.Version >= 1 }
			];
			platformRuntimeDataService.readonly(item, fields);
		};
	}
})(angular);