(function (angular) {
	'use strict';

	var moduleName = 'resource.equipment';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantFixedAssetValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('resourceEquipmentPlantFixedAssetValidationService', ResourceEquipmentPlantFixedAssetValidationService);

	ResourceEquipmentPlantFixedAssetValidationService.$inject = ['resourceEquipmentPlantFixedAssetDataService', 'platformDataValidationService', 'platformRuntimeDataService'];

	function ResourceEquipmentPlantFixedAssetValidationService(resourceEquipmentPlantFixedAssetDataService, platformDataValidationService) {

		var self = this;

		self.asyncValidateFixedAssetFk = function (entity, value, model) {
			return resourceEquipmentPlantFixedAssetDataService.asyncGetCustomizeFixedAsset(value).then(function (customizeFixedAsset) {
				entity.Code = customizeFixedAsset.Asset;
				entity.Description = customizeFixedAsset.Description;
				entity.CompanyFk = customizeFixedAsset.CompanyFk;
				return {apply: true, valid: true, error:''};
			});
		};

		this.validateValidFrom = function validateStartDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(value, entity.ValidTo, entity, model, self, resourceEquipmentPlantFixedAssetDataService, 'ValidTo');
		};

		this.validateValidTo = function validateEndDate(entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.ValidFrom, value, entity, model, self, resourceEquipmentPlantFixedAssetDataService, 'ValidFrom');
		};
	}

})(angular);