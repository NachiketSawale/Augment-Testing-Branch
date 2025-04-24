(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name ResourceEquipmentEquipmentLeafPhotoValidationService
	 * @description provides validation
	 */
	angular.module(moduleName).service('resourceEquipmentEquipmentLeafPhotoValidationService', ResourceEquipmentEquipmentLeafPhotoValidationService);

	ResourceEquipmentEquipmentLeafPhotoValidationService.$inject = ['resourceEquipmentLeafPhotoService'];

	function ResourceEquipmentEquipmentLeafPhotoValidationService(resourceEquipmentLeafPhotoService) {


		var self = this;

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if(value) {
				_.filter(resourceEquipmentLeafPhotoService.getList(), 'IsDefault', true)
					.forEach(function(item) {
						item.IsDefault = false;
					});
				resourceEquipmentLeafPhotoService.markItemAsModified(entity);
				resourceEquipmentLeafPhotoService.gridRefresh();
			}
			return { apply: value, valid: true };
		};


	}

})(angular);