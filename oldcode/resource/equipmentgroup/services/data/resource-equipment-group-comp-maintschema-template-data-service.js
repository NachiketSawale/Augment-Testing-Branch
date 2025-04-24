/**
 * Created by shen on 09.01.2025
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupCompMaintSchemaTemplateDataService
	 * @description provides methods to access, create and update Resource EquipmentGroup CompMaintSchemaTemplate entities
	 */
	myModule.service('resourceEquipmentGroupCompMaintSchemaTemplateDataService', ResourceEquipmentGroupCompMaintSchemaTemplateDataService);

	ResourceEquipmentGroupCompMaintSchemaTemplateDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupDataService', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentCompMaintSchemaTemplReadOnlyProcessor'];

	function ResourceEquipmentGroupCompMaintSchemaTemplateDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, resourceEquipmentGroupDataService, resourceEquipmentGroupConstantValues, resourceEquipmentCompMaintSchemaTemplReadOnlyProcessor) {
		let self = this;
		let resourcePlantGroupCompMaintSchemaTemplServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupCompMaintSchemaTemplateDataService',
				entityNameTranslationID: 'resource.equipmentgroup.compMaintSchemaTemplateEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/compmaintschematemplate/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentGroupConstantValues.schemes.compmaintschematemplate), resourceEquipmentCompMaintSchemaTemplReadOnlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'CompMaintSchemaTemplates', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourcePlantGroupCompMaintSchemaTemplServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentGroupCompMaintSchemaTemplateValidationService'
		}, resourceEquipmentGroupConstantValues.schemes.compmaintschematemplate));
	}
})(angular);