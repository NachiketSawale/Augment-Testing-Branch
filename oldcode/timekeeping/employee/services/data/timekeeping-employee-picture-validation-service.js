/**
 * Created by henkel on 15.05.2020
 */

(function (angular) {
	'use strict';
	const moduleName = 'timekeeping.employee';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeePictureValidationService
	 * @description provides validation methods for timekeeping employee picture entities
	 */
	angular.module(moduleName).service('timekeepingEmployeePictureValidationService', TimekeepingEmployeePictureValidationService);

	TimekeepingEmployeePictureValidationService.$inject = ['_', 'timekeepingEmployeePictureDataService'];

	function TimekeepingEmployeePictureValidationService(_, timekeepingEmployeePictureDataService) {
		let self = this;

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if(value) {
				_.filter(timekeepingEmployeePictureDataService.getList(), 'IsDefault', true)
					.forEach(function(item) {
						item.IsDefault = false;
						timekeepingEmployeePictureDataService.markItemAsModified(item);
					});
				timekeepingEmployeePictureDataService.markItemAsModified(entity);
				timekeepingEmployeePictureDataService.gridRefresh();
			}
			return { apply: value, valid: true };
		};
	}
})(angular);
