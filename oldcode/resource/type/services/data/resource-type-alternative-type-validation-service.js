/**
 * Created by chlai on 2025/01/24
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.type';

	/**
	 * @ngdoc service
	 * @name resourceTypeAlternativeTypeValidationService
	 * @description provides validation methods for resource type alternative type entities
	 */
	angular.module(moduleName).service('resourceTypeAlternativeTypeValidationService', ResourceTypeAlternativeTypeValidationService);

	ResourceTypeAlternativeTypeValidationService.$inject = ['platformValidationServiceFactory', 'resourceTypeConstantValues', 'resourceTypeAlternativeTypeDataService', 'resourceTypeLookupDataService'];

	function ResourceTypeAlternativeTypeValidationService(platformValidationServiceFactory, resourceTypeConstantValues, resourceTypeAlternativeTypeDataService, resourceTypeLookupDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(resourceTypeConstantValues.schemes.alternativeResType, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceTypeConstantValues.schemes.alternativeResType)
			},
			self,
			resourceTypeAlternativeTypeDataService);

		self.validateResAlterTypeFk = function validateResAlterTypeFk(entity, value, model) {

			if(value){
				// Get related PlantGroupFk
				let typeItem = resourceTypeLookupDataService.getItemById(value, {lookupType: 'resourceTypeLookupDataService'});
				entity.PlantGroupFk = typeItem.PlantGroupFk;
				return true;
			}

			entity.PlantGroupFk = null;
			return true;
		};

	}
})(angular);
