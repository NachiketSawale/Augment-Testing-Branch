/**
 * Created by baf on 30.01.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentCompatibleMaterialValidationService
	 * @description provides validation methods for resource equipment compatibleMaterial entities
	 */
	angular.module(moduleName).service('resourceEquipmentCompatibleMaterialValidationService', ResourceEquipmentCompatibleMaterialValidationService);

	ResourceEquipmentCompatibleMaterialValidationService.$inject = ['$q', 'platformDataValidationService', 'platformValidationServiceFactory', 'basicsMaterialLookupService',
		'resourceEquipmentConstantValues', 'resourceEquipmentCompatibleMaterialDataService'];

	function ResourceEquipmentCompatibleMaterialValidationService($q, platformDataValidationService, platformValidationServiceFactory, basicsMaterialLookupService,
		resourceEquipmentConstantValues, resourceEquipmentCompatibleMaterialDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceEquipmentConstantValues.schemes.compatibleMaterial, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceEquipmentConstantValues.schemes.compatibleMaterial)
		},
		self,
		resourceEquipmentCompatibleMaterialDataService);

		this.asyncValidateMaterialFk = function asyncValidateMaterialFk(entity, value, model) {
			if(value)
			{
				var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourceEquipmentCompatibleMaterialDataService);
				asyncMarker.myPromise = basicsMaterialLookupService.getItemByKey(value, {lookupType: 'basicsMaterialLookupService'}).then(function (material) {
					entity.MaterialCatalogFk = material.MdcMaterialCatalogFk;
				});

				return asyncMarker.myPromise;
			}

			return $q.when(false);
		};
	}
})(angular);
