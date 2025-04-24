/**
 * Created by shen on 09.01.2025
 */

(function (angular) {
	'use strict';
	let moduleName = 'resource.equipmentgroup';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupCompMaintSchemaTemplateValidationService
	 * @description provides validation methods for resource equipmentGroup compmaintschematemplate entities
	 */
	angular.module(moduleName).service('resourceEquipmentGroupCompMaintSchemaTemplateValidationService', ResourceEquipmentGroupCompMaintSchemaTemplateValidationService);

	ResourceEquipmentGroupCompMaintSchemaTemplateValidationService.$inject = ['platformValidationServiceFactory', 'resourceEquipmentGroupCompMaintSchemaTemplateDataService'];

	function ResourceEquipmentGroupCompMaintSchemaTemplateValidationService(platformValidationServiceFactory, resourceEquipmentGroupCompMaintSchemaTemplateDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
				typeName: 'PlantGroupCompMaintSchemaTemplateDto',
				moduleSubModule: 'Resource.EquipmentGroup'
			}, {
				mandatory: ['PlantComponentTypeFk']
			},
			self,
			resourceEquipmentGroupCompMaintSchemaTemplateDataService);
	}

})(angular);
