(function (angular) {
	'use strict';

	const moduleName = 'resource.equipmentgroup';
	/**
	 * @ngdoc service
	 * @name ResourceEquipmentEquipmentPhotoValidationService
	 * @description provides validation
	 */
	angular.module(moduleName).service('resourceEquipmentGroupPictureValidationService', ResourceEquipmentGroupPictureValidationService);

	ResourceEquipmentGroupPictureValidationService.$inject = ['resourceEquipmentGroupPictureDataService'];

	function ResourceEquipmentGroupPictureValidationService(resourceEquipmentGroupPictureDataService) {
		const self = this;

		self.validateIsDefault = function validateIsDefault(entity, value) {
			if(value) {
				_.filter(resourceEquipmentGroupPictureDataService.getList(), 'IsDefault', true)
					.forEach(function(item) {
						item.IsDefault = false;
						resourceEquipmentGroupPictureDataService.markItemAsModified(item);
					});
				resourceEquipmentGroupPictureDataService.markItemAsModified(entity);
			}
			
			return { apply: value, valid: true };
		};
	}
})(angular);