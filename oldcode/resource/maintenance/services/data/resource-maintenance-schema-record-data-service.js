/**
 * Created by baf on 13.03.2019
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('resource.maintenance');

	/**
	 * @ngdoc service
	 * @name resourceMaintenanceSchemaRecordDataService
	 * @description pprovides methods to access, create and update resource maintenance schemaRecord entities
	 */
	myModule.service('resourceMaintenanceSchemaRecordDataService', ResourceMaintenanceSchemaRecordDataService);

	ResourceMaintenanceSchemaRecordDataService.$inject = ['_', '$http', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor','resourceMaintenanceConstantValues', 'resourceMaintenanceSchemaDataService'];

	function ResourceMaintenanceSchemaRecordDataService(_, $http, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceMaintenanceConstantValues, resourceMaintenanceSchemaDataService) {

		var self = this;
		var resourceMaintenanceSchemaRecordServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceMaintenanceSchemaRecordDataService',
				entityNameTranslationID: 'resource.maintenance.maintenanceSchemaRecordEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/maintenance/record/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceMaintenanceSchemaDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceMaintenanceConstantValues.schemes.schemaRecord)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceMaintenanceSchemaDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Records', parentService: resourceMaintenanceSchemaDataService}
				},
				translation: { uid: 'resourceMaintenanceSchemaRecordDataService',
					title: 'resource.maintenance.translationDescMaintenanceSchemeRecord',
					columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
					dtoScheme: resourceMaintenanceConstantValues.schemes.schemaRecord
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceMaintenanceSchemaRecordServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceMaintenanceSchemaRecordValidationService'
		}, resourceMaintenanceConstantValues.schemes.schemaRecord));

		serviceContainer.service.asyncListByParentId = function asyncListByParentId(parentId){
			return $http.post(globals.webApiBaseUrl + 'resource/maintenance/record/listbyparent',{PKey1 : parentId}).then(function(response){
				return response.data;
			});
		};
	}
})(angular);
